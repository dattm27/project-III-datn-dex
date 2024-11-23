
import {IconMetamask} from "src/assets"

export enum EConnectors {
  METAMASK = "injected"
}

export const connectOptions: { type: EConnectors; icon: string; label: React.ReactNode }[] = [
  { type: EConnectors.METAMASK, icon: IconMetamask, label: "MetaMask" }
];

export enum EConnectStatus {
  RE_CONNECTING,
  NO_WALLET,
  NO_CONNECT,
  CONNECTING,
  CONNECTED,
  REQUESTING,
  SIGNING,
  SIGNED
}

// for random avatar 
export const AvatarSeeds = [
  "Andrea",
  "John",
  "Mary",
  "Steve",
  "Lucy"
];