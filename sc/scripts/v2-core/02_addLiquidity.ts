// script to interact with smart contract

import Web3 from "web3";
import { ethers } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

import * as fs from "fs";
const address = "0x42aCEf64fbd3250cea0B6FD9796A46e9073dA0ba"; // the contract interacting with 
const addresses = JSON.parse(fs.readFileSync("./contract-addresses.json", "utf-8"));
const tokens = addresses.fuji.tokens;


const web3 = new Web3(process.env.RPC!);
console.log(process.env.RPC);
const user_pk = process.env.PK;

const user = web3.eth.accounts.privateKeyToAccount(user_pk!).address;



async function main() {
   

    const PoolV2Factory = JSON.parse(
        fs.readFileSync(
            "./artifacts/contracts/v2-core/PoolV2.sol/PoolV2.json",
            "utf-8"
        )
    ).abi;

    const txCount = await web3.eth.getTransactionCount(user);
    const contract = new web3.eth.Contract(PoolV2Factory, address);
    
    //agrs

    const txData = contract.methods
        .addLiquidity(100000000000000000,100000000000000000)
        .encodeABI();
    console.log(txData);

    const calculateFeeData = await web3.eth.calculateFeeData()
    const txObj = {
        nonce: txCount,
        gas: web3.utils.toHex(10000000), //adjust gas allocated for the tx
        gasPrice: await web3.eth.getGasPrice(),
        data: txData,
        to: address,
        from: user,
    };

    const signedTx = await web3.eth.accounts.signTransaction(txObj, user_pk!);

    const result = await web3.eth.sendSignedTransaction(
        signedTx.rawTransaction!
    );
    console.log(result);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});