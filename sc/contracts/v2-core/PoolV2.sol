// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';


import '../interfaces/IPoolV2.sol';
import '../interfaces/IPoolFactory.sol';
import '../libraries/SafeMath.sol';
import '../libraries/Math.sol';



contract PoolV2 is IPoolV2 {
   
    using SafeMath for uint;
    address public immutable factory;

    address public immutable token0;
    address public immutable token1;

    uint public reserve0;
    uint public reserve1;

    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    uint private unlocked = 1;
    modifier nonReentrant() {
        require(unlocked == 1, "LOCKED");
        unlocked = 0;
        _;
        unlocked = 1;
    }

    constructor(address _token0, address _token1) {
        token0 = _token0;
        token1 = _token1;
        factory = msg.sender;
    }

    function _mint(address _to, uint _amount) private {
        totalSupply = totalSupply.add(_amount);
        balanceOf[_to] = balanceOf[_to].add(_amount);
    }

    function _burn(address _from, uint _amount) private {
        totalSupply = totalSupply.sub(_amount);
        balanceOf[_from] = balanceOf[_from].sub(_amount);
    }

    function _update(uint res0, uint res1) private {
        reserve0 = res0;
        reserve1 = res1;
        emit Sync(reserve0, reserve1);

    }

    //swap exact token 
    function swap(
        address _tokenIn,
        uint _amountIn
    ) external nonReentrant returns (uint amountOut) {
        require(
            _tokenIn == token0 || _tokenIn == token1,
            "Invalid token"
        );
        bool isToken0 = _tokenIn == token0;
        (address tokenIn, address tokenOut, uint resIn, uint resOut) = isToken0
            ? (token0, token1, reserve0, reserve1)
            : (token1, token0, reserve1, reserve0);

        IERC20(tokenIn).transferFrom(msg.sender, address(this), _amountIn);
        uint amountInWithFee = _amountIn.mul(997) / 1000;

        //dy = ydx/(x + dx)
        amountOut = resOut.mul(amountInWithFee) / (resIn.add(amountInWithFee));

        IERC20(tokenOut).transfer(msg.sender, amountOut);

        _update(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this))
        );

        if (isToken0){
            emit Swap(msg.sender, amountInWithFee, 0, 0, amountOut);
        }
        else {
            emit Swap(msg.sender, 0, amountInWithFee, amountOut, 0);
        }
           
    }
    
    //swap for exact token
    function swapFor(
        address _tokenOut,
        uint _amountOut
    ) external override returns (uint amountIn) {
        require(_tokenOut == token0 || _tokenOut == token1, 
        'Invalid token' );
        bool isToken0 = _tokenOut == token0;
        (address tokenIn, address tokenOut, uint resIn, uint resOut) = isToken0
            ? (token1, token0, reserve1, reserve0)
            : (token0, token1, reserve0, reserve1);
        
        //dx = xdy/(y - dy) 
        amountIn = (resIn.mul(_amountOut) ) / (resOut.sub(_amountOut));
        
        //include trading fee
        amountIn = amountIn.mul(1003) / 1000; 

        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);
        IERC20(tokenOut).transfer(msg.sender, _amountOut);

        _update(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this))
        );

        if (isToken0){
            emit Swap(msg.sender, 0, amountIn, _amountOut, 0);
        }
        else {
            emit Swap(msg.sender, amountIn, 0, 0, _amountOut);
        }

    }

    function addLiquidity(
        uint _amount0,
        uint _amount1
    ) external nonReentrant returns (uint shares) {
        //x/y = dx / dy
        IERC20(token0).transferFrom(msg.sender, address(this), _amount0);
        IERC20(token1).transferFrom(msg.sender, address(this), _amount1);

        if (reserve0 > 0 || reserve1 > 0) {
            require(reserve0.mul(_amount1) == reserve1.mul(_amount0), "x/y != dx/dy");
        }

        //s = (dx * T)/X = (dy * T)/ Y
        if (totalSupply == 0) {
            shares = Math.sqrt(_amount0.mul(_amount1));
        } else {
            shares =  Math.min(
                (_amount0.mul(totalSupply)) / reserve0,
                (_amount1.mul(totalSupply)) / reserve1
            );
        }
        require(shares > 0, "shares  = 0 ");
        _mint(msg.sender, shares);
        _update(
            IERC20(token0).balanceOf(address(this)),
            IERC20(token1).balanceOf(address(this))
        );

        emit AddLiquidity(msg.sender, _amount0, _amount1);
    }

    function removeLiquidity(
        uint _shares
    ) external nonReentrant returns (uint amount0, uint amount1) {
        uint bal0 = IERC20(token0).balanceOf(address(this));
        uint bal1 = IERC20(token1).balanceOf(address(this));

        // dx = (X * s) / T and dy = (Y * s) / T
        amount0 = (_shares.mul(bal0)) / totalSupply;
        amount1 = (_shares.mul(bal1)) / totalSupply;

        require(amount0 > 0 && amount1 > 0, "amount0 or amount1 = 0");

        _burn(msg.sender, _shares);
        _update(bal0.sub(amount0), bal1.sub(amount1));
        IERC20(token0).transfer(msg.sender, amount0);
        IERC20(token1).transfer(msg.sender, amount1);

        emit RemoveLiquidity(msg.sender, amount0, amount1);
        
    }

    
    // view
    function getAmountOut(
        address _tokenIn,
        uint _amountIn
    ) public view returns (uint amountOut) {
        require(
            _tokenIn == address(token0) || _tokenIn == token1,
            "Invalid token"
        );
        bool isToken0 = _tokenIn == token0;
        (uint resIn, uint resOut) = isToken0
            ? (reserve0, reserve1)
            : (reserve1, reserve0);

        uint amountInWithFee = (_amountIn.mul(997)) / 1000;
        amountOut = (resOut.mul(amountInWithFee)) / (resIn.add(amountInWithFee));
    }

    function getAmountIn(
        address tokenOut,
        uint256 amountOut
    ) external view returns (uint256 amountIn) {
        require(amountOut > 0, "Amount out must be greater than zero");
        require(
            tokenOut == address(token0) || tokenOut == address(token1),
            "Invalid token"
        );

        uint256 reserveIn = tokenOut == token0
            ? IERC20(token1).balanceOf(address(this))
            : IERC20(token0).balanceOf(address(this));

        uint256 reserveOut = tokenOut == token0
            ? IERC20(token0).balanceOf(address(this))
            : IERC20(token1).balanceOf(address(this));

        amountIn = (reserveIn.mul(amountOut))/ (reserveOut.sub(amountOut));
        amountIn = amountIn.mul(1003) / 1000;
    }


   
}