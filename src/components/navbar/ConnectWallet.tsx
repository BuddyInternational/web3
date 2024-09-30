import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";

// Type for chain information
interface Chain {
  chainId: number;
  name: string;
  currency: string;
  explorerUrl: string;
  rpcUrl: string;
}

// 1. Get projectId
const projectId: any = process.env.REACT_APP_WALLET_PROJECT_ID;

// 2. Set chains
const mainnet: Chain = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

const polygon: Chain = {
  chainId: 137,
  name: "Polygon",
  currency: "Matic",
  explorerUrl: "https://polygonscan.com/",
  rpcUrl: "https://polygon-rpc.com/",
};

const arbitrum: Chain = {
  chainId: 42161,
  name: "Arbitrum One",
  currency: "ETH",
  explorerUrl: "https://arbiscan.io/",
  rpcUrl: "https://arb1.arbitrum.io/rpc",
};

const sepolia: Chain = {
  chainId: 11155111,
  name: "Sepolia Testnet",
  currency: "SepoliaETH",
  explorerUrl: "https://sepolia.etherscan.io",
  rpcUrl: "https://sepolia.infura.io/v3/",
};

// 3. Create a metadata object
const metadata = {
  name: "",
  description: "",
  url: "", // origin must match your domain & subdomain
  icons: [""],
};

// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
  auth: {
    email: false,
    socials: [],
    showWallets: false,
    walletFeatures: false,
  },
});

// 5. Create a AppKit instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet, polygon, arbitrum, sepolia],
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

export default function App() {
  return (
    <div className="flex flex-row justify-end px-2 py-6">
      <w3m-button />
    </div>
  );
}
