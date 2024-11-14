import React, { useState } from "react";
import Web3Modal from "web3modal";
import { Web3Provider, ExternalProvider} from "@ethersproject/providers";
import createCoinbaseWalletSDK from "@coinbase/wallet-sdk";
import { useAuth } from "../../contexts";
import { EConnectors, EConnectStatus } from "src/constants/web3";


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

      // Mở Web3Modal và kết nối với ví
      const instance = await web3Modal.connect();

      // Tạo provider từ instance đã kết nối
      const provider = new Web3Provider(instance as ExternalProvider);

      // Yêu cầu người dùng cấp quyền truy cập tài khoản (eth_requestAccounts)
      await provider.send("eth_requestAccounts", []);

      // Đặt provider cho trạng thái web3Provider
      setWeb3Provider(provider);

      // Lấy signer và địa chỉ của người dùng
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      setAddress(userAddress);
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
// WalletConnectButton component to trigger wallet connection
export const WalletConnectButton = () => {
  const { address, status, handleConnect, logout } = useAuth();

  const handleButtonClick = () => {
    console.log(status);
    if (status === EConnectStatus.CONNECTED) {
      logout();
    } else {
      handleConnect(EConnectors.METAMASK);
      console.log("handle click");
    }
  };

  return (
    <button className="wallet-button" onClick={handleButtonClick}>
      {status === EConnectStatus.CONNECTED && address ? `Connected: ${address}` : 'Connect Wallet'}
    </button>
  );
};