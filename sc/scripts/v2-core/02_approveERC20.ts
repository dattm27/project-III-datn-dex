// script to interact with smart contract

import Web3 from "web3";
import { ethers, parseUnits } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

import * as fs from "fs";
import { token } from "../../typechain-types/@openzeppelin/contracts";
const addresses = JSON.parse(fs.readFileSync("./contract-addresses.json", "utf-8"));
const tokens = addresses.fuji.tokens;
const address = tokens.USDT; // the contract interacting with 
const amount = parseUnits("1000");

const web3 = new Web3(process.env.RPC!);
console.log(process.env.RPC);
const user_pk = process.env.PK;

const user = web3.eth.accounts.privateKeyToAccount(user_pk!).address;



async function main() {
   

    const ERC20Token = JSON.parse(
        fs.readFileSync(
            "./artifacts/contracts/ERC20Token.sol/ERC20Token.json",
            "utf-8"
        )
    ).abi;

    const txCount = await web3.eth.getTransactionCount(user);
    const contract = new web3.eth.Contract(ERC20Token, address);
    
    //agrs

    const txData = contract.methods
        .approve("0x8Cf1c5355EC13868a95AF95de87a459524B2C51D",parseUnits("1000"))
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