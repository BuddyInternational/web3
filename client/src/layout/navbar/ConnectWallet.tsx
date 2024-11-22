import { Button, Skeleton, Tooltip } from "@mui/material";
import {
  createWeb3Modal,
  defaultConfig,
  useDisconnect,
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useEffect, useRef, useState } from "react";
import { FaCheck, FaRegCopy, FaEthereum, FaDownload } from "react-icons/fa";
import {
  checkExistingVanityAddress,
  generateVanityWallet,
  storeVanityWallet,
} from "../../api/vanityAPI";
import { useVanityContext } from "../../context/VanityContext";
import { SiPolygon } from "react-icons/si";
import { toast } from "react-toastify";
import { useGullyBuddyNotifier } from "../../utils/GullyBuddyNotifier";
import { ethers } from "ethers";
import axios from "axios";
import { saveAs } from "file-saver";
import { useBalanceUpdate } from "../../context/BalanceUpdateContext";

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
    chainId: 8453,
    name: "Base Mainnet",
    currency: "ETH",
    explorerUrl: "https://base.blockscout.com/",
    rpcUrl: "https://mainnet.base.org",
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
  {
    chainId: 84532,
    name: "Base Sepolia",
    currency: "ETH",
    explorerUrl: "https://sepolia-explorer.base.org",
    rpcUrl: "https://sepolia.base.org",
  },
];

// 3. Create a metadata object
// For set Localnet
// const metadata = {
//   name: "Demo",
//   description: "Demo",
//   url: "http://localhost:3000/", // origin must match your domain & subdomain
//   icons: [""],
// };

// For set production
const metadata = {
  name: "gully",
  description: "gully",
  url: "https://gully.buddies.international/", // origin must match your domain & subdomain
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
  // Server API Base URL
  const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// 6. Interface to get vanity details
interface VanityData {
  walletAddress: string;
  vanityAddress: string;
  vanityPrivateKey: string;
  createdAt: string;
}

export default function App() {
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useWeb3ModalAccount();
  const { resetBalances } = useBalanceUpdate();
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const copyAddressTimeoutRef: any = useRef(null);
  const { vanityAddress, setVanityAddress } = useVanityContext();
  const [isLoading, setIsLoading] = useState(false);
  const { notifyGullyBuddy } = useGullyBuddyNotifier();
  const { walletProvider } = useWeb3ModalProvider();
  const [showModal, setShowModal] = useState(false);

  // Function to fetch data from the backend
  const downloadVanityData = async () => {
    setShowModal(false);
    // console.log(vanityAddress);

    if (vanityAddress === "0x0000000000000000000000000000000000000000") {
      toast.error("Please connect your wallet to Download Vanity Data.");
      return;
    }
    try {
      console.log("vanity address---------", vanityAddress);
      const response = await axios.get(
        `${server_api_base_url}/api/vanity/downloadVanityAddress`
      );

      console.log("response--------------",response);

      const responseCountLog = await axios.post(
        `${server_api_base_url}/proxyVanityDataDownload`,
        { vanityAddress },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("responseCountLog==========", responseCountLog);

      // const responseCount = await axios.get(
      //   `${server_api_base_url}/api/vanity/vanityCallcount`
      // );

      // console.log("responseCount",responseCount.data);

      // Check if response.data exists and is an array
      if (response.data.data && Array.isArray(response.data.data)) {
        console.log("Setting data", response.data.data);

        // // Filter data to exclude fields like _id and vanityPrivateKey
        // const filteredData = response.data.data.map(
        //   (item: {
        //     walletAddress: string;
        //     vanityAddress: string;
        //     createdAt: string;
        //   }) => {
        //     const { walletAddress, vanityAddress, createdAt } = item;
        //     return { walletAddress, vanityAddress, createdAt };
        //   }
        // );

        // Filter data to exclude fields like _id and vanityPrivateKey
        const filteredData = response.data.data.map(
          (item: {
            walletAddress: string;
            vanityDetails: { vanityAddress: string; vanityPrivateKey: string; }[];
            createdAt: string;
          }) => {
            const { walletAddress, vanityDetails, createdAt } = item;
            const vanityAddresses = vanityDetails.map(detail => detail.vanityAddress);
            return { walletAddress, vanityAddresses, createdAt };
          }
        );

        // Convert to CSV format
        const csv = convertToCSV(filteredData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "data.csv");

        // alert("The CSV file has been downloaded successfully.");  // Success message
        toast.success("The CSV file has been downloaded successfully.");
      } else {
        console.log("No data found");
        return;
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Function to convert data to CSV format
  const convertToCSV = (array: VanityData[]) => {
    const headers = Object.keys(array[0]).join(",") + "\n";
    const rows = array.map((obj) => Object.values(obj).join(",")).join("\n");
    return headers + rows;
  };

  useEffect(() => {
    const handleWalletConnect = async () => {
      if (isConnected && address) {
        setIsLoading(true);
        // Create ethers provider using the current wallet provider
        const ethersProvider = new ethers.BrowserProvider(walletProvider!);
        // console.log("---ethersProvider",);

        // Check the current network
        const network = await ethersProvider.getNetwork();
        const isMainnet = network.chainId === BigInt(1); // Ethereum Mainnet

        // if (!isMainnet) {
        //   // User is not on Mainnet, show a warning
        //   toast.warning(
        //     "Please switch to the Ethereum Mainnet to generate a vanity address."
        //   );
        //   disconnect(); // Disconnect from the wallet
        //   setIsLoading(false);
        //   return;
        // }

        // Check if the wallet already has a vanity address
        const existingAddress = await checkExistingVanityAddress(address);
        console.log("existingAddress", existingAddress);

        if (existingAddress != null) {
          // setVanityAddress(existingAddress.vanityAddress);
          setVanityAddress(existingAddress.vanityDetails[0].vanityAddress);
        } else {
          // Generate a new vanity address
          const generateResponse = await generateVanityWallet(
            vanity_suffix!,
            1
          );
          if (generateResponse?.data?.[0]?.address) {
            const generatedAddress = generateResponse.data[0];
            // // Store the generated address using the helper function
            // const sender = address!;
            // const message = `User with Wallet Address **${address}** has generated a new Vanity Address: **${
            //   generatedAddress.address || "N/A"
            // }**.`;
            // const feesAmount = 2.5;
            const vanityAccountType = "Main";
            // const notificationResult = await notifyGullyBuddy(sender, message,feesAmount);
            // console.log("notificationResult", notificationResult);
            // if (notificationResult && notificationResult.hash) {
              await storeVanityWallet(
                address,
                generatedAddress.address,
                generatedAddress.privKey,
                vanityAccountType
              );
              setVanityAddress(generatedAddress.address);
              toast.success("Notification sent to Buddyinternational.eth");
            // } 
            // else {
            //   setIsLoading(false);
            //   toast.error("Error sending notification and Generate vanity Address!");
            //   return;
            // }
          }
          else {
            setIsLoading(false);
            toast.error("Error sending notification and Generate vanity Address!");
            return;
          }
        }
        setIsLoading(false);
      }
    };

    handleWalletConnect();
  }, [isConnected, address]);

  const handleCancel = () => {
    // Close the modal if user cancels
    setShowModal(false);
  };

  const Modal = ({ message, onConfirm, onCancel }: any) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg w-96 md:w-1/3 text-center shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">Confirm</h2>
          <p className="mb-6 text-gray-600 text-lg">{message}</p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-700 text-white rounded-lg hover:from-gray-600 hover:to-gray-800 focus:outline-none transition duration-200 ease-in-out transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 focus:outline-none transition duration-200 ease-in-out transform hover:scale-105"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex sm:items-center md:justify-between md:flex-row sm:flex-col-reverse">
        {/* connected vanity address */}
        {showModal && (
          <Modal
            message="Do you want to download the vanity address CSV file?"
            onConfirm={downloadVanityData}
            onCancel={handleCancel}
          />
        )}
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
                  {/* Download link */}
                  <Tooltip title="Download Vanity address csv" arrow>
                    <a
                      // href={`/#`}
                      onClick={() => setShowModal(true)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#5692D9] mt-1 cursor-pointer"
                      data-tip="View on Etherscan"
                    >
                      <FaDownload />
                    </a>
                  </Tooltip>
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
                      onClick={() => {
                        alert("Prestige this Account");
                      }}
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
                  resetBalances();
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
        {/* <div className="sm:py-1 md:py-2 md:pl-14 sm:pl-0 flex md:flex-row sm:flex-col md:gap-3 sm:gap-1 justify-center">
          <Button
            variant="contained"
            onClick={downloadVanityData}
            sx={{
              borderRadius: "22px",
              textTransform: "capitalize",
              background: "#5773FF",
              mx: "10px",
            }}
          >
            Download Vanity Data
          </Button>
        </div> */}
      </div>
    </>
  );
}
