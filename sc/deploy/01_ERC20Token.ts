import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { saveContract } from "../scripts/utils"; // Giả sử bạn có hàm saveContract để lưu thông tin contract
import * as dotenv from "dotenv";
dotenv.config();

const deploy: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
    const { deployments, getNamedAccounts, network } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const name = "TokenB";
    const symbol = "TB";
    const initialSupply = 1000000;
    const data = await deploy("ERC20Token", {
        from: deployer,
        args: [name, symbol, initialSupply], 
        log: true,
        deterministicDeployment: false,
    });

    console.log("ERC20Token deployed to:", data.address);
    

    await saveContract(network.name, "ERC20Token", data.address, data.implementation!);


    try {
        await hre.run("verify:verify", {
            address: data.address,
            constructorArguments: [name, symbol, initialSupply],
        });
    } catch (e) {
        console.log("Verification failed:", e);
    }
};


deploy.tags = ["ERC20Token"];
export default deploy;
