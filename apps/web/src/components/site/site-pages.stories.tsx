import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import { useMemo, type ReactElement } from "react";
import { AboutPage } from "./about-page.tsx";
import { WhatIsPage } from "./what-is-page.tsx";

function SitePageHarness({ page, path }: { page: () => ReactElement; path: string }) {
  const router = useMemo(
    () =>
      createRouter({
        routeTree: createRootRoute({ component: page }),
        history: createMemoryHistory({ initialEntries: [path] }),
      }),
    [page, path],
  );
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <RouterProvider router={router as never} />
    </div>
  );
}

const meta = {
  title: "Site/Pages",
  component: SitePageHarness,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SitePageHarness>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WhatIs: Story = { args: { page: WhatIsPage, path: "/what-is" } };
export const About: Story = { args: { page: AboutPage, path: "/about" } };
