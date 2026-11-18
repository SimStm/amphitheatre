import { describe, expect, test } from "bun:test";
import type { AdminRoomRow } from "@coliseum/shared";
import { PROVISIONED_OWNER_ID } from "../src/ids";
import {
  createGuest,
  createRoom,
  getJson,
  joinRoom,
  loginAdmin,
  makeAdminHarness,
  postJson,
} from "./helpers";

describe("admin create room", () => {
  test("creates a room with custom id, high member limit, and indefinite lifetime", async () => {
    const { app, admin } = await makeAdminHarness();
    const login = await loginAdmin(admin);
    const res = await postJson(
      admin,
      "/api/admin/rooms",
      {
        id: "MyEvent01",
        name: "Evento",
        memberLimit: 120,
        isPublic: true,
        password: "segredo-admin",
      },
      login.token,
    );
    expect(res.status).toBe(201);
    const body = (await res.json()) as AdminRoomRow;
    expect(body.id).toBe("MyEvent01");
    expect(body.memberLimit).toBe(120);
    expect(body.hasPassword).toBe(true);
    expect(body.isPublic).toBe(true);
    expect(body.present).toBe(0);
    expect(body.expiresAt).toBeNull();
    expect(body.ownerId).toBe(PROVISIONED_OWNER_ID);

    const guest = await createGuest(app, "Primeiro");
    const joined = await joinRoom(app, guest.token, "MyEvent01", "segredo-admin");
    expect(joined.status).toBe(200);
    expect(joined.body.role).toBe("owner");

    const detail = await getJson(admin, "/api/admin/rooms/MyEvent01", login.token);
    const row = (await detail.json()) as AdminRoomRow;
    expect(row.ownerId).toBe(guest.userId);
    expect(row.present).toBe(1);
  });

  test("rejects duplicate room id", async () => {
    const { app, admin } = await makeAdminHarness();
    const owner = await createGuest(app, "Host");
    const room = await createRoom(app, owner.token, { name: "Existente" });
    const login = await loginAdmin(admin);
    const res = await postJson(
      admin,
      "/api/admin/rooms",
      {
        id: room.id,
        name: "Duplicada",
        memberLimit: 50,
        isPublic: false,
      },
      login.token,
    );
    expect(res.status).toBe(409);
    const body = (await res.json()) as { error: string };
    expect(body.error).toBe("conflict");
  });

  test("expires and deletes the room after the deadline", async () => {
    const { app, admin, clock } = await makeAdminHarness();
    const login = await loginAdmin(admin);
    const res = await postJson(
      admin,
      "/api/admin/rooms",
      {
        id: "TempRoom1",
        name: "Curta",
        memberLimit: 10,
        isPublic: false,
        expiresInHours: 2,
      },
      login.token,
    );
    expect(res.status).toBe(201);
    const created = (await res.json()) as AdminRoomRow;
    expect(created.expiresAt).not.toBeNull();

    clock.advance(2 * 60 * 60 * 1000 + 1);
    const guest = await createGuest(app, "Tarde");
    const joined = await joinRoom(app, guest.token, "TempRoom1");
    expect(joined.status).toBe(404);

    const detail = await getJson(admin, "/api/admin/rooms/TempRoom1", login.token);
    expect(detail.status).toBe(404);
  });

  test("indefinite room stays after everyone leaves", async () => {
    const { app, admin } = await makeAdminHarness();
    const login = await loginAdmin(admin);
    await postJson(
      admin,
      "/api/admin/rooms",
      {
        id: "Persist01",
        name: "Persistente",
        memberLimit: 80,
        isPublic: false,
      },
      login.token,
    );
    const guest = await createGuest(app, "Visitante");
    const joined = await joinRoom(app, guest.token, "Persist01");
    expect(joined.status).toBe(200);
    await postJson(app, `/api/rooms/Persist01/leave`, {}, guest.token);

    const detail = await getJson(admin, "/api/admin/rooms/Persist01", login.token);
    expect(detail.status).toBe(200);
    const row = (await detail.json()) as AdminRoomRow;
    expect(row.present).toBe(0);
    expect(row.expiresAt).toBeNull();
  });
});
