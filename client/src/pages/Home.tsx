import React, { useCallback, useEffect, useState } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Moralis from "moralis";
import { Link } from "react-router-dom";
import { ethers, Contract } from "ethers";
import Web3 from "web3";
import { NFTDetails } from "../utils/Types";
import { ERC20ABI } from "../utils/ABI";
import NftCard from "../components/homeComponents/card/NftCard";
import ShopeNftcard from "../components/homeComponents/card/ShopeNftcard";
import TermsModel from "../components/homeComponents/modals/TermsModal";
import CDEReward from "../components/homeComponents/modals/CDEReward";
import { useVanityContext } from "../context/VanityContext";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import MeetingRoom from "../components/homeComponents/modals/MeetingRoom";
import testTokenAbi from "./../artifacts/contracts/Token.sol/Token.json";
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

// Constant Token address
const tokenAddresses: any = {
  CDE1: process.env.REACT_APP_TOKEN1_ADDRESS,
  CDE2: process.env.REACT_APP_TOKEN2_ADDRESS,
  TIM: process.env.REACT_APP_TOKEN3_ADDRESS,
};

const tokenDetails = {
  [process.env.REACT_APP_TOKEN1_ADDRESS!]: {
    name: "CDE®v1",
    symbol: "CDE",
  },
  [process.env.REACT_APP_TOKEN2_ADDRESS!]: {
    name: "CDE®v2",
    symbol: "CDE",
  },
  [process.env.REACT_APP_TOKEN3_ADDRESS!]: {
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
  },
};

const TestCDEAddress: any =
  process.env.REACT_APP_TESTCDE_TOKEN_CONTRACT_ADDRESS;
const TestTIMAddress: any =
  process.env.REACT_APP_TESTTIM_TOKEN_CONTRACT_ADDRESS;

// API KEY
const api_key: any = process.env.REACT_APP_MORALIS_NFT_API;
const rpc_url: any = process.env.REACT_APP_RPC_URL;
const sepolia_rpc_url: any = process.env.REACT_APP_RPC_URL_SEPOLIA;
const ApiKey = process.env.REACT_APP_OPENSEA_API_KEY;
// const testWalletAddress: any = process.env.REACT_APP_TEST_WALLET_ADDRESS;

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

