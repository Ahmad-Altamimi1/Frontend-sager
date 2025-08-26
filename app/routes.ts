import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/layout/_index.tsx", [
    route("map", "routes/map/_index.tsx"),
    index("routes/home.tsx"),
  ]),
] satisfies RouteConfig;
