// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import '@openzeppelin/contracts/proxy/utils/Initializable.sol';
import '../interfaces/IPoolFactory.sol';

import './PoolV2.sol';
import 'hardhat/console.sol';


contract PoolV2Factory is Initializable , IPoolFactory{
    
    address public feeTo;
    address public feeToSetter;
    
    mapping(address => mapping(address => address)) public getPool;
    address[] public allPools;

       /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address _feeToSetter) public initializer{
        feeToSetter = _feeToSetter;

    }
    function allPoolsLength() external view returns (uint) {
        return allPools.length;
    }

    function createPool(
        address tokenA,
        address tokenB
    ) external override returns (address pool) {
        require(tokenA != tokenB, 'IDENTICAL_ADDRESSES');
        (address token0, address token1) = tokenA < tokenB ? (tokenA, tokenB) : (tokenB, tokenA);
        require(token0 != address (0), 'ZERO_ADDRESS');
        require(getPool[token0][token1]== address(0), "PAIR_EXISTS");
        
        
        bytes32 salt = keccak256(abi.encodePacked(token0, token1));
        
        PoolV2 pool = (new PoolV2){salt: salt}(token0, token1);
        
        getPool[token0][token1] = address(pool);
        getPool[token1][token0] = address(pool); 
        allPools.push(address(pool));
        emit PoolCreated(token0, token1, address(pool), allPools.length);
        

    }

    function setFeeTo(address _feeTo) external override {
        require(msg.sender == feeToSetter, 'FORBIDDEN');
        feeTo = _feeTo;
    }

    function setFeeToSetter(address _feeToSetter) external override {
        require(msg.sender == feeToSetter, 'FORBIDDEN');
        feeToSetter = _feeToSetter;
    }
}