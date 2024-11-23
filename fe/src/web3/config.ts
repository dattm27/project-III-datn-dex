import { RPC_URL } from "src/constants";
import { createConfig, http } from "wagmi";
import { avalancheFuji } from "wagmi/chains";
import { injected} from "wagmi/connectors";

export const config = createConfig({
  multiInjectedProviderDiscovery: false,
  chains: [avalancheFuji],
  connectors: [injected()],
  transports: { [avalancheFuji.id]: http(RPC_URL) }
});
