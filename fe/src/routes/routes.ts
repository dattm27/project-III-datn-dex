import { RouteProps } from "react-router-dom";
import { PATHS } from "./paths";
import { Explore,Home,Pool } from "src/pages";

export const routes: RouteProps[] = [
    {path: PATHS.HOME, Component: Home},
    {path: PATHS.EXPLORE, Component: Explore},
    {path: PATHS.POOL, Component: Pool}
];