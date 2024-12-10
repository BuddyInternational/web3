import React, { useCallback, useEffect, useState } from "react";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import Moralis from "moralis";
import { Link } from "react-router-dom";
import { ethers, Contract } from "ethers";
import { NFTDetails, ShopNFTDetails } from "../utils/Types";
import { ERC20ABI } from "../utils/ABI";
import NftCard from "../components/homeComponents/card/NftCard";
import ShopeNftcard from "../components/homeComponents/card/ShopeNftcard";
import TermsModel from "../components/homeComponents/modals/TermsModal";
import CDEReward from "../components/homeComponents/modals/CDEReward";
import { useVanityContext } from "../context/VanityContext";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import MeetingRoom from "../components/homeComponents/modals/MeetingRoom";
import Leadership from "../components/homeComponents/modals/Leadership";
import { Menu, MenuItem, Tooltip, IconButton } from "@mui/material";
import Withdraw from "../components/homeComponents/modals/Withdraw";
import { SiPolygon } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import SocketNFT from "../components/homeComponents/modals/SocketNFT";
import { HiMiniTv } from "react-icons/hi2";
import { GiBiceps } from "react-icons/gi";
import { getSocketNFTLastTransferDetails } from "../api/socketnftAPI";
import { toast } from "react-toastify";
import { getNFTDetails, saveNFTDetails } from "../api/nftAPI";
import { IoMdArrowDropdown } from "react-icons/io";
import Countdown from "react-countdown";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useBalanceUpdate } from "../context/BalanceUpdateContext";
import axios from "axios";
import { useVanityAddressUpdate } from "../context/VanityAddressesListContext";
import { useAuthContext } from "../context/AuthContext";

interface NFT {
  asset_contract: {
    chain: string;
    schema_name: string;
  };
  contract: string;
  identifier: string;
  name: string;
  permalink: string;
  display_image_url: string;
  display_animation_url: string | null;
  updated_at: string;
  floor_price: number;
  floor_price_usd: number;
  payment_token: {
    symbol: string;
  };
  last_claimed_date: string | null;
  claim_count: number;
  claim_hashes: string[];
}

interface CountdownRendererProps {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  completed: boolean;
}

const tokenAddressesByChain: any = {
  mainnet: {
    CDE1: process.env.REACT_APP_ETHEREUM_CDE1_TOKEN_ADDRESS,
    CDE2: process.env.REACT_APP_ETHEREUM_CDE2_TOKEN_ADDRESS,
    TIM: process.env.REACT_APP_ETHEREUM_TIM_TOKEN_ADDRESS,
    AN: process.env.REACT_APP_ETHEREUM_AN_TOKEN_ADDRESS,
  },
  matic: {
    CDE1: process.env.REACT_APP_POLYGON_CDE1_TOKEN_ADDRESS,
    CDE2: process.env.REACT_APP_POLYGON_CDE2_TOKEN_ADDRESS,
    TIM: process.env.REACT_APP_POLYGON_TIM_TOKEN_ADDRESS,
    AN: process.env.REACT_APP_POLYGON_AN_TOKEN_ADDRESS,
  },
};

const tokenDetailsByChain: any = {
  mainnet: {
    [process.env.REACT_APP_ETHEREUM_CDE1_TOKEN_ADDRESS!]: {
      name: "CDE®v1",
      symbol: "CDE",
      decimals: 18,
    },
    [process.env.REACT_APP_ETHEREUM_CDE2_TOKEN_ADDRESS!]: {
      name: "CDE®v2",
      symbol: "CDE",
      decimals: 18,
    },
    [process.env.REACT_APP_ETHEREUM_TIM_TOKEN_ADDRESS!]: {
      name: (
        <span style={{ display: "flex", alignItems: "center" }}>
          TIM
          <img
            src="/TIM.svg"
            alt="TIM Logo"
            style={{
              height: "0.8em",
              marginLeft: "1px",
              verticalAlign: "middle",
            }}
          />
        </span>
      ),
      symbol: "TIM",
      decimals: 18,
    },
    [process.env.REACT_APP_ETHEREUM_AN_TOKEN_ADDRESS!]: {
      name: (
        <span style={{ display: "flex", alignItems: "center" }}>
          AN
          <img
            src="/Annotation.svg"
            alt="AN Logo"
            style={{
              height: "1em",
              marginLeft: "10px",
              marginRight: "5px",
              verticalAlign: "middle",
            }}
          />
        </span>
      ),
      symbol: "AN",
      decimals: 4,
    },
  },
  matic: {
    [process.env.REACT_APP_POLYGON_CDE1_TOKEN_ADDRESS!]: {
      name: "CDE®v1",
      symbol: "CDE",
      decimals: 18,
    },
    [process.env.REACT_APP_POLYGON_CDE2_TOKEN_ADDRESS!]: {
      name: "CDE®v2",
      symbol: "CDE",
      decimals: 18,
    },
    [process.env.REACT_APP_POLYGON_TIM_TOKEN_ADDRESS!]: {
      name: (
        <span style={{ display: "flex", alignItems: "center" }}>
          TIM
          <img
            src="/TIM.svg"
            alt="TIM Logo"
            style={{
              height: "0.8em",
              marginLeft: "1px",
              verticalAlign: "middle",
            }}
          />
        </span>
      ),
      symbol: "TIM",
      decimals: 18,
    },
    [process.env.REACT_APP_POLYGON_AN_TOKEN_ADDRESS!]: {
      name: (
        <span style={{ display: "flex", alignItems: "center" }}>
          AN
          <img
            src="/Annotation.svg"
            alt="AN Logo"
            style={{
              height: "1em",
              marginLeft: "10px",
              marginRight: "5px",
              verticalAlign: "middle",
            }}
          />
        </span>
      ),
      symbol: "AN",
      decimals: 4,
    },
  },
};

// const TestANTAddress: any =
//   process.env.REACT_APP_TESTANT_TOKEN_CONTRACT_ADDRESS;

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;
// API KEY
const api_key: any = process.env.REACT_APP_MORALIS_NFT_API;
// const rpc_url: any = process.env.REACT_APP_RPC_URL_MAINNET;
// const sepolia_rpc_url: any = process.env.REACT_APP_RPC_URL_SEPOLIA;
const ApiKey = process.env.REACT_APP_OPENSEA_API_KEY;
const gullyBuddyNFTAddress =
  process.env.REACT_APP_PASSPORT_NFT_COLLECTION_ADDRESS!;

const gullyBuddyNFTCollectionAddress = [
  process.env.REACT_APP_PASSPORT_NFT_COLLECTION_ADDRESS!,
  process.env.REACT_APP_TEAM1_NFT_COLLECTION_ADDRESS!,
  process.env.REACT_APP_TEAM2_NFT_COLLECTION_ADDRESS!,
  process.env.REACT_APP_MANAGER_NFT_COLLECTION_ADDRESS!,
];

const Home = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const { triggerUpdate, resetBalances } = useBalanceUpdate();
  const { triggerVanityAddressUpdate } = useVanityAddressUpdate();
  const [balances, setBalances] = useState<any>({
    wallet: [],
    vanity: [],
  });

  const [selectedChain, setSelectedChain] = useState("mainnet");
  const [NFTdata, setNFTdata] = useState<NFTDetails[]>([]);
  const [otherNFTs, setOtherNFTs] = useState<NFTDetails[]>([]);
  const [gullyBuddyNFTs, setGullyBuddyNFTs] = useState<NFTDetails[]>([]);
  const [gullyBuddyCollectionNFTs, setGullyBuddyCollectionNFTs] = useState<
    ShopNFTDetails[]
  >([]);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [openCDERewardModal, setOpenCDERewardModal] = useState(false);
  const [openLeadershipModal, setOpenLeadershipModal] = useState(false);
  const [openWithdrawModal, setOpenWithdrawModal] = useState(false);
  const [openSocketNFTModal, setOpenSocketNFTModal] = useState(false);
  const [openMeetingRoomModal, setOpenMeetingRoomModal] = useState(false);
  const [socketNFTImageURL, setsocketNFTImageURL] = useState<string | null>(
    null
  );
  const [socketNFTImageMediaType, setsocketNFTImageMediaType] = useState<
    string | null
  >(null);
  const [nftSocketed, setNftSocketed] = useState(false);
  const { vanityAddress, setVanityAddress } = useVanityContext();
  const [value, setValue] = React.useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const targetDate = new Date("2024-12-31T23:59:59");
  const [vanityAddresses, setVanityAddresses] = useState([]);
  const [isHoldGullyBuddyNFT, setIsHoldGullyBuddyNFT] = useState(false);
  const { isLoggedIn, loginDetails } = useAuthContext();

  // open dropdown menu
  const handleDropdownToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setIsDropdownOpen((prev) => !prev);
  };

  // handle vanity address dropDown closed
  const handleClose = () => {
    setIsDropdownOpen(false);
    setAnchorEl(null);
  };

  // handle select vanity address drop down into menu
  const handleAddressSelect = (address: string) => {
    setVanityAddress(address);
    setIsDropdownOpen(false); // Close the dropdown after selection
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

  // Handle Modal
  const handleOpenModal = (setModalState: any) => () => setModalState(true);
  const handleCloseModal = (setModalState: any) => () => setModalState(false);

  // Function to calculate the total USD value of all NFTs
  const calculateTotalNFTValue = () => {
    if (!NFTdata.length) return 0;

    let totalFloorPriceUsd = 0;
    for (const nft of NFTdata) {
      if (nft.floorPriceUsd !== null) {
        totalFloorPriceUsd += Number(nft.floorPriceUsd);
      }
    }
    return Number(totalFloorPriceUsd).toFixed(4);
  };

  // Fetch connected user wallet token balance
  const fetchTokenBalance = useCallback(async () => {
    try {
      if (
        !isConnected ||
        !address ||
        !vanityAddress ||
        vanityAddress === "0x0000000000000000000000000000000000000000"
      ) {
        resetBalances();
        setBalances({
          wallet: [],
          vanity: [],
        });
        // setTestANTBalance(0);
        return;
      }

      const rpcUrls = {
        mainnet: process.env.REACT_APP_RPC_URL_MAINNET,
        matic: process.env.REACT_APP_RPC_URL_MATIC,
      };
      const ethersProvider = new ethers.BrowserProvider(walletProvider!);
      const network = await ethersProvider.getNetwork();
      const selectedChain: string | undefined = network.name;

      let provider: any;
      // const provider = new ethers.JsonRpcProvider(rpcUrls[selectedChain]);
      if (rpcUrls[selectedChain as keyof typeof rpcUrls]) {
        provider = new ethers.JsonRpcProvider(
          rpcUrls[selectedChain as keyof typeof rpcUrls]
        );
      } else {
        console.error(`No RPC URL configured for network: ${network.name}`);
      }
      const tokenAddresses = tokenAddressesByChain[selectedChain];
      const tokenContracts = Object.keys(tokenAddresses).map(
        (token: any) => new Contract(tokenAddresses[token], ERC20ABI, provider)
      );

      // Fetch wallet balances
      const walletBalances = await Promise.all(
        tokenContracts.map((contract) => contract.balanceOf(address))
      );

      const formatBalance = (balance: any, decimals: number) => {
        return Number(balance) / Math.pow(10, decimals);
      };

      const formattedWalletBalances = walletBalances.map((balance, idx) => {
        const tokenAddress = Object.keys(tokenAddresses)[idx];
        const tokenDetails =
          tokenDetailsByChain[selectedChain][tokenAddresses[tokenAddress]];
        const decimals = tokenDetails.decimals || 18;

        return {
          name: tokenDetails.name,
          symbol: tokenDetails.symbol,
          balance: formatBalance(balance, decimals).toFixed(4),
          address: tokenAddress,
        };
      });

      // console.log(
      //   "formattedWalletBalances=====================",
      //   formattedWalletBalances
      // );

      // Fetch vanity balances
      const vanityBalances = await Promise.all(
        tokenContracts.map((contract) => contract.balanceOf(vanityAddress))
      );

      const formattedVanityBalances = vanityBalances.map((balance, idx) => {
        const tokenAddress = Object.keys(tokenAddresses)[idx];
        const tokenDetails =
          tokenDetailsByChain[selectedChain][tokenAddresses[tokenAddress]];
        const decimals = tokenDetails.decimals || 18;

        return {
          name: tokenDetails.name,
          symbol: tokenDetails.symbol,
          balance: formatBalance(balance, decimals).toFixed(4),
          address: tokenAddress,
        };
      });

      // console.log(
      //   "formattedVanityBalances======================",
      //   formattedVanityBalances
      // );

      setBalances({
        wallet: formattedWalletBalances,
        vanity: formattedVanityBalances,
      });
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  }, [isConnected, address, vanityAddress, resetBalances]);

  // Fetch floor price with retries
  const fetchNFTFloorPriceWithRetry = async (
    collectionSlug: string,
    tokenId: string,
    retries: number = 3,
    delay: number = 60000
  ) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": ApiKey!,
      },
    };

    const floorPriceApiUrl = `https://api.opensea.io/api/v2/listings/collection/${collectionSlug}/nfts/${tokenId}/best`;

    let attempts = 0;
    while (attempts < retries) {
      try {
        const floorPriceResponse = await fetch(floorPriceApiUrl, options);
        if (!floorPriceResponse.ok) {
          throw new Error(`API Error: ${floorPriceResponse.status}`);
        }
        const floorPriceData = await floorPriceResponse.json();

        const floorPrice = floorPriceData?.price?.current?.value
          ? parseFloat(floorPriceData.price.current.value) /
            Math.pow(10, floorPriceData.price.current.decimals)
          : null; // Convert from Wei to ETH

        return floorPrice;
      } catch (error) {
        attempts++;
        if (attempts < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay * attempts));
        } else {
          console.error(
            `Failed to fetch floor price for ${collectionSlug}:`,
            error
          );
          return null;
        }
      }
    }
  };

  // Function to fetch Gullybuddy specific NFTs
  const fetchGullyBuddyNFTs = useCallback(async () => {
    if (!isConnected) {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": `${ApiKey}`,
        },
      };
      // Define collection URLs and their slugs
      const collections = [
        {
          url: "https://api.opensea.io/api/v2/collection/gully-buddy-international-passport-polygon/nfts",
          slug: "gully-buddy-international-passport-polygon",
        },
        {
          url: "https://api.opensea.io/api/v2/collection/gullybuddypolygon/nfts?limit=70",
          slug: "gullybuddypolygon",
        },
        {
          url: "https://api.opensea.io/api/v2/collection/gully-buddy-international-socketed-nfts-bonus-comm/nfts",
          slug: "gully-buddy-international-socketed-nfts-bonus-comm",
        },
      ];
      try {
        // Fetch collections in parallel
        const responses = await Promise.all(
          collections.map((collection) => fetch(collection.url, options))
        );

        // Parse JSON responses
        const collectionsData = await Promise.all(
          responses.map((response) => response.json())
        );
        // // Define a utility function to format NFTs
        // const formatNFTs = (nfts = []) =>
        //   nfts.map((nft: any) => ({
        //     chainName: nft.asset_contract?.chain || "Matic",
        //     contractAddress: nft.contract || "",
        //     tokenId: nft.identifier || "",
        //     name: nft.name || "Unnamed NFT",
        //     tokenType: nft.asset_contract?.schema_name || "ERC721",
        //     tokenUri: nft.permalink || "",
        //     imageUrl: nft.display_image_url || "",
        //     mediaType: nft.display_animation_url ? "video" : "image",
        //     timeLastUpdated: nft.updated_at || new Date().toISOString(),
        //     floorPrice: nft.floor_price || 0,
        //     floorPriceUsd: nft.floor_price_usd || 0,
        //     priceCurrency: nft.payment_token?.symbol || "ETH",
        //     lastclaimedAt: new Date(nft.last_claimed_date || Date.now()),
        //     totalClaimedRewardCount: nft.claim_count || 0,
        //     totalClaimedRewardHash: nft.claim_hashes || [],
        //     traits: nft.traits || [],
        //   }));

        // // Extract and format data for each collection
        // const [
        //   buddyPassportCollectionData,
        //   teamCollectionData,
        //   managerCollectionData,
        // ] = collectionsData;

        // setBuddyPassportNFTdata(formatNFTs(buddyPassportCollectionData.nfts));
        // setTeamNFTdata(formatNFTs(teamCollectionData.nfts));
        // setManagerNFTdata(formatNFTs(managerCollectionData.nfts));

        // Fetch floor prices and enrich NFT data
        const gullyBuddyCollections = await Promise.all(
          collections.map(async (collection, index) => {
            return await Promise.all(
              collectionsData[index].nfts.map(async (nft: any) => {
                // Fetch floor price for each NFT
                const floorPrice = await fetchNFTFloorPriceWithRetry(
                  collection.slug,
                  nft.identifier
                );

                // Return enriched NFT data
                return {
                  chainName: nft.asset_contract?.chain || "Matic",
                  contractAddress: nft.contract || "",
                  tokenId: nft.identifier || "",
                  name: nft.name || "Unnamed NFT",
                  tokenType: nft.asset_contract?.schema_name || "ERC721",
                  tokenUri: nft.permalink || "",
                  imageUrl: nft.display_image_url || "",
                  mediaType: nft.display_animation_url ? "video" : "image",
                  timeLastUpdated: nft.updated_at || new Date().toISOString(),
                  floorPrice: floorPrice || nft.floor_price || 0,
                  floorPriceUsd: nft.floor_price_usd || 0,
                  priceCurrency: nft.payment_token?.symbol || "ETH",
                  lastclaimedAt: new Date(nft.last_claimed_date || Date.now()),
                  totalClaimedRewardCount: nft.claim_count || 0,
                  totalClaimedRewardHash: nft.claim_hashes || [],
                  traits: nft.traits || [],
                };
              })
            );
          })
        );

        const flattenedGullyBuddyCollections = gullyBuddyCollections.flat();
        setGullyBuddyCollectionNFTs(flattenedGullyBuddyCollections); // Update Gullybuddy specific NFTs
      } catch (err) {
        console.error("Error fetching Gullybuddy NFTs:", err);
      }
    }
  }, [isConnected]);

  // Fetch NFTs from all chains using moralis
  const fetchNFTs = useCallback(async () => {
    try {
      // Initialize Moralis if not already started
      if (!Moralis.Core.isStarted) {
        await Moralis.start({ apiKey: api_key });
      }
      // Ensure the required address and vanityAddress are valid
      if (
        !address ||
        vanityAddress === "0x0000000000000000000000000000000000000000"
      ) {
        return;
      }
      // Define blockchain networks
      const chains = [
        { chain: "0x1", name: "Mainnet" },
        { chain: "0x89", name: "Matic" },
        { chain: "0xa4b1", name: "Arbitrum" },
        // { chain: "0x2105", name: "Base" },
        { chain: "0xaa36a7", name: "Sepolia" },
        // { chain: "0x13882", name: "Matic-Amoy" },
        // { chain: "0x14a34", name: "Base-Sepolia" },
      ];
      // Fetch NFTs from all chains
      const nftPromises = chains.map((chain) =>
        Moralis.EvmApi.nft
          .getWalletNFTs({
            chain: chain.chain,
            format: "decimal",
            mediaItems: true,
            normalizeMetadata: true,
            limit: 10,
            address: address!,
          })
          .then((res) =>
            res.raw.result.map((nft: any) => ({
              chainName: chain.name,
              contractAddress: nft.token_address,
              tokenId: nft.token_id,
              name: nft.name,
              tokenType: nft.contract_type,
              tokenUri: nft.token_uri,
              imageUrl: nft.normalized_metadata?.image,
              mediaType: nft.media?.mimetype,
              timeLastUpdated: nft.last_metadata_sync,
              floorPrice: nft?.floor_price,
              floorPriceUsd: nft?.floor_price_usd,
              lastclaimedAt: null,
              totalClaimedRewardCount: 0,
              totalClaimedRewardHash: [],
            }))
          )
          .catch((err) => {
            console.error(`Error fetching NFTs for chain ${chain.name}:`, err);
            return [];
          })
      );

      const combinedNFTs: NFTDetails[] = (
        await Promise.all(nftPromises)
      ).flat();
      if (combinedNFTs.length === 0) {
        console.warn("No NFTs found across all chains.");
        return;
      }

      // set All NFTs
      setNFTdata(combinedNFTs);

      // Define the array of contract addresses
      const targetContractAddresses = gullyBuddyNFTCollectionAddress.map(
        (addr) => addr.toLowerCase()
      );

      // Filter for GullyBuddy NFTs (matching one of the target addresses)
      const gullyBuddyNFTsData = combinedNFTs.filter((nft: any) =>
        targetContractAddresses.includes(nft.contractAddress?.toLowerCase())
      );

      // Filter for other NFTs (not matching any of the target addresses)
      const otherNFTsData = combinedNFTs.filter(
        (nft: any) =>
          !targetContractAddresses.includes(nft.contractAddress?.toLowerCase())
      );

      // Set the filtered states
      setGullyBuddyNFTs(gullyBuddyNFTsData);
      setOtherNFTs(otherNFTsData);

      // Fetch existing NFTs from the database
      let existingNFTs: NFTDetails[] = [];
      try {
        existingNFTs = await getNFTDetails(address);
        if (!Array.isArray(existingNFTs)) {
          console.warn(
            "Existing NFTs fetched are not an array. Defaulting to empty."
          );
          existingNFTs = [];
        }
      } catch (err) {
        console.error("Error fetching existing NFTs from the database:", err);
        existingNFTs = [];
      }

      for (const nft of combinedNFTs) {
        const exists = existingNFTs.some(
          (existingNft) =>
            existingNft.tokenId === nft.tokenId &&
            existingNft.contractAddress === nft.contractAddress
        );

        if (!exists) {
          const result = await saveNFTDetails(nft, address, vanityAddress);
          if (result) {
            console.log("NFTs saved successfully:", result);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, [address, vanityAddress, isConnected]);

  // fetch the Account persona NFT and Token Details
  useEffect(() => {
    // fetch the Account Persona socket NFT
    const fetchAccountPersonaNFT = async () => {
      if (isConnected && vanityAddress) {
        const response = await getSocketNFTLastTransferDetails(vanityAddress);
        if (response !== null) {
          setNftSocketed(true);
          setsocketNFTImageURL(response.imageUrl);
          setsocketNFTImageMediaType(response.mediaType);
          // Filter based on the contract address
          const gullyBuddyNFT = NFTdata.filter(
            (nft) =>
              nft?.contractAddress?.toLowerCase() ===
              gullyBuddyNFTAddress.toLowerCase()
          );
          if (gullyBuddyNFT.length > 0) {
            setIsHoldGullyBuddyNFT(true);
          }
        }
      } else {
        setNftSocketed(false);
        setsocketNFTImageURL(null);
        setsocketNFTImageMediaType(null);
      }
    };
    if (address && isConnected && vanityAddress) {
      fetchAccountPersonaNFT();
    }
  }, [
    address,
    isConnected,
    vanityAddress,
    socketNFTImageURL,
    isHoldGullyBuddyNFT,
  ]);

  // handle dissconnect to reset the holding gullybudday state
  useEffect(() => {
    if (!isConnected) {
      // If the wallet is disconnected, reset state
      setNftSocketed(false);
      setIsHoldGullyBuddyNFT(false);
      setsocketNFTImageURL(null);
      setsocketNFTImageMediaType(null);
    }
  }, [isConnected]);

  //fetch Token Balance
  useEffect(() => {
    if (triggerUpdate) {
      setBalances({
        wallet: [],
        vanity: [],
      });
    }
    fetchTokenBalance();
  }, [triggerUpdate, fetchTokenBalance]);

  // Convert image url
  const convertIpfsUrl = (imageUrl: string) => {
    if (!imageUrl) {
      return imageUrl;
    }
    if (imageUrl.startsWith("ipfs://")) {
      const ipfsHash = imageUrl.slice(7);
      // const newImageUrl = `https://ipfs.moralis.io:2053/ipfs/${ipfsHash}`;
      const newImageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      return newImageUrl;
    }
    return imageUrl;
  };

  // Check the wallet connection priorer for require feature
  const handleClickCheckConnectNetwork = (
    e: React.MouseEvent,
    message: string
  ) => {
    if (!isConnected || !address || !vanityAddress) {
      e.preventDefault();
      toast.warning(message);
    }
  };

  // Render count Down
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: CountdownRendererProps) => {
    if (completed) {
      return (
        <div className="text-2xl font-bold text-green-500">Time's up!</div>
      );
    } else {
      return (
        <div className="text-center">
          {/* Heading for the countdown */}
          {/* Countdown timer display */}
          <div className="text-3xl font-semibold text-gray-800">
            <div className="text-xl font-semibold text-white mb-1">
              Our NFT Collection Drops In
            </div>
            <span className="p-4 text-white   transform transition duration-300 ">
              <span className="text-3xl sm:text-3xl md:text-3xl font-bold">
                {days}
              </span>
              <span className="text-sm sm:text-base md:text-lg">{" D "}</span>

              <span className="text-3xl sm:text-3xl md:text-3xl font-bold">
                {hours}
              </span>
              <span className="text-sm sm:text-base md:text-lg">{" H "}</span>

              <span className="text-3xl sm:text-3xl md:text-3xl font-bold">
                {minutes}
              </span>
              <span className="text-sm sm:text-base md:text-lg">{" M "}</span>

              <span className="text-3xl sm:text-3xl md:text-3xl font-bold">
                {seconds}
              </span>
              <span className="text-sm sm:text-base md:text-lg">{" S "}</span>
            </span>
          </div>
        </div>
      );
    }
  };

  // fetch NFT data Collection from OpenSea on load
  useEffect(() => {
    fetchGullyBuddyNFTs();
  }, [fetchGullyBuddyNFTs]);

  // Fetch NFTs on load or when the user connects wallet
  useEffect(() => {
    if (address) {
      fetchNFTs();
    }
  }, [address, fetchNFTs]);

  // handle Change tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Function to fetch network details
  const getNetworkDetails = async () => {
    try {
      if (!walletProvider) return;
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const network = await ethersProvider.getNetwork();
      setSelectedChain(network.name);
    } catch (error) {
      console.error("Error fetching network:", error);
    }
  };
  
  // Function to get the Network Details
  useEffect(() => {
    if (walletProvider) {
      getNetworkDetails();
    }
  }, [walletProvider]);

  return (
    <>
      {/* second Navbar */}
      <div className="container m-auto flex justify-between mt-2 flex-col md:flex-row gap-3 ">
        {/* Start section  : Account Persona Details */}
        <div className="flex flex-col gap-8 justify-start ml-4 w-full md:w-1/4 sm:text-center md:text-left sm:ml-0 md:ml-4">
          {/* Terms of use */}
          <div className="">
            <button
              className="border-2 border-[#5682D980] p-0 flex-shrink sm:p-1 md:p-2 text-sm font-sans text-white rounded-md hover:bg-neutral-400 hover:text-blue-800 sm:w-44 md:w-fit"
              onClick={handleOpenModal(setOpenTermsModal)}
            >
              Gully Buddies Membership Rewards!!!! [Update]
            </button>
          </div>
          {/* Account Persona: [Default] */}
          <div className="flex flex-col mt-2 gap-2 sm:items-center md:items-start">
            <p className="text-md font-sans text-[#5692D9]">
              Account Persona:{" "}
              {socketNFTImageURL ? "[NFT Socketed]" : " [Default]"}
            </p>

            {socketNFTImageMediaType === "video/mp4" ? (
              <video
                src={convertIpfsUrl(socketNFTImageURL!)}
                controls
                className="md:w-30 sm:w-48 h-auto"
              />
            ) : (
              <img
                src={
                  socketNFTImageURL
                    ? convertIpfsUrl(socketNFTImageURL!)
                    : "/accountPersona.png"
                }
                alt="Account Persona not found"
                className="md:w-30 sm:w-48 h-auto rounded-xl"
              />
            )}
            {nftSocketed ? (
              isHoldGullyBuddyNFT ? (
                <p className="text-green-600 text-md mx-4">
                  Monthly Bonus Active 📈
                </p>
              ) : (
                <p className="text-yellow-600 text-md">
                  To activate Monthly Bonus, you need a minimum of 1 Passport
                  NFT 🛂
                </p>
              )
            ) : (
              <p className="text-red-700 text-md mx-4">No Bonus Active 😕</p>
            )}

            <Link
              to={`/nft/socketNFT/${vanityAddress}`}
              className="hover:text-[#5692D9] cursor-pointer underline text-white"
              onClick={(e) =>
                handleClickCheckConnectNetwork(
                  e,
                  "Please connect your wallet to view Socketed NFTs."
                )
              }
            >
              Get List of [Socketed NFTs]
            </Link>
          </div>
          {/* divider */}
          <div>
            <hr className="sm:border-t sm:border-gray-600 sm:w-11/12 sm:m-auto sm:my-3 md:border-t-0 md:w-0 md:my-0 md:m-0" />
          </div>
        </div>

        {/* Middle section : Links */}
        <div className="flex flex-col text-white text-sm gap-3 items-center w-full md:w-1/2">
          <div className="flex flex-col gap-3 font-sans font-normal sm: ml-4 md:ml-10 lg:ml-0">
            <button className="border-2 border-[#5682D980] px-2 py-2 rounded-md hover:bg-neutral-400 hover:text-blue-800 w-fit mb-2">
              Minigame (Player Vs. Player)
            </button>
            <Link
              to="/endorsee/quest"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Endorsee Quest Activity (Closed Beta Coming Soon)
            </Link>
            <Link
              to="/jotform2"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Daily Quest Activity (Closed Beta Coming Soon)
            </Link>
            <Link
              to="/sponsorship"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Sponsorship/Endorsements (Closed Beta Coming Soon)
            </Link>
            <Link
              to="/#"
              className="hover:text-[#5692D9] cursor-pointer underline"
              onClick={handleOpenModal(setOpenLeadershipModal)}
            >
              Leadership/Ranking
            </Link>
            <Link
              to="/#"
              className="hover:text-[#5692D9] cursor-pointer underline"
              onClick={handleOpenModal(setOpenCDERewardModal)}
            >
              Purchase and/or Wrap your CDE for % off Market Price!
            </Link>
            <Link
              to={`/quest/completed/${address}`}
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Get Your Endorsee Quest Response (Closed Beta Coming Soon)
            </Link>
            <Link
              to="/#"
              className="hover:text-[#5692D9] cursor-pointer underline"
              onClick={handleOpenModal(setOpenSocketNFTModal)}
            >
              Edit Persona Socket NFT(% Increase Monthly Return)
            </Link>
            <Link
              to="/#"
              className="hover:text-[#5692D9] cursor-pointer underline"
              onClick={handleOpenModal(setOpenWithdrawModal)}
            >
              How to Withdraw ?
            </Link>
            <Link
              to={`/content/${address}`}
              className="hover:text-[#5692D9] cursor-pointer underline"
              onClick={(e) =>
                handleClickCheckConnectNetwork(
                  e,
                  "Please connect your wallet to generate the content."
                )
              }
            >
              Contribute user generated content
            </Link>

            {/* divider */}
            <div>
              <hr className="sm:border-t sm:border-gray-600 sm:w-11/12 sm:my-4 md:border-t-0 md:w-0 md:my-0 md:m-0" />
            </div>
          </div>
        </div>

        {/* Last section : Total valuation */}
        <div className="flex flex-col sm:gap-4 md:gap-4 lg:gap-6 text-md font-normal w-full md:w-1/4 sm:text-center md:text-left">
          <div className="text-white flex gap-1">
            <span className="text-blue-400 mr-2">Total Value :</span>{" "}
            <span>{calculateTotalNFTValue()} USD</span>
          </div>
          {/* Wallet Balance */}
          <div className="flex flex-col gap-2">
            <div className="md:mb-0 lg:mb-2 flex flex-col">
              <span className="md:text-sm lg:text-md font-sans text-blue-400 font-bold flex gap-3 items-center sm:justify-center md:justify-start">
                <span className="text-center mt-1">Wallet Address Balance</span>
              </span>
              <hr className="sm:border-dotted sm:border-t sm:border-gray-600 sm:w-full sm:my-1 sm:m-auto md:w-full md:my-2" />
            </div>
            {/* Loop through tokenDetails to display the balances */}
            {tokenDetailsByChain[selectedChain] &&
            Object.keys(tokenDetailsByChain[selectedChain]).map(
              (tokenAddress, idx) => {
                const walletToken = balances.wallet.find(
                  (token: any) =>
                    tokenDetailsByChain[selectedChain][tokenAddress]?.name ===
                    token.name
                );
                const walletBalance = walletToken ? walletToken.balance : "0";

                return (
                  <div
                    key={idx}
                    className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
                  >
                    <span className="text-[#5692D9] mr-2 flex gap-1">
                      <p>
                        {tokenDetailsByChain[selectedChain][tokenAddress].name}
                      </p>
                      <p>Token Balance:</p>
                    </span>{" "}
                    <span>
                      {walletBalance}{" "}
                      {tokenDetailsByChain[selectedChain][tokenAddress].symbol}
                    </span>
                  </div>
                );
              }
            )}
          </div>
          {/* Vanity Balance */}
          <div className="flex flex-col gap-2 mt-2">
            <div className="md:mb-0 lg:mb-2 flex flex-col">
              <span className="md:text-sm lg:text-md font-sans text-blue-400 font-bold flex gap-3 sm:justify-center md:justify-start items-center">
                <span className="text-center mt-1">Vanity Address Balance</span>

                {/* Etherscan Link */}
                <Tooltip title="View on Etherscan" arrow>
                  <a
                    href={`https://etherscan.io/address/${vanityAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5692D9] mt-1.5 cursor-pointer"
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
                    className="text-[#5692D9] mt-1.5 cursor-pointer"
                    data-tip="View on Polygonscan"
                  >
                    <SiPolygon />
                  </a>
                </Tooltip>

                {/* CDE Link */}
                <Tooltip title="CDE" arrow>
                  <a
                    href={`/#`}
                    rel="noopener noreferrer"
                    className="text-[#5692D9] mt-1 cursor-pointer"
                    data-tip="CDE"
                    onClick={() => alert("Prestige this Account")}
                  >
                    <img src="/CDE.svg" className="h-4 w-auto" alt="CDE" />
                  </a>
                </Tooltip>

                {/* Dropdown Toggle Button */}
                <Tooltip title="Select Vanity Address">
                  <IconButton
                    aria-label="more"
                    // size="medium"
                    aria-expanded={isDropdownOpen ? "true" : undefined}
                    aria-controls={isDropdownOpen ? "long-menu" : undefined}
                    aria-haspopup="true"
                    onClick={handleDropdownToggle}
                    sx={{
                      color: "#5692D9",
                      "&:hover": {
                        color: "#4682B4",
                      },
                      fontSize: "1.5rem",
                      marginTop: "0.4rem",
                    }}
                    className="mt-1.5 cursor-pointer"
                  >
                    <IoMdArrowDropdown />
                  </IconButton>
                </Tooltip>
              </span>

              {/* Material-UI Dropdown */}
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={isDropdownOpen}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    elevation: 0,
                    sx: {
                      overflow: "visible",
                      filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                      mt: 1.5,
                      "& .MuiAvatar-root": {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      "&::before": {
                        content: '""',
                        display: "block",
                        position: "absolute",
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: "background.paper",
                        transform: "translateY(-50%) rotate(45deg)",
                        zIndex: 0,
                      },
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {/* Check if vanityAddresses is empty */}
                {vanityAddress && vanityAddresses.length > 0 ? (
                  vanityAddresses?.map((vanityData: any) => (
                    <MenuItem
                      key={vanityData.vanityAddress}
                      onClick={() =>
                        handleAddressSelect(vanityData.vanityAddress)
                      }
                    >
                      {/* Vanity Address and Type */}
                      <div className="text-sm text-gray-800 flex gap-2">
                        <p>
                          {" "}
                          {`${vanityData.vanityAddress.slice(
                            0,
                            10
                          )}...${vanityData.vanityAddress.slice(-7)}`}
                        </p>
                        <p>({vanityData.vanityAccountType})</p>
                      </div>
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    Wallet not connected. Please connect wallet first.
                  </MenuItem>
                )}
              </Menu>

              <hr className="sm:border-dotted sm:border-t sm:border-gray-600 sm:w-full sm:my-1 sm:m-auto md:w-full md:my-2" />
            </div>

            {/* Determine Selected Vanity Address's Type */}
            {(() => {
              const selectedVanity: any = vanityAddresses.find(
                (item: any) => item.vanityAddress === vanityAddress
              );
              const vanityAccountType =
                selectedVanity?.vanityAccountType || "unknown";
              if (vanityAccountType === "Prestige") {
                // Show only ANT Token Balance
                const antToken = balances.vanity.find(
                  (token: any) => token.symbol === "AN"
                );

                const antBalance = antToken ? antToken.balance : "0";
                return (
                  <div className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1">
                    <span className="text-[#5692D9] mr-2 flex items-center">
                      AN
                      <img
                        src="/Annotation.svg"
                        alt="TANT Symbol"
                        className="w-4 h-4 mx-1 rounded-md"
                      />
                      Token Balance:
                    </span>
                    <span>{antBalance} AN</span>
                  </div>
                );
              } else {
                // Show all balances
                return (
                  <>
                   {tokenDetailsByChain[selectedChain] &&
                    Object.keys(tokenDetailsByChain[selectedChain]).map(
                      (tokenAddress, idx) => {
                        const vanityToken = balances.vanity.find(
                          (token: any) =>
                            tokenDetailsByChain[selectedChain][tokenAddress]
                              ?.name === token.name // Match by token name
                        );

                        const vanityBalance = vanityToken
                          ? vanityToken.balance
                          : "0";

                        return (
                          <div
                            key={idx}
                            className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
                          >
                            <span className="text-[#5692D9] mr-2 flex gap-1">
                              <p>
                                {
                                  tokenDetailsByChain[selectedChain][
                                    tokenAddress
                                  ].name
                                }
                              </p>
                              <p>Token Balance:</p>
                            </span>
                            <span>
                              {vanityBalance}{" "}
                              {
                                tokenDetailsByChain[selectedChain][tokenAddress]
                                  .symbol
                              }
                            </span>
                          </div>
                        );
                      }
                    )}
                  </>
                );
              }
            })()}
          </div>
        </div>
      </div>

      {/* divider */}
      <div className="">
        <hr className="container m-auto sm:border sm:border-t-2 sm:border-gray-600 sm:w-full sm:my-2 sm:m-auto md:w-full md:my-4" />
      </div>

      {/* shop and meeting room */}
      <div className="container m-auto flex gap-3 sm:flex-col md:flex-row justify-between py-2 px-4">
        {/* shop */}
        <div className="flex-1 min-w-0 flex justify-start">
          <Link
            to={"/nft/shop"}
            className="flex gap-3 items-center justify-center sm:w-full md:w-52 lg:w-56 sm:p-2.5  xl:w-60 rounded-3xl bg-blue-400  text-white hover:text-blue-900 cursor-pointer"
          >
            <FiArrowLeftCircle className="text-2xl mt-1" />
            <span className="flex gap-2 items-center">
              <p className="mt-1">Shop</p>
              <GiBiceps className="text-xl" />
            </span>
          </Link>
        </div>
        <div className="flex-1 min-w-0  flex justify-center">
          <Countdown date={targetDate} renderer={renderer} />
        </div>

        {/* meeting room */}
        <div className="flex-1 min-w-0 flex justify-end">
          <div
            className="flex gap-3 items-center justify-center sm:w-full md:w-52 lg:w-56  sm:p-2.5 xl:w-60 rounded-3xl bg-blue-400  text-white hover:text-blue-900 cursor-pointer"
            onClick={handleOpenModal(setOpenMeetingRoomModal)}
          >
            <span className="flex gap-2 items-center">
              <HiMiniTv className="text-xl" />
              <p>Meeting Rooms</p>
            </span>
            <FiArrowRightCircle className="text-2xl" />
          </div>
        </div>
      </div>

      {/* Holding options */}
      <div className="container m-auto flex flex-col gap-3 py-2 mt-3 px-4 w-full">
        {isConnected && (
          <>
            <Box sx={{ width: "100%" }}>
              <Tabs value={value} onChange={handleTabChange} centered>
                <Tab label="All NFT Holdings" sx={{ color: "white" }} />
                <Tab label="Gullybuddy's holdings" sx={{ color: "white" }} />
              </Tabs>
            </Box>
          </>
        )}

        {/* NFT cards */}
        <div className="mt-3 w-full">
          {/* Render Tabs Based on Wallet Connection Status */}
          {isConnected ? (
            <>
              {/* Render Other Socketed NFTs */}
              {value === 0 &&
                (otherNFTs.length > 0 ? (
                  <div className="w-full flex flex-wrap">
                    <NftCard NFTDetails={otherNFTs} CardType={"walletNFT"} />
                  </div>
                ) : (
                  <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
                    No NFTs in your wallet at the moment
                  </h1>
                ))}

              {/* Render Gullybuddy's Socketed NFTs */}
              {value === 1 &&
                (gullyBuddyNFTs.length > 0 ? (
                  <div className="w-full flex flex-wrap">
                    <NftCard
                      NFTDetails={gullyBuddyNFTs}
                      CardType={"walletNFT"}
                    />
                  </div>
                ) : (
                  <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
                    No Gullybuddy's NFTs in your wallet at the moment
                  </h1>
                ))}
            </>
          ) : (
            <>
              {/* Wallet Not Connected - Display Gullybuddy Collection */}
              <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-gray-500">
                Connect your wallet to explore your wallet NFTs
              </h1>
              {gullyBuddyCollectionNFTs.length > 0 ? (
                <div className="w-full flex flex-wrap">
                  <ShopeNftcard
                    NFTDetails={gullyBuddyCollectionNFTs}
                    CardType={"BuyNft"}
                    tabValue="null"
                  />
                </div>
              ) : (
                <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
                  No NFTs in the Gullybuddy collection at the moment
                </h1>
              )}
            </>
          )}
        </div>
      </div>

      {/* Gully Buddies Membership Rewards Modal */}
      {openTermsModal && (
        <>
          <TermsModel
            open={openTermsModal}
            onClose={handleCloseModal(setOpenTermsModal)}
          />
        </>
      )}

      {/* CDE Reward Modal */}
      {openCDERewardModal && (
        <>
          <CDEReward
            open={openCDERewardModal}
            onClose={handleCloseModal(setOpenCDERewardModal)}
          />
        </>
      )}

      {/* Meeting Room Modal */}
      {openMeetingRoomModal && (
        <>
          <MeetingRoom
            open={openMeetingRoomModal}
            onClose={handleCloseModal(setOpenMeetingRoomModal)}
          />
        </>
      )}

      {/* Leadership Modal */}
      {openLeadershipModal && (
        <>
          <Leadership
            open={openLeadershipModal}
            onClose={handleCloseModal(setOpenLeadershipModal)}
          />
        </>
      )}

      {/* Persona Socket NFT */}
      {openSocketNFTModal && (
        <>
          <SocketNFT
            open={openSocketNFTModal}
            onClose={handleCloseModal(setOpenSocketNFTModal)}
            NFTDetails={NFTdata}
          />
        </>
      )}

      {/* How to withdraw Modal */}
      {openWithdrawModal && (
        <>
          <Withdraw
            open={openWithdrawModal}
            onClose={handleCloseModal(setOpenWithdrawModal)}
          />
        </>
      )}
    </>
  );
};

export default Home;
