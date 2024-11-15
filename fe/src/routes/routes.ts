import { RouteProps } from "react-router-dom";
import { PATHS } from "./paths";
import { Explore,Home,Pool, PoolDetails } from "src/pages";

export const routes: RouteProps[] = [
    {path: PATHS.HOME, Component: Home},
    {path: PATHS.EXPLORE, Component: Explore},
    {path: PATHS.EXPLORE_POOL, Component: PoolDetails},
    {path: PATHS.POOL, Component: Pool}
];