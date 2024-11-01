import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { saveContract } from "../scripts/utils"; // Giả sử bạn có hàm saveContract để lưu thông tin contract
import * as dotenv from "dotenv";
dotenv.config();

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const token0 = "0xDf14196B82548C685c1123E5f8686783E135fDF5";
    const token1 = "0xD63d1Cf8C3B29629D473C6CC9baC282e6d0676B5";
    const data = await deploy("PoolV2", {
        from: deployer,
        args: [token0 , token1], 
        log: true,
        deterministicDeployment: false,
    });

    console.log("PoolV2 deployed to:", data.address);
    

    await saveContract(network.name, "PoolV2", data.address, data.implementation!);


    try {
        await hre.run("verify:verify", {
            address: data.address,
            constructorArguments: [token0 , token1],
        });
    } catch (e) {
        console.log("Verification failed:", e);
    }
};


deploy.tags = ["PoolV2"];
export default deploy;
