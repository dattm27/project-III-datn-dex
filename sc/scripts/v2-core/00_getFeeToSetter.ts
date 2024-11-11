
import Web3 from "web3";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

import * as fs from "fs";


const web3 = new Web3(process.env.RPC!);
console.log(process.env.RPC);
const user_pk = process.env.PK;

const user = web3.eth.accounts.privateKeyToAccount(user_pk!).address;
const addresses = JSON.parse(fs.readFileSync("./contract-addresses.json", "utf-8"));

const address = addresses.fuji.PoolV2Factory.address;

async function main() {


  const PoolV2Factory = JSON.parse(
    fs.readFileSync(
        "./artifacts/contracts/v2-core/PoolV2Factory.sol/PoolV2Factory.json",
        "utf-8"
    )
).abi;



  const contract = new web3.eth.Contract(PoolV2Factory, address);


  const txData = await contract.methods
    .feeToSetter()
    .call();
  console.log(txData);

  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
