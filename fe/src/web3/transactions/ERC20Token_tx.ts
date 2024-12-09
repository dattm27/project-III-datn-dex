import { ethers } from "ethers";
import { ERC20_ABI } from "../abis";

/**
 * Check allowance of a token.
 */
export const checkAllowance = async (
    provider: ethers.BrowserProvider,
    owner: string,
    spender: string,
    tokenAddress: string
  ): Promise<bigint> => {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const allowance = await tokenContract.allowance(owner, spender);
    return ethers.toBigInt(allowance);
  };

/**
 * Approve a token for spending.
 */
export const approveToken = async (
    signer: ethers.Signer,
    spender: string,
    tokenAddress: string,
    additionalAmount: bigint
  ): Promise<void> => {
    const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);
    const tx = await tokenContract.approve(spender, additionalAmount);
    await tx.wait();
  };



