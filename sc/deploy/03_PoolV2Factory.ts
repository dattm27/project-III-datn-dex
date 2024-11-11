import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import Web3 from "web3";
import { saveContract } from "../scripts/utils"; 
import * as dotenv from "dotenv";
dotenv.config();

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();
    const web3 = new Web3(process.env.RPC!);

    const setter = "0x944A402a91c3D6663f5520bFe23c1c1eE77BCa92";
   

    const data = await deploy("PoolV2Factory", {
        from: deployer,
        args: [],
        log: true,
        deterministicDeployment: false,
        gasPrice: (await web3.eth.getGasPrice()).toString(),
        proxy: {
            proxyContract: "OptimizedTransparentProxy",
            owner: deployer,
            execute: {
                methodName: "initialize",
                args: [setter],
            },
        }
    });

    console.log("PoolV2Factory deployed to:", data.address);

    // save contract address
    await saveContract(network.name, "PoolV2Factory", data.address, data.implementation!);

    // verify proxy contract
    try {
        // verify
        await hre.run("verify:verify", {
            address: data.address,
            constructorArguments: [setter],
        });
    } catch (e) {
        console.log(e);
    }

    // verify impl contract
    try {
        // verify
        await hre.run("verify:verify", {
            address: data.implementation,
            constructorArguments: [],
        });
    } catch (e) {
        console.log(e);
    }

};


deploy.tags = ["PoolV2Factory"];
export default deploy;
