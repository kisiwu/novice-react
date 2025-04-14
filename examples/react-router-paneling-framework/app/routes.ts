import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route('paneling/*', 'routes/paneling.tsx')
] satisfies RouteConfig;
