// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IPoolFactory {
    event PoolCreated(address indexed token0, address indexed token1, address pair, uint);
    
    function feeTo() external view returns (address);
    function feeToSetter() external view returns (address);

    function getPool(address tokenA, address tokenB) external view returns (address pair);
    function allPools(uint) external view returns (address pair);
    function allPoolsLength() external view returns (uint);

    function createPool(address tokenA, address tokenB) external returns (address pair);

    function setFeeTo(address) external;
    function setFeeToSetter(address) external;
}