import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { concat, Contract, getDefaultProvider, parseUnits, toBigInt, toNumber } from "ethers";
import { encoder } from "./shared/utilities";
import { keccak256 } from "ethers";
import { getCreate2Address, solidityPacked } from "ethers";


describe("PoolV2Factory", function () {

    async function deployPoolV2Fixture() {
        const [owner, otherAccount] = await ethers.getSigners();

        // Deploy two mock ERC20 tokens
        const Token = await hre.ethers.getContractFactory("ERC20Token");
        const DAI = await Token.deploy("DAI", "DAI");
        const ETH = await Token.deploy("ETH", "ETH");

        // Deploy the PoolV2 contract with the two tokens
        const PoolV2Factory = await hre.ethers.getContractFactory("PoolV2Factory");
        const poolV2Factory = await hre.upgrades.deployProxy(
            PoolV2Factory,
            [await owner.getAddress()],
            {initializer:  "initialize", kind: "transparent" }
        )
        poolV2Factory.waitForDeployment();
        // await PoolV2Factory.deploy(owner);

        const PoolV2 = await hre.ethers.getContractFactory("PoolV2");
        return { poolV2Factory, PoolV2,  DAI, ETH, owner, otherAccount };
    }

    describe("Deployment", function () {
        it("Should set the right feeToSetter", async function () {
            const { 
                poolV2Factory, 
                PoolV2,
                DAI, 
                ETH, 
                owner, 
                otherAccount 
            } 
            = await loadFixture(deployPoolV2Fixture);
            expect (await poolV2Factory.feeToSetter()).to.equal(owner);
           
        });
    });

    describe("Create Pool", function () {
        it ("Should create pool successfully", async function () {
            const { 
                poolV2Factory, 
                PoolV2,
                DAI, 
                ETH, 
                owner, 
                otherAccount 
            } 
            = await loadFixture(deployPoolV2Fixture);
   
            //predict the smart contract address
            const bytecode = PoolV2.bytecode;
            const tokenA = await ETH.getAddress();
            const tokenB = await DAI.getAddress();
            const [token0, token1] = tokenA < tokenB ? [tokenA, tokenB] : [tokenB, tokenA];
            const bytecodeHash = keccak256(concat([bytecode, encoder(['address', 'address'],[token0, token1])]));

            const salt = keccak256(solidityPacked(['address', 'address'], [token0, token1]));
            const create2Address = getCreate2Address((await poolV2Factory.getAddress()), salt, bytecodeHash);

            //create PoolV2 Contract 
            await expect(poolV2Factory.createPool(DAI, ETH))
              .to.emit(poolV2Factory, 'PoolCreated')
              .withArgs( token0 , token1, create2Address, toNumber(1));
            
            await expect(poolV2Factory.createPool(ETH, DAI)).to.be.reverted;
            expect(await poolV2Factory.getPool(ETH, DAI)).to.be.equal(create2Address);
            expect(await poolV2Factory.getPool(DAI, ETH)).to.be.equal(create2Address);
            expect(await poolV2Factory.allPools(0)).to.be.equal(create2Address);
            expect(await poolV2Factory.allPoolsLength()).to.be.equal(1);

            //test the created pool contract
            const poolV2 = await ethers.getContractAt("PoolV2", create2Address); 
            expect (await poolV2.factory()).to.be.equal(await poolV2Factory.getAddress());
            expect (await poolV2.token0()).to.be.equal(token0);
            expect (await poolV2.token1()).to.be.equal(token1);
            
        }); 
    });

  });
