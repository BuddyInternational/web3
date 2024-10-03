import { Button } from "@mui/material";
import {
  createWeb3Modal,
  defaultConfig,
  useDisconnect,
  useWeb3Modal,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { useRef, useState } from "react";
import { FaCheck, FaRegCopy } from "react-icons/fa";

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
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useWeb3ModalAccount();
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const copyAddressTimeoutRef: any = useRef(null);
  return (
    <>
      <div className="flex sm:items-center md:justify-between md:flex-row sm:flex-col-reverse">
        {/* connected address */}
        <div className="py-2 md:pl-14 sm:pl-0 flex md:flex-row sm:flex-col md:gap-3 sm:gap-1 justify-center">
          {address && (
            <>
              <div className="text-[#5692D9] font-normal font-sans text-base">
                Connected Address :
              </div>
              <div className="flex flex-col">
                <div className="text-white flex gap-3 font-normal font-sans text-sm">
                  <span className="mt-1">
                    {address?.slice(0, 6)}... {address?.slice(-4)}
                  </span>
                  <span className="">
                    {isAddressCopied ? (
                      <FaCheck className="mt-1 text-green-500 cursor-pointer" />
                    ) : (
                      <FaRegCopy
                        onClick={() => {
                          navigator.clipboard.writeText(address || "");
                          setIsAddressCopied(true);
                          clearTimeout(copyAddressTimeoutRef.current);
                          copyAddressTimeoutRef.current = setTimeout(() => {
                            setIsAddressCopied(false);
                          }, 1000);
                        }}
                        className="text-[#5692D9] font-thin mt-1 "
                        data-tip="Copy Wallet Address"
                        data-tip-content=".tooltip"
                      />
                    )}
                  </span>
                </div>
                <div>
                  <hr className="border-t border-gray-600 w-full mt-2" />
                </div>
              </div>
            </>
          )}
        </div>
        {/* connect/disconnect button */}
        <div className="flex flex-row justify-end px-2 py-6 mx-5">
          {!isConnected ? (
            <w3m-button />
          ) : (
            <Button
              variant="contained"
              onClick={disconnect}
              sx={{
                borderRadius: "22px",
                textTransform: "capitalize",
                background: "#5773FF",
              }}
            >
              Disconnect Wallet
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
