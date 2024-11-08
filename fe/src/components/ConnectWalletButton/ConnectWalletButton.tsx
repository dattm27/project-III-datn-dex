import React, { useState } from "react";
import Web3Modal from "web3modal";
import { Web3Provider } from "@ethersproject/providers";
import createCoinbaseWalletSDK from "@coinbase/wallet-sdk";


const providerOptions = {
  coinbaseWallet: {
    package: createCoinbaseWalletSDK,
    options: {
      appName: "Dex",
      infuraId: "your_infura_project_id", 
    },
  },
 
};

export function ConnectWalletButton () {
  const [web3Provider, setWeb3Provider] = useState<Web3Provider | null>(null);
  const [address, setAddress] = useState<string | null>(null);

  const connectWallet = async () => {
    try {
      const web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
      });

      const instance = await web3Modal.connect();
      const provider = new Web3Provider(instance);

      if (provider) {
        setWeb3Provider(provider);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        setAddress(userAddress);
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  return (
    <div>
      {web3Provider == null ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <button>{address}</button>
      )}
    </div>
  );
};


