import React, { useEffect, useState } from "react";
import {  useLocation } from "react-router-dom";
import { getTokens, getPools,  } from "src/services/pools";
import { useWriteContract } from 'wagmi'
import { POOL_ABI } from "src/web3/abis"; 
import {Address} from 'viem';
import { parseUnits } from "ethers";
import "./style.css"
export const AddLiquidity: React.FC = () => {
  const location = useLocation();
  // const { poolId } = useParams<{ poolId: string }>();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [pools, setPools] = useState<Pool[]>([]);
  const [token0, setToken0] = useState<Token | null>(null);
  const [token1, setToken1] = useState<Token | null>(null);
  const [token0Amount, setToken0Amount] = useState("");
  const [token1Amount, setToken1Amount] = useState("");
  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setToken0(location.state.token0);
        setToken1(location.state.token1);
        //Lấy danh sách tokens và pools
        const tokensData = await getTokens();
        const poolsData = await getPools();
        //const pool = await getPoolDetails(poolId!);
        // console.log(pool);

        setTokens(tokensData);
        setPools(poolsData);

        //Set mặc định token0 và token1
        if (tokensData.length > 1) 
        {
          setToken0(location.state.token0);
          setToken1(location.state.token1);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    // Tìm pool tương ứng với cặp token
    if (token0 && token1) {
      const pool = pools.find(
        (p: Pool) =>
          (p.token0.symbol === token0.symbol && p.token1.symbol === token1.symbol) ||
          (p.token0.symbol === token1.symbol && p.token1.symbol === token0.symbol)
      );
      setSelectedPool(pool || null);
    }
  }, [token0, token1, pools]);

  const calculateAmount1 = (amount0: string) => {
    if (selectedPool && amount0) {
      const reserve0 = parseFloat(selectedPool.reserve0);
      const reserve1 = parseFloat(selectedPool.reserve1);
      const amount1 = (reserve1 / reserve0) * parseFloat(amount0);
      return amount1.toFixed(6);
    }
    return "";
  };

  const calculateAmount0 = (amount1: string) => {
    if (selectedPool && amount1) {
      const reserve0 = parseFloat(selectedPool.reserve0);
      const reserve1 = parseFloat(selectedPool.reserve1);
      const amount0 = (reserve0 / reserve1) * parseFloat(amount1);
      return amount0.toFixed(6);
    }
    return "";
  };
  const { data: hash, writeContract } = useWriteContract();

  const handleAddLiquidity = async(poolId: string, amount0: string, amount1: string)   => {
    try {
      writeContract({
        abi: POOL_ABI,
        address: poolId as Address,
        functionName: 'addLiquidity',
        args: [
          parseUnits(amount0),
          parseUnits(amount1),
        ],
      });
    } catch (error) {
      console.error("Transaction failed:", error);
    }
  }

  return (
    <div className="add-liquidity-container">
      <h1>Add Liquidity</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
            console.log(`Adding liquidity: ${token0Amount} ${token0?.symbol}, ${token1Amount} ${token1?.symbol}`);
        }}
        className="add-liquidity-form"
      >
        <div className="form-row">
          <label className="form-label">Select Pair:</label>
          <div className="dropdown-row">
            <select
              value={token0?.symbol || ""}
              onChange={(e) => setToken0(tokens.find((t) => t.symbol === e.target.value) || null)}
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
            <select
              value={token1?.symbol || ""}
              onChange={(e) => setToken1(tokens.find((t) => t.symbol === e.target.value) || null)}
            >
              {tokens.map((token) => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol} - {token.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <label className="form-label">Deposit Amount:</label>
          <div className="input-row">
            <input
              type="number"
              placeholder={`Amount for ${token0?.symbol || ""}`}
              value={token0Amount}
              onChange={(e) => {
                setToken0Amount(e.target.value);
                setToken1Amount(calculateAmount1(e.target.value));
              }}
              required
            />
            <input
              type="number"
              placeholder={`Amount for ${token1?.symbol || ""}`}
              value={token1Amount}
              onChange={(e) => {
                setToken1Amount(e.target.value);
                setToken0Amount(calculateAmount0(e.target.value));
              }}
              required
            />
          </div>
        </div>
        <button type="submit" className="submit-btn" onClick={() => {handleAddLiquidity(selectedPool!.id, token0Amount, token1Amount)}}>
          Add Liquidity
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
      </form>
    </div>
  );
};



