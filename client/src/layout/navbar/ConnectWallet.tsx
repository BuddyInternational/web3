import {
  Button,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Tooltip,
} from "@mui/material";
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
import { SiPolygon, SiSimplelogin } from "react-icons/si";
import { toast } from "react-toastify";
import { useGullyBuddyNotifier } from "../../utils/GullyBuddyNotifier";
import { ethers } from "ethers";
import axios from "axios";
import { saveAs } from "file-saver";
import { useBalanceUpdate } from "../../context/BalanceUpdateContext";
import RegisterModal from "./RegistrationModal";
import { IoSend } from "react-icons/io5";
import SendVanityDataModal from "./SendVanityDataModal";
import LoginModal from "./LoginModal";
import { useAuthContext } from "../../context/AuthContext";
import { logOutUser } from "../../api/userVanityAPI";
import { useVanityAddressUpdate } from "../../context/VanityAddressesListContext";
import { FaMobileScreenButton } from "react-icons/fa6";
import { MdEmail, MdPower, MdPowerOff } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../../utils/Loader";
import { useLoader } from "../../context/LoaderContext";
import { VanityData } from "../../utils/Types";
import { IoIosLogIn, IoIosLogOut } from "react-icons/io";

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
    currency: "POL",
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

export default function App() {
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useWeb3ModalAccount();
  const { triggerVanityAddressUpdate } = useVanityAddressUpdate();
  const { resetBalances } = useBalanceUpdate();
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const copyAddressTimeoutRef: any = useRef(null);
  const { vanityAddress, setVanityAddress } = useVanityContext();
  const { isLoading, setIsLoading } = useLoader();
  const { notifyGullyBuddy } = useGullyBuddyNotifier();
  const { walletProvider } = useWeb3ModalProvider();
  const [showModal, setShowModal] = useState(false);
  const [openRegisterModal, setOpenRegisterModal] = useState(false);
  const [openSendVanityDataModal, setOpenSendVanityDataModal] = useState(false);
  const [openMobileModal, setOpenMobileModal] = useState(false);
  const [openEmailModal, setOpenEmailModal] = useState(false);
  const {
    authMethod,
    loginDetails,
    isLoggedIn,
    setAuthMethod,
    setLoginDetails,
    setIsLoggedIn,
  } = useAuthContext();
  const [vanityAddresses, setVanityAddresses] = useState([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  //fetch vanity Address list for wallet
  const fetchVanityAddresses = async () => {
    if (vanityAddress === "0x0000000000000000000000000000000000000000") {
      setVanityAddresses([]);
      return;
    }
    if (isConnected) {
      try {
        const response = await axios.get(
          `${server_api_base_url}/api/vanity/downloadVanityAddress`
        );
        // Extract the vanityAddresses from the response
        if (response.data && response.data.data) {
          const vanityDetails = response.data.data.find(
            (vanityData: any) => vanityData.walletAddress === address
          );
          // Map each detail to include both vanityAddress and accountType
          const vanityAddresses = vanityDetails.vanityDetails.map(
            (detail: any) => ({
              vanityAddress: detail.vanityAddress,
              vanityAccountType: detail.vanityAccountType,
            })
          );
          setVanityAddresses(vanityAddresses);
        } else {
          console.error("Invalid API response structure", response.data);
          setVanityAddresses([]);
        }
      } catch (err) {
        console.error("Error fetching vanity addresses:", err);
      }
    }
  };

  // fetch vanity Address list for mobile and email
  const fetchVanityAddressesForMobileAndEmail = async () => {
    if (vanityAddress === "0x0000000000000000000000000000000000000000") {
      setVanityAddresses([]);
      return;
    }
    try {
      const response = await axios.get(
        `${server_api_base_url}/api/user-vanity/downloadVanityAddressForUser`
      );

      // Extract the vanityAddresses from the response
      if (response.data && response.data.data) {
        // Find the user by mobile or email based on loginDetails
        const user = response.data.data.find((vanityData: any) => {
          return (
            vanityData.mobile === loginDetails.mobile ||
            vanityData.email === loginDetails.email
          );
        });
        if (user) {
          // Extract the vanityDetails for the user
          const vanityAddresses = user.vanityDetails.map((detail: any) => ({
            vanityAddress: detail.vanityAddress,
            vanityAccountType: detail.vanityAccountType,
          }));

          setVanityAddresses(vanityAddresses);
        } else {
          console.error("User not found in response");
          setVanityAddresses([]);
        }
      } else {
        console.error("Invalid API response structure", response.data);
        setVanityAddresses([]);
      }
    } catch (err) {
      console.error("Error fetching vanity addresses:", err);
    }
  };

  // fetch the vanity Address list for wallet and mobile and email
  useEffect(() => {
    if (isConnected) {
      fetchVanityAddresses();
    } else {
      fetchVanityAddressesForMobileAndEmail();
    }
  }, [
    vanityAddress,
    setVanityAddress,
    address,
    isConnected,
    isLoggedIn,
    triggerVanityAddressUpdate,
  ]);

  // Function to fetch data from the backend
  const downloadVanityData = async () => {
    setShowModal(false);

    if (vanityAddress === "0x0000000000000000000000000000000000000000") {
      toast.error("Please connect your wallet to Download Vanity Data.");
      return;
    }
    try {
      const response = await axios.get(
        `${server_api_base_url}/api/vanity/downloadVanityAddress`
      );

      const responseCountLog = await axios.post(
        `${server_api_base_url}/proxyVanityDataDownload`,
        { vanityAddress },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Check if response.data exists and is an array
      if (response.data.data && Array.isArray(response.data.data)) {
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
            vanityDetails: {
              vanityAddress: string;
              vanityPrivateKey: string;
            }[];
            createdAt: string;
          }) => {
            const { walletAddress, vanityDetails, createdAt } = item;
            const vanityAddresses = vanityDetails.map(
              (detail) => detail.vanityAddress
            );
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

  // handle wallet connect
  useEffect(() => {
    const handleWalletConnect = async () => {
      if (isConnected && address) {
        setIsLoading(true);
        setAuthMethod("wallet");

        try {
          const ethersProvider = new ethers.BrowserProvider(walletProvider!);

          // Check the current network
          const network = await ethersProvider.getNetwork();

          // Uncomment this to enforce Ethereum Mainnet
          // if (network.chainId !== BigInt(1)) {
          //   toast.warning("Please switch to Ethereum Mainnet.");
          //   disconnect();
          //   setIsLoading(false);
          //   return;
          // }

          // Check for existing vanity address
          const existingAddress = await checkExistingVanityAddress(address);
          console.log("existingAddress:", existingAddress);

          if (
            existingAddress?.message ===
            "No vanity address found for this wallet"
          ) {
            // toast.info("No vanity address found. Generating a new one...");

            // Generate new vanity address
            const generateResponse = await generateVanityWallet(
              vanity_suffix!,
              1
            );
            if (generateResponse?.data?.[0]?.address) {
              const generatedAddress = generateResponse.data[0];
              const sender = address!;
              const message = `A new Vanity Address has been generated by the user with Wallet Address: **${address}**. The generated Vanity Address is: **${generatedAddress.address}**. © Gully Buddy International. All rights reserved.`;
              const feesAmount = 2.5;
              // const feesAmount = 0.5;
              const vanityAccountType = "Main";

              // Notify about new vanity address
              const notificationResult = await notifyGullyBuddy(
                sender,
                message,
                feesAmount
              );
              console.log("Notification Result:", notificationResult);

              if (notificationResult && notificationResult.notificationTxHash) {
                await storeVanityWallet(
                  address,
                  generatedAddress.address,
                  generatedAddress.privKey,
                  vanityAccountType
                );
                setVanityAddress(generatedAddress.address);
                toast.success(
                  "Vanity address successfully generated and stored!"
                );
              } else {
                throw new Error(
                  "Error sending notification for new vanity address."
                );
              }
            } else {
              throw new Error("Error generating a new vanity address.");
            }
          } else if (existingAddress?.vanityDetails?.[0]?.vanityAddress) {
            // Set existing vanity address
            setVanityAddress(existingAddress.vanityDetails[0].vanityAddress);
            // toast.success("Vanity address found!");
          } else if (existingAddress?.AxiosError) {
            // Handle Axios-specific errors
            toast.error(existingAddress.AxiosError.message);
            disconnect();
          }
        } catch (error: any) {
          console.error("Error during wallet connection:", error);
          toast.error(error.message || "An unexpected error occurred.");
          disconnect();
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleWalletConnect();
  }, [isConnected, address]);

  const handleCancel = () => {
    // Close the modal if user cancels
    setShowModal(false);
  };

  // download vanityData confirm modal
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

  // Handle Modal
  const handleOpenModal = (setModalState: any) => () => {
    setModalState(true);
    handleCloseMenu();
  };
  const handleCloseModal = (setModalState: any) => () => setModalState(false);

  // Handle mobile and email logout
  const handleLogout = async () => {
    try {
      // Call the logout API with the appropriate parameter
      const response = await logOutUser(
        loginDetails.mobile || undefined,
        loginDetails.email || undefined
      );

      if (response) {
        toast.success("User logged out successfully");
        setAuthMethod("wallet");
        setLoginDetails({});
        setIsLoggedIn(false);
        setVanityAddress("0x0000000000000000000000000000000000000000");
        resetBalances();
      }
    } catch (error) {
      console.error("Error during logout", error);
      toast.error(`Error during logout. Please try again. ${error}`);
    }
  };

  return (
    <>
      {isLoading && <Loader />}

      <div className="flex sm:items-center md:justify-between md:flex-row sm:flex-col-reverse">
        {/* connected vanity address */}
        {showModal && (
          <Modal
            message="Do you want to download the vanity address CSV file?"
            onConfirm={downloadVanityData}
            onCancel={handleCancel}
          />
        )}
        {/* vanity Address Section */}
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
              <div className="text-[#5692D9] font-normal font-sans text-base m-auto">
                Vanity Address :
              </div>
              <div className="flex flex-col">
                <div className="text-white flex gap-3 font-normal font-sans text-sm items-center">
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
                  {isConnected && (
                    <Button
                      color="primary"
                      variant="contained"
                      className="bg-[#5692D9] text-white font-semibold px-4 py-2 rounded-lg hover:bg-[#4578B5] transition-all mt-1"
                      onClick={handleOpenModal(setOpenRegisterModal)}
                    >
                      Assign Vanity
                    </Button>
                  )}
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
          {!isLoggedIn && !isConnected ? (
            <>
              <div className="flex gap-2 flex-col lg:flex-col xl:flex-row items-center">
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#5773FF",
                    color: "#ffffff",
                    fontWeight: "bold",
                    borderRadius: "22px",
                    "&:hover": {
                      backgroundColor: "#5773FF",
                    },
                    textTransform: "none",
                  }}
                  onClick={handleOpenMenu}
                >
                  Login Options
                  <IoIosLogIn className="ml-2 mt-0.5 color-white text-lg" />
                </Button>

                {/* Dropdown Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleCloseMenu}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <MenuItem onClick={handleOpenModal(setOpenMobileModal)}>
                    <ListItemIcon>
                      <FaMobileScreenButton fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Login with Mobile" />
                  </MenuItem>
                  <MenuItem onClick={handleOpenModal(setOpenEmailModal)}>
                    <ListItemIcon>
                      <MdEmail fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Login with Email" />
                  </MenuItem>
                </Menu>

                {/* Connect Wallet Button */}
                {/* <w3m-connect-button /> */}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#5773FF",
                    color: "#ffffff",
                    fontWeight: "bold",
                    borderRadius: "20px",
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                    padding: 0,
                  }}
                >
                  <w3m-connect-button />
                  <MdPower className="mr-2 text-white text-lg" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex gap-3 sm:flex-col md:flex-row items-center ">
              {/* Icons Section */}
              <div className="flex flex-row justify-center items-center gap-3 mb-2">
                {/* CSV Download */}
                <Link to={"/downloadCSV"}>
                  <Tooltip title="CSV Download" arrow>
                    <IconButton aria-label="more" aria-haspopup="true">
                      <FaDownload
                        className="text-[#FFD700] text-2xl mt-0.5 cursor-pointer"
                        data-tip="CSV Download"
                      />
                    </IconButton>
                  </Tooltip>
                </Link>
                {/* CDE Icon */}
                <Tooltip title="CDE" arrow>
                  <a
                    href={`/#`}
                    // target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5692D9] cursor-pointer"
                    data-tip="CDE"
                  >
                    <img src="/CDE.svg" className="h-6 w-auto" alt="CDE" />
                  </a>
                </Tooltip>
                {/* Send Vanity Icon */}
                <Tooltip title="Send Vanity Data" arrow>
                  <IconButton
                    aria-label="more"
                    aria-haspopup="true"
                    onClick={handleOpenModal(setOpenSendVanityDataModal)}
                  >
                    <IoSend
                      className="text-[#5692D9] text-2xl mt-1 cursor-pointer"
                      data-tip="Send Vanity Data"
                    />
                  </IconButton>
                </Tooltip>
              </div>
              {/* Conditional Rendering Based on Auth Method */}
              {authMethod === "wallet" ? (
                <>
                  {/* Network Button */}
                  <w3m-network-button />

                  {/* Disconnect Wallet Button */}
                  <Button
                    variant="contained"
                    onClick={() => {
                      setVanityAddress(
                        "0x0000000000000000000000000000000000000000"
                      );
                      resetBalances();
                      setAuthMethod("");
                      disconnect();
                      navigate("/");
                    }}
                    sx={{
                      borderRadius: "22px",
                      textTransform: "capitalize",
                      background: "#5773FF",
                    }}
                  >
                    Disconnect Wallet
                    <MdPowerOff className="ml-2 text-white text-lg" />
                  </Button>
                </>
              ) : (
                <>
                  {/* Logout Button for Mobile/Email */}
                  <Button
                    variant="contained"
                    onClick={handleLogout}
                    sx={{
                      backgroundColor: "#5773FF",
                      color: "#fff",
                      fontWeight: "bold",
                      px: 2,
                      borderRadius: "22px",
                      "&:hover": {
                        backgroundColor: "#5773FF",
                      },
                      textTransform: "none",
                    }}
                  >
                    Log Out
                    <IoIosLogOut className="ml-2 mt-0.5 text-white text-lg"/>
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Open Registration Modal Assign Vanity Address */}
      {openRegisterModal && (
        <>
          <RegisterModal
            open={openRegisterModal}
            onClose={handleCloseModal(setOpenRegisterModal)}
          />
        </>
      )}

      {/* Open Send Vanity Data Modal */}
      {openSendVanityDataModal && (
        <>
          <SendVanityDataModal
            open={openSendVanityDataModal}
            onClose={handleCloseModal(setOpenSendVanityDataModal)}
            vanityAddresses={vanityAddresses}
          />
        </>
      )}

      {/* Mobile Login Modal */}
      {openMobileModal && (
        <>
          <LoginModal
            open={openMobileModal}
            onClose={handleCloseModal(setOpenMobileModal)}
            logInType="Mobile"
            // setAuthMethod={setAuthMethod}
            // setIsLoggedIn={setIsLoggedIn}
          />
        </>
      )}

      {/* Email Login Modal */}
      {openEmailModal && (
        <>
          <LoginModal
            open={openEmailModal}
            onClose={handleCloseModal(setOpenEmailModal)}
            logInType="Email"
            // setAuthMethod={setAuthMethod}
            // setIsLoggedIn={setIsLoggedIn}
          />
        </>
      )}
    </>
  );
}
