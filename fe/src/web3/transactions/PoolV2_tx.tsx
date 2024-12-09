import { useWriteContract } from "wagmi";
import { POOL_ABI } from "../abis";
import { ethers } from "ethers";
import { toBigInt } from "ethers";
import { Address } from 'viem'
export const AddLiquidityButton = ({
  poolAddress,
  token0Amount,
  token1Amount,
  token0Decimals,
  token1Decimals,
}: {
  poolAddress: string;
  token0Amount: string;
  token1Amount: string;
  token0Decimals: number;
  token1Decimals: number;
}) => {
  // Sử dụng `useWriteContract` để gửi giao dịch
  const { writeContract } = useWriteContract();

  const handleAddLiquidity = () => {
    // Chuyển đổi số lượng token sang BigInt
    const parsedToken0Amount = ethers.parseUnits(token0Amount, token0Decimals);
    const parsedToken1Amount = ethers.parseUnits(token1Amount, token1Decimals);

    writeContract({
      abi: POOL_ABI, // ABI của pool contract
      address: poolAddress as Address, // Địa chỉ pool contract
      functionName: "addLiquidity", // Hàm addLiquidity trên contract
      args: [
        toBigInt(parsedToken0Amount), // Lượng token0
        toBigInt(parsedToken1Amount), // Lượng token1
      ],
    });
  };

  return (
    <button
      onClick={handleAddLiquidity}
      className="submit-btn"
    >
      Add Liquidity
    </button>
  );
};
