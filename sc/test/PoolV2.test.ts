import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { parseUnits } from "ethers";


describe("PoolV2", function () {
    async function deployPoolV2Fixture() {
        const [owner, otherAccount] = await ethers.getSigners();

        // Deploy two mock ERC20 tokens
        const Token = await hre.ethers.getContractFactory("ERC20Token");
        const token0 = await Token.deploy("DAI", "DAI", 0);
        const token1 = await Token.deploy("ETH", "ETH", 0);

        // Deploy the PoolV2 contract with the two tokens
        const PoolV2 = await hre.ethers.getContractFactory("PoolV2");
        const pool = await PoolV2.deploy(await token0.getAddress(), await token1.getAddress());

        // Mint initial token amounts for testing
        await token0.mint(owner.address, parseUnits("100000"));
        await token1.mint(owner.address, parseUnits("100000"));
        await token0.connect(owner).approve(await pool.getAddress(), parseUnits("10000"));
        await token1.connect(owner).approve(await pool.getAddress(), parseUnits("10")); 
        console.log(parseUnits("10000"));
        console.log (parseUnits("10"));
        return { pool, token0, token1, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right tokens", async function () {
            const { pool, token0, token1 } = await loadFixture(deployPoolV2Fixture);
            expect(await pool.token0()).to.equal(await token0.getAddress());
            expect(await pool.token1()).to.equal(await token1.getAddress());
        });
    });

    describe("Adding Liquidity", function () {
        it("Should add liquidity and mint LP shares", async function () {
            const { pool, token0, token1, owner } = await loadFixture(deployPoolV2Fixture);

            await pool.addLiquidity(parseUnits("10000"), parseUnits("10"));  //add 10000 DAI, 10 ETH to pool

            expect(await pool.totalSupply()).to.be.gt(0);
            expect(await pool.balanceOf(owner.address)).to.be.gt(0);
        });
    });

    describe("Swapping Tokens", function () {
        it("Should correctly swap token0 for token1", async function () {
            const { pool, token0, token1, owner } = await loadFixture(deployPoolV2Fixture);

            await pool.addLiquidity(parseUnits("10000"), parseUnits("10"));  //add 10000 DAI, 10 ETH to pool

            const balanceBefore = await token1.balanceOf(owner.address);
       
            const amountIn = await pool.getAmountIn(await token1.getAddress(), parseUnits("1"));
            const amountOut = await pool.getAmountOut(await token0.getAddress(),  amountIn  );
            await token0.connect(owner).approve(await pool.getAddress(), amountIn);

            
            console.log(amountIn);
            console.log(amountOut);

            await pool.swap(await token0.getAddress(), amountIn );
            

            expect(await token1.balanceOf(owner.address)).to.equal(balanceBefore + amountOut);
        });

        it("Should fail if trying to swap unsupported token", async function () {
            const { pool, owner } = await loadFixture(deployPoolV2Fixture);

            await expect(pool.swap(owner.address, parseUnits("10"))).to.be.revertedWith(
                "Invalid token"
            );
        });
    });

    describe("Removing Liquidity", function () {
        it("Should remove liquidity and burn LP shares", async function () {
            const { pool, token0, token1, owner } = await loadFixture(deployPoolV2Fixture);

            await pool.addLiquidity(parseUnits("10000"), parseUnits("10"));  //add 10000 DAI, 10 ETH to pool
  
            const balanceBefore0 = await token0.balanceOf(owner.address);
            const balanceBefore1 = await token1.balanceOf(owner.address);

            await pool.removeLiquidity(await pool.balanceOf(owner.address));

            const balanceAfter0 = await token0.balanceOf(owner.address);
            const balanceAfter1 = await token1.balanceOf(owner.address);

            expect(balanceAfter0).to.be.gt(balanceBefore0);
            expect(balanceAfter1).to.be.gt(balanceBefore1);
            expect(await pool.totalSupply()).to.equal(0);
        });
    });
});
