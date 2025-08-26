import Header from "~/layout/Header";
import type { Route } from "../+types/layout/_app";
import SidebarLayout from "../../layout/SidebarLayout";

export default function AppLayout() {
  return (
    <>
      <Header />
      <SidebarLayout />
    </>
  );
}

export function clientAction({}: Route.ClientActionArgs) {}