const Home = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const [balances, setBalances] = useState<any>({
    wallet: [],
    vanity: [],
  });

  const [testCDEBalance, setTestCDEBalance] = useState(0);
  const [testTIMBalance, setTestTIMBalance] = useState(0);
  const [NFTdata, setNFTdata] = useState<NFTDetails[]>([]);
  const [NFTdata2, setNFTdata2] = useState<NFTDetails[]>([]);
  const [NFTdata3, setNFTdata3] = useState<NFTDetails[]>([]);
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
  const { vanityAddress } = useVanityContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const isDropdownOpen = Boolean(anchorEl);
  const targetDate = new Date("2024-12-31T23:59:59");

  const handleDropdownToggle = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
      if (!isConnected && !address && !vanityAddress) {
        setBalances({
          wallet: [],
          vanity: [],
        });
        setTestCDEBalance(0);
        setTestTIMBalance(0);
        return;
      }

      const provider = new ethers.JsonRpcProvider(rpc_url);
      const tokenContracts = Object.keys(tokenAddresses).map(
        (token) => new Contract(tokenAddresses[token], ERC20ABI, provider)
      );

      const testTokenProvider = new ethers.JsonRpcProvider(sepolia_rpc_url);
      const testCDETokenContract = new Contract(
        TestCDEAddress,
        testTokenAbi.abi,
        testTokenProvider
      );
      const testTIMTokenContract = new Contract(
        TestTIMAddress,
        testTokenAbi.abi,
        testTokenProvider
      );

      // ************************  wallet address balance *********************************
      const walletbalances = await Promise.all(
        tokenContracts.map((contract) => contract.balanceOf(address))
      );

      const formattedWalletBalances = walletbalances.map((balance, idx) => ({
        name: tokenDetails[tokenAddresses[Object.keys(tokenAddresses)[idx]]]
          .name,
        symbol:
          tokenDetails[tokenAddresses[Object.keys(tokenAddresses)[idx]]].symbol,
        balance: Number(Web3.utils.fromWei(balance, "ether")).toFixed(4),
      }));
      // console.log("formattedWalletBalances------------",formattedWalletBalances);

      // ************************** vanity address balance  ********************************
      const vanitybalances = await Promise.all(
        tokenContracts.map((contract) => contract.balanceOf(vanityAddress))
      );

      const formattedVanityBalances = vanitybalances.map((balance, idx) => ({
        name: tokenDetails[tokenAddresses[Object.keys(tokenAddresses)[idx]]]
          .name,
        symbol:
          tokenDetails[tokenAddresses[Object.keys(tokenAddresses)[idx]]].symbol,
        balance: Number(Web3.utils.fromWei(balance, "ether")).toFixed(4),
      }));

      // ************************ Test CDE address balance  ************************************
      const testCDETokenBalance = await testCDETokenContract.balanceOf(
        vanityAddress
      );
      const formattedTestCDEBalance = Number(
        Web3.utils.fromWei(testCDETokenBalance, "ether")
      ).toFixed(4);

      // ***********************  Test TIM address balance  *********************************
      const testTIMTokenBalance = await testTIMTokenContract.balanceOf(
        vanityAddress
      );
      const formattedTestTIMBalance = Number(
        Web3.utils.fromWei(testTIMTokenBalance, "ether")
      ).toFixed(4);

      // set all token Balance

      setBalances({
        wallet: formattedWalletBalances,
        vanity: formattedVanityBalances,
      });
      setTestCDEBalance(Number(formattedTestCDEBalance));
      setTestTIMBalance(Number(formattedTestTIMBalance));
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  }, [isConnected, address, vanityAddress]);

  // Function to fetch Gullybuddy specific NFTs
  const fetchGullyBuddyNFTs = useCallback(async () => {
    try {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": `${ApiKey}`,
        },
      };

      const buddyPassportCollection = await fetch(
        `https://api.opensea.io/api/v2/collection/gully-buddy-international-passport-polygon/nfts`,
        options
      );

      const buddyCollection = await fetch(
        `https://api.opensea.io/api/v2/collection/gullybuddypolygon/nfts`,
        options
      );

      const buddyPassportData = await buddyPassportCollection.json();
      const buddyCollectionData = await buddyCollection.json();

      const combinedNFTs = [
        ...(buddyPassportData.nfts || []),
        ...(buddyCollectionData.nfts || []),
      ];

      const formattedNFTs = combinedNFTs.map((nft: NFT) => ({
        chainName: nft.asset_contract?.chain || "Matic",
        contractAddress: nft.contract || "",
        tokenId: nft.identifier || "",
        name: nft.name || "Unnamed NFT",
        tokenType: nft.asset_contract?.schema_name || "ERC721",
        tokenUri: nft.permalink || "",
        imageUrl: nft.display_image_url || "",
        mediaType: nft.display_animation_url ? "video" : "image",
        timeLastUpdated: nft.updated_at || new Date().toISOString(),
        floorPrice: nft.floor_price || 0,
        floorPriceUsd: nft.floor_price_usd || 0,
        priceCurrency: nft.payment_token?.symbol || "ETH",
        lastclaimedAt: new Date(nft.last_claimed_date || Date.now()),
        totalClaimedRewardCount: nft.claim_count || 0,
        totalClaimedRewardHash: nft.claim_hashes || [],
      }));

      setNFTdata3(formattedNFTs); // Update Gullybuddy specific NFTs
    } catch (err) {
      console.error("Error fetching Gullybuddy NFTs:", err);
    }
  }, []);

  // Fetch NFTs from all chains using moralis
  const fetchNFTs = useCallback(async () => {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({ apiKey: api_key });
      }
      // console.log("address--------",address);
      if (
        address &&
        vanityAddress !== "0x0000000000000000000000000000000000000000"
      ) {
        // const testWalletAddressNFT = "0x4f59CE7bb4777b536F09116b66C95A5d1Ea8a8E6";
        // const testWalletAddressNFT = "0x796B6E8F542B9AF20Ec8dd2095a2F6DEb5a0E6eD";
        // const testWalletAddressNFT = "0x3f88C36C69199FAa7298815a4e8aa7119d089448"; // sepolia
        // const testWalletAddressNFT = "0xf8b02EE855D5136ed1D782fC0a53a0CDdA65c946"; // sepolia
        // const testWalletAddressNFT = "0x7049577ABAea053257Bf235bFDCa57036Aed6AdD"; // sepolia
        // const testWalletAddressNFT = "0x7049577ABAea053257Bf235bFDCa57036Aed6AdD"; // polygon amoy
        const chains = [
          { chain: "0x1", name: "Mainnet" },
          { chain: "0x89", name: "Matic" },
          { chain: "0xa4b1", name: "Arbitrum" },
          { chain: "0x2105", name: "Base" },
          { chain: "0xaa36a7", name: "Sepolia" },
          { chain: "0x13882", name: "Matic-Amoy" },
          { chain: "0x14a33", name: "Base-Sepolia" },
        ];

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
                imageUrl: nft.media?.original_media_url,
                mediaType: nft.media?.mimetype,
                timeLastUpdated: nft.last_metadata_sync,
                floorPrice: nft?.floor_price,
                floorPriceUsd: nft?.floor_price_usd,
                lastclaimedAt: null,
                totalClaimedRewardCount: 0,
                totalClaimedRewardHash: [],
              }))
            )
        );

        const combinedNFTs: NFTDetails[] = (
          await Promise.all(nftPromises)
        ).flat();
        setNFTdata(combinedNFTs);
        // Fetch existing NFTs from the database to check for duplicates
        let existingNFTs: NFTDetails[] = await getNFTDetails(address);

        // Ensure existingNFTs is an array
        if (!Array.isArray(existingNFTs)) {
          console.error(
            "existingNFTs is not an array. Setting it to an empty array."
          );
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
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, [address, vanityAddress]);

  // fetch the NFT and Token Details
  useEffect(() => {
    // fetch the Account Persona socket NFT
    const fetchAccountPersonaNFT = async () => {
      if (isConnected && vanityAddress) {
        const response = await getSocketNFTLastTransferDetails(vanityAddress);
        if (response !== null) {
          setNftSocketed(true);
          setsocketNFTImageURL(response.imageUrl);
          setsocketNFTImageMediaType(response.mediaType);
        }
      } else {
        setsocketNFTImageURL(null);
        setsocketNFTImageMediaType(null);
      }
    };
    if (address && isConnected && vanityAddress) {
      fetchTokenBalance();
      fetchNFTs();
      fetchAccountPersonaNFT();
    }
  }, [
    address,
    isConnected,
    vanityAddress,
    fetchTokenBalance,
    fetchNFTs,
    testCDEBalance,
    testTIMBalance,
    socketNFTImageURL,
  ]);

  // Convert image url
  const convertIpfsUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("ipfs://")) {
      const ipfsHash = imageUrl.slice(7);
      const newImageUrl = `https://ipfs.moralis.io:2053/ipfs/${ipfsHash}`;
      return newImageUrl;
    }
    return imageUrl;
  };

  // navigate the user generated content page if user connected
  const handleClick = (e: any) => {
    if (!isConnected || !address) {
      e.preventDefault();
      toast.warning("Please connect your wallet to generate the content.");
    }
  };

  // navigate the view socket nft if user connected
  const handleClickSocketNFT = (e: any) => {
    if (!isConnected || !address || !vanityAddress) {
      e.preventDefault();
      toast.warning("Please connect your wallet to view Socketed NFTs.");
    }
  };

  interface CountdownRendererProps {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }

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

  // useEffect to filter common NFTs between NFTdata and NFTdata3
  useEffect(() => {
    if (NFTdata.length > 0 && NFTdata3.length > 0) {
      const commonNFTs = NFTdata.filter((nft) =>
        NFTdata3.some(
          (nft3) =>
            nft3.tokenId === nft.tokenId &&
            nft3.contractAddress === nft.contractAddress
        )
      );

      setNFTdata2(commonNFTs);
    }
  }, [NFTdata, NFTdata3]);

  // fetch NFT data from OpenSea on load
  useEffect(() => {
    fetchGullyBuddyNFTs();
  }, [fetchGullyBuddyNFTs]);

  // Fetch NFTs on load or when the user connects wallet
  useEffect(() => {
    if (address) {
      fetchNFTs();
    }
  }, [address, fetchNFTs]);

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      {/* second Navbar */}
      <div className="container m-auto flex justify-between mt-2 flex-col md:flex-row gap-3 ">
        {/* Start section */}
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
              <p className="text-green-600 text-md mx-4">Monthly Bonus Active 📈</p>
            ) : (
              <p className="text-red-700 text-md mx-4">No Bonus Active 😕</p>
            )}
            <Link
              to={`/nft/socketNFT/${vanityAddress}`}
              className="hover:text-[#5692D9] cursor-pointer underline text-white"
              onClick={handleClickSocketNFT}
            >
              Get List of [Socketed NFTs]
            </Link>
          </div>
          {/* divider */}
          <div>
            <hr className="sm:border-t sm:border-gray-600 sm:w-11/12 sm:m-auto sm:my-3 md:border-t-0 md:w-0 md:my-0 md:m-0" />
          </div>
        </div>

        {/* middle section : Links */}
        <div className="flex flex-col text-white text-sm gap-3 items-center w-full md:w-1/2">
          <div className="flex flex-col gap-3 font-sans font-normal sm: ml-4 md:ml-10 lg:ml-0">
            <button className="border-2 border-[#5682D980] px-2 py-2 rounded-md hover:bg-neutral-400 hover:text-blue-800 w-fit mb-2">
              Minigame (Player Vs. Player)
            </button>
            <Link
              to="/endorsee/quest"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Endorsee Quest Activity
            </Link>
            <Link
              to="/jotform2"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Daily Quest Activity
            </Link>
            <Link
              to="/sponsorship"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Sponsorship/Endorsements
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
              Get Your Endorsee Quest Response
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
              onClick={handleClick}
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
          <div className="flex flex-col gap-2">
            <div className="md:mb-0 lg:mb-2 flex flex-col">
              <span className="md:text-sm lg:text-md font-sans text-blue-400 font-bold flex gap-3 items-center sm:justify-center md:justify-start">
                <span className="text-center mt-1">Wallet Address Balance</span>
              </span>
              <hr className="sm:border-dotted sm:border-t sm:border-gray-600 sm:w-full sm:my-1 sm:m-auto md:w-full md:my-2" />
            </div>
            {/* Loop through tokenDetails to display the balances */}
            {Object.keys(tokenDetails).map((tokenAddress, idx) => {
              const walletToken = balances.wallet.find(
                (token: any) => tokenAddress === token.address
              );
              const walletBalance = walletToken ? walletToken.balance : "0";

              return (
                <div
                  key={idx}
                  className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
                >
                  <span className="text-[#5692D9] mr-2 flex gap-1">
                    <p>{tokenDetails[tokenAddress].name}</p>
                    <p>Token Balance:</p>
                  </span>{" "}
                  <span>
                    {walletBalance} {tokenDetails[tokenAddress].symbol}
                  </span>
                </div>
              );
            })}
          </div>

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
                <IconButton
                  aria-label="more"
                  aria-controls={isDropdownOpen ? "long-menu" : undefined}
                  aria-haspopup="true"
                  onClick={handleDropdownToggle}
                  className="text-[#5692D9] mt-1 cursor-pointer"
                >
                  <IoMdArrowDropdown />
                </IconButton>
              </span>

              {/* Material-UI Dropdown */}
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={isDropdownOpen}
                onClose={handleClose}
                slotProps={{
                  paper: {
                    style: {
                      maxHeight: 200,
                      width: "20ch",
                      marginTop: "8px",
                    },
                  },
                }}
              >
                {/* {vanityAddresses.map((address) => (
          <MenuItem
            key={address}
            onClick={() => handleAddressSelect(address)}
          >
            {address}
          </MenuItem>
        ))} */}
                {/* Disabled option */}
                <MenuItem disabled>Prestige this Account</MenuItem>
              </Menu>

              <hr className="sm:border-dotted sm:border-t sm:border-gray-600 sm:w-full sm:my-1 sm:m-auto md:w-full md:my-2" />
            </div>

            {/* Loop through tokenDetails for vanity address */}
            {Object.keys(tokenDetails).map((tokenAddress, idx) => {
              const vanityToken = balances.vanity.find(
                (token: any) => tokenAddress === token.address
              );
              const vanityBalance = vanityToken ? vanityToken.balance : "0";

              return (
                <div
                  key={idx}
                  className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
                >
                  <span className="text-[#5692D9] mr-2 flex gap-1">
                    <p>{tokenDetails[tokenAddress].name}</p>
                    <p>Token Balance:</p>
                  </span>{" "}
                  <span>
                    {vanityBalance} {tokenDetails[tokenAddress].symbol}
                  </span>
                </div>
              );
            })}
            <div className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1">
              <span className="text-[#5692D9] mr-2">
                Test CDE Token Balance:
              </span>{" "}
              <span>{testCDEBalance} TCDE</span>
            </div>
            <div className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1">
              <span className="text-[#5692D9] mr-2">
                Test TIM Token Balance:
              </span>{" "}
              <span>{testTIMBalance} TTIM</span>
            </div>
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
        <Box sx={{ width: "100%" }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label="All NFT Holdings" sx={{ color: "white" }} />
            <Tab label="Gullybuddy's holdings" sx={{ color: "white" }} />
          </Tabs>
        </Box>

        {/* NFT cards */}
        <div className="mt-3 w-full">
          {isConnected ? (
            vanityAddress === "0x0000000000000000000000000000000000000000" ? (
              <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
                Vanity Address not generated
              </h1>
            ) : value === 0 ? ( // All NFTs
              NFTdata.length > 0 ? (
                <div className="w-full flex flex-wrap">
                  <NftCard NFTDetails={NFTdata} CardType={"walletNFT"} />
                </div>
              ) : (
                <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
                  No NFTs in your account at the moment
                </h1>
              )
            ) : value === 1 ? ( // Gullybuddy's holdings
              NFTdata.length > 0 ? (
                <div className="w-full flex flex-wrap">
                  <NftCard NFTDetails={NFTdata2} CardType={"walletNFT"} />
                </div>
              ) : (
                <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
                  No NFTs in your account at the moment
                </h1>
              )
            ) : null
          ) : (
            <ShopeNftcard NFTDetails={NFTdata3} CardType={"BuyNft"} />
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
            // ConnecteNetworkname={}
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
