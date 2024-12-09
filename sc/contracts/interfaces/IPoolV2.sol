// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPoolV2 {
   
    event AddLiquidity(address indexed sender, uint amount0, uint amount1, uint shares); 
    event RemoveLiquidity(address indexed sennder, uint amount0, uint amount1, uint shares);
    event Swap (
        address indexed sender,
        uint amount0In, 
        uint amount1In,
        uint amount0Out,
        uint amount1Out
    );
    event Sync (uint reserve0 , uint reserve1);
    
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);

    function swap(address _tokenIn, uint _amountIn) external  returns (uint amountOut);
    function swapFor(address _tokenOut, uint _amountOut) external returns (uint amountIn);
    function addLiquidity(uint _amount0, uint _amount1) external returns (uint shares);
    function removeLiquidity(uint _shares) external returns (uint amount0, uint amount1) ;

}