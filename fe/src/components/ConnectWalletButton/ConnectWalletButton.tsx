import { Account, WalletOptions } from "../Layout";
import { useAccount } from "wagmi";
import { Modal, Button } from "antd";
import React, { useState, useEffect } from "react";

interface ConnectWalletProps {
  size?: 'large' | 'middle' | 'small';
  block?: boolean;
}


export function ConnectWallet({ size = 'middle', block = false }: ConnectWalletProps) {
  const { isConnected } = useAccount()
  const [visible, setVisible] = useState(false)

  // Hiển thị modal khi người dùng nhấn nút Connect Wallet
  const showModal = () => {
    setVisible(true)
  }

  // Đóng modal khi người dùng cancel hoặc close
  const handleCancel = () => {
    setVisible(false)
  }

  useEffect(() => {
    if (isConnected) {
      setVisible(false); // Đảm bảo modal không hiển thị khi disconnect
    }
  }, [isConnected]);

  // Nếu người dùng đã kết nối, hiển thị Account
  if (isConnected) {
    return <Account />
  }

  return (
    <>
      {/* Nút Connect Wallet */}
      <Button type="primary" onClick={showModal} size={size} block={block}>
        Connect Wallet
      </Button>

      {/* Modal chọn ví */}
      <Modal
        title="Select a Wallet"
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={300}

      >
        <WalletOptions />
      </Modal>
    </>
  )
}