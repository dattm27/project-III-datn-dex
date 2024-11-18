import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { saveContract } from "../scripts/utils"; // Giả sử bạn có hàm saveContract để lưu thông tin contract
import * as dotenv from "dotenv";
dotenv.config();

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const token0 = "0x457Ff8ccCA294bEd934d3c9000Ed1FE94C2b0760";
    const token1 = "0x33237b41C693bb1E86671cEe1462f98a08fe1dD2";
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
