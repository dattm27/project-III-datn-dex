import { useQueryClient } from "@tanstack/react-query";

import  { createContext, useState,  useEffect, ReactNode, useCallback } from 'react';

import { useAccount, useConnect, useDisconnect } from 'wagmi';
import { Address } from 'viem';
import { EConnectors, EConnectStatus,  } from "src/constants/web3";

// Interface for Auth State
interface IAuthState {
  logout: () => void;
  status: EConnectStatus;
  address?: Address;
  handleConnect: (type: EConnectors) => Promise<void | null>;
  initialized: boolean;
}

// AuthContext to manage wallet connection
export const AuthContext = createContext<IAuthState>({
  logout: () => null,
  status: EConnectStatus.RE_CONNECTING,
  handleConnect: async () => null,
  initialized: false
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [initialized, setInitialized] = useState(false);
  const { address } = useAccount();
  const { connectors, connectAsync } = useConnect();
  const [status, setStatus] = useState(EConnectStatus.RE_CONNECTING);
  const { disconnectAsync } = useDisconnect();

  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    try {
      await disconnectAsync();
      queryClient.clear();
      setStatus(EConnectStatus.NO_CONNECT);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [disconnectAsync]);

  useEffect(() => {
    // Listen to change in address
    if (!address) logout();
    else {
      setStatus(EConnectStatus.CONNECTED);
    }
  }, [address, logout]);
  useEffect(() => {
    console.log("Available connectors:", connectors);
  }, [connectors]);
  const handleConnect = useCallback(
    async (type: EConnectors) => {
      setStatus(EConnectStatus.CONNECTING);
      // Set connector and connect status for effect next step
      try {
        const connector = connectors.find((item) => item.id === type);
        if (!connector) return setStatus(EConnectStatus.NO_CONNECT);
        if (type === EConnectors.METAMASK && !window?.ethereum?.isMetaMask) {
          return setStatus(EConnectStatus.NO_WALLET);
        }
        await connectAsync({ connector });
        setStatus(EConnectStatus.CONNECTED);
        console.log(status.toString());
      } catch (error) {
        logout();
        console.error('Connection failed:', error);
      }
    },
    [connectors, connectAsync, logout]
  );

  useEffect(() => {
    (async () => {
      if (status !== EConnectStatus.CONNECTED || !address) {
        return setInitialized(true);
      }
      //setStatus(EConnectStatus.SIGNING);
      setInitialized(true);
    })();
  }, [address, status]);

  return (
    <AuthContext.Provider value={{ logout, status, handleConnect, initialized, address }}>
      {children}
    </AuthContext.Provider>
  );
};

