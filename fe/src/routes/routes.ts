import { RouteProps } from "react-router-dom";
import { PATHS } from "./paths";
import { Explore,Home,Pool, PoolDetails } from "src/pages";
import { AddLiquidity } from "src/pages/AddLiquidity";
import RemoveLiquidityModal from "src/pages/RemoveLiquidity/RemoveLiquidity";

export const routes: RouteProps[] = [
    {path: PATHS.HOME, Component: Home},
    {path: PATHS.EXPLORE, Component: Explore},
    {path: PATHS.EXPLORE_POOL, Component: PoolDetails},
    {path: PATHS.POOL, Component: Pool},
    {path: PATHS.ADD_LIQUIDITY, Component: AddLiquidity},
    {path: PATHS.REMOVE_LIQUIDITY, Component: RemoveLiquidityModal}
];