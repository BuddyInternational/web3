import { Button, Skeleton, Tooltip } from "@mui/material";
import {
  createWeb3Modal,
  defaultConfig,
  useDisconnect,
  useWeb3ModalAccount,
} from "@web3modal/ethers/react";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaRegCopy, FaEthereum } from "react-icons/fa";
import {
  checkExistingVanityAddress,
  generateAndSaveVanityAddress,
} from "../../api/vanityAPI";
import { useVanityContext } from "../../context/VanityContext";
import { SiPolygon } from "react-icons/si";

// 1. Get projectId
const projectId: any = process.env.REACT_APP_WALLET_PROJECT_ID;

// 2. Set chains
const chains = [
  {
    chainId: 1,
    name: "Ethereum",
    currency: "ETH",
    explorerUrl: "https://etherscan.io",
    rpcUrl: "https://cloudflare-eth.com",
  },
  {
    chainId: 137,
    name: "Polygon",
    currency: "Matic",
    explorerUrl: "https://polygonscan.com/",
    rpcUrl: "https://polygon-rpc.com/",
  },
  {
    chainId: 42161,
    name: "Arbitrum One",
    currency: "ETH",
    explorerUrl: "https://arbiscan.io/",
    rpcUrl: "https://arb1.arbitrum.io/rpc",
  },
  {
    chainId: 11155111,
    name: "Sepolia Testnet",
    currency: "SepoliaETH",
    explorerUrl: "https://sepolia.etherscan.io",
    rpcUrl: "https://sepolia.infura.io/v3/",
  },
  {
    chainId: 80002,
    name: "POLYGON AMOY TESTNET",
    currency: "MATIC",
    explorerUrl: "https://www.oklink.com/amoy",
    rpcUrl: "https://rpc-amoy.polygon.technology/",
  },
  {
    chainId: 31337,
    name: "Localhost",
    currency: "HETH",
    explorerUrl: "",
    rpcUrl: "http://localhost:8545",
  },
];

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
  chains,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
});

// vanity address suffix
const vanity_suffix: string | undefined = process.env.REACT_APP_VANITY_SUFFIX;

export default function App() {
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useWeb3ModalAccount();
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const copyAddressTimeoutRef: any = useRef(null);
  const { vanityAddress, setVanityAddress } = useVanityContext();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleWalletConnect = async () => {
      if (isConnected && address) {
        setIsLoading(true);
        // Check if the wallet already has a vanity address
        const existingAddress = await checkExistingVanityAddress(address);
        if (existingAddress != null) {
          setVanityAddress(existingAddress.vanityAddress);
        } else {
          // If no vanity address exists, generate and save a new one
          const generatedAddress: any = await generateAndSaveVanityAddress(
            vanity_suffix!,
            address
          );
          if (!!generatedAddress?.data[0]?.address) {
            setVanityAddress(generatedAddress?.data[0]?.address);
          }
        }
        setIsLoading(false);
      }
    };

    handleWalletConnect();
  }, [isConnected, address, vanityAddress, setVanityAddress]);

  return (
    <>
      <div className="flex sm:items-center md:justify-between md:flex-row sm:flex-col-reverse">
        {/* connected vanity address */}
        <div className="sm:py-1 md:py-2 md:pl-14 sm:pl-0 flex md:flex-row sm:flex-col md:gap-3 sm:gap-1 justify-center">
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              width="100%"
              height={50}
              // animation="wave"
              // sx={{ bgcolor: "red" }}
            />
          ) : (
            <>
              <div className="text-[#5692D9] font-normal font-sans text-base">
                Vanity Address :
              </div>
              <div className="flex flex-col">
                <div className="text-white flex gap-3 font-normal font-sans text-sm">
                  <span className="mt-1">
                    {vanityAddress?.slice(0, 6)}... {vanityAddress?.slice(-4)}
                  </span>
                  <span className="">
                    {isAddressCopied ? (
                      <FaCheck className="mt-1 text-green-500 cursor-pointer" />
                    ) : (
                      <FaRegCopy
                        onClick={() => {
                          navigator.clipboard.writeText(vanityAddress || "");
                          setIsAddressCopied(true);
                          clearTimeout(copyAddressTimeoutRef.current);
                          copyAddressTimeoutRef.current = setTimeout(() => {
                            setIsAddressCopied(false);
                          }, 1000);
                        }}
                        className="text-[#5692D9] font-thin mt-1 cursor-pointer"
                        data-tip="Copy Vanity Address"
                        data-tip-content=".tooltip"
                      />
                    )}
                  </span>
                  {/* Etherscan Link */}
                  <Tooltip title="View on Etherscan" arrow>
                    <a
                      href={`https://etherscan.io/address/${vanityAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5692D9] mt-1 cursor-pointer"
                      data-tip="View on Etherscan"
                    >
                      <FaEthereum />
                    </a>
                  </Tooltip>
                  {/* Polygonscan Link */}
                  <Tooltip title="View on Polygonscan" arrow>
                    <a
                      href={`https://polygonscan.com/address/${vanityAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5692D9] mt-1 cursor-pointer"
                      data-tip="View on Polygonscan"
                    >
                      <SiPolygon />
                    </a>
                  </Tooltip>
                  <Tooltip title="CDE" arrow>
                    <a
                      href={`/#`}
                      // target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5692D9] mt-1 cursor-pointer"
                      data-tip="CDE"
                      onClick={()=>{ alert("Prestige this Account");}}
                    >
                      <img src="/CDE.svg" className="h-4 w-auto" alt="CDE" />
                    </a>
                  </Tooltip>
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
            <div className="flex gap-3 sm:flex-col md:flex-row items-center ">
              <w3m-network-button />
              <Button
                variant="contained"
                onClick={() => {
                  setVanityAddress(
                    "0x0000000000000000000000000000000000000000"
                  );
                  disconnect();
                }}
                sx={{
                  borderRadius: "22px",
                  textTransform: "capitalize",
                  background: "#5773FF",
                }}
              >
                Disconnect Wallet
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
