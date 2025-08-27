import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sager Drone" },
    { name: "description", content: "Welcome to Sager Drone!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
