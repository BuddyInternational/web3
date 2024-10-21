import React, { useCallback, useEffect, useState } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Moralis from "moralis";
import { Link } from "react-router-dom";
import { ethers, Contract } from "ethers";
import Web3 from "web3";
import { NFTData } from "../utils/Types";
import { ERC20ABI } from "../utils/ABI";
import NftCard from "../components/homeComponents/card/NftCard";
import TermsModel from "../components/homeComponents/modals/TermsModal";
import CDEReward from "../components/homeComponents/modals/CDEReward";
import { useVanityContext } from "../context/VanityContext";
import { FiArrowLeftCircle, FiArrowRightCircle } from "react-icons/fi";
import MeetingRoom from "../components/homeComponents/modals/MeetingRoom";
import testCDETokenAbi from "./../artifacts/contracts/Token.sol/Token.json";
import Leadership from "../components/homeComponents/modals/Leadership";
import { Tooltip } from "@mui/material";
import Withdraw from "../components/homeComponents/modals/Withdraw";
import { SiPolygon } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import SocketNFT from "../components/homeComponents/modals/SocketNFT";
import { HiMiniTv } from "react-icons/hi2";
import { GiBiceps } from "react-icons/gi";
import { getSocketNFTLastTransferDetails } from "../api/socketnftAPI";
import { toast } from "react-toastify";

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

// API KEY
const api_key: any = process.env.REACT_APP_MORALIS_NFT_API;
const rpc_url: any = process.env.REACT_APP_RPC_URL;
const sepolia_rpc_url: any = process.env.REACT_APP_RPC_URL_SEPOLIA;

const testWalletAddress: any = process.env.REACT_APP_TEST_WALLET_ADDRESS;

const Home = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const [balances, setBalances] = useState<any>({
    wallet: [],
    vanity: [],
  });
  const [testCDEBalance, setTestCDEBalance] = useState(0);
  const [NFTdata, setNFTdata] = useState<NFTData[]>([]);
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
  const { vanityAddress } = useVanityContext();

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
        return;
      }

      const provider = new ethers.JsonRpcProvider(rpc_url);
      const tokenContracts = Object.keys(tokenAddresses).map(
        (token) => new Contract(tokenAddresses[token], ERC20ABI, provider)
      );

      const testCDEProvider = new ethers.JsonRpcProvider(sepolia_rpc_url);
      const testCDETokenContract = new Contract(
        TestCDEAddress,
        testCDETokenAbi.abi,
        testCDEProvider
      );

      // wallet address balance
      const walletbalances = await Promise.all(
        tokenContracts.map((contract) => contract.balanceOf(address))
      );

      // console.log("walletbalances--------------", walletbalances);

      const formattedWalletBalances = walletbalances.map((balance, idx) => ({
        name: tokenDetails[tokenAddresses[Object.keys(tokenAddresses)[idx]]]
          .name,
        symbol:
          tokenDetails[tokenAddresses[Object.keys(tokenAddresses)[idx]]].symbol,
        balance: Number(Web3.utils.fromWei(balance, "ether")).toFixed(4),
      }));

      // vanity address balance
      const vanitybalances = await Promise.all(
        tokenContracts.map((contract) => contract.balanceOf(vanityAddress))
      );

      // console.log("vanitybalances---------", vanitybalances);

      const formattedVanityBalances = vanitybalances.map((balance, idx) => ({
        name: tokenDetails[tokenAddresses[Object.keys(tokenAddresses)[idx]]]
          .name,
        symbol:
          tokenDetails[tokenAddresses[Object.keys(tokenAddresses)[idx]]].symbol,
        balance: Number(Web3.utils.fromWei(balance, "ether")).toFixed(4),
      }));

      // test CDE address balance
      const testCDETokenBalance = await testCDETokenContract.balanceOf(
        vanityAddress
      );
      // console.log("testCDETokenBalance------------", testCDETokenBalance);
      const formattedTestCDEBalance = Number(
        Web3.utils.fromWei(testCDETokenBalance, "wei")
      ).toFixed(4);

      setBalances({
        wallet: formattedWalletBalances,
        vanity: formattedVanityBalances,
      });
      setTestCDEBalance(Number(formattedTestCDEBalance));
    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  }, [isConnected, address, vanityAddress]);

  // Fetch NFTs from all chains using moralis
  const fetchNFTs = useCallback(async () => {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({ apiKey: api_key });
      }
      // const testWalletAddressNFT = "0x4f59CE7bb4777b536F09116b66C95A5d1Ea8a8E6";
      const testWalletAddressNFT = "0x796B6E8F542B9AF20Ec8dd2095a2F6DEb5a0E6eD";
      // const testWalletAddressNFT = "0x3f88C36C69199FAa7298815a4e8aa7119d089448"; // sepolia
      // const testWalletAddressNFT = "0xf8b02EE855D5136ed1D782fC0a53a0CDdA65c946"; // sepolia
      // const testWalletAddressNFT = "0x7049577ABAea053257Bf235bFDCa57036Aed6AdD"; // sepolia
      // const testWalletAddressNFT = "0x7049577ABAea053257Bf235bFDCa57036Aed6AdD"; // polygon amoy
      const chains = [
        { chain: "0x1", name: "Ethereum" },
        { chain: "0x89", name: "Polygon" },
        { chain: "0xa4b1", name: "Arbitrum" },
        { chain: "0xaa36a7", name: "Sepolia" },
        { chain: "0x13882", name: "Polygon Amoy" },
      ];

      const nftPromises = chains.map((chain) =>
        Moralis.EvmApi.nft
          .getWalletNFTs({
            chain: chain.chain,
            format: "decimal",
            mediaItems: true,
            normalizeMetadata: true,
            limit: 5,
            address: testWalletAddressNFT,
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
            }))
          )
      );

      const combinedNFTs = (await Promise.all(nftPromises)).flat();
      setNFTdata(combinedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, []);

  useEffect(() => {
    // fetch the Account Persona socket NFT
    const fetchAccountPersonaNFT = async () => {
      if (isConnected && vanityAddress) {
        const response = await getSocketNFTLastTransferDetails(vanityAddress);
        if (response !== null) {
          setsocketNFTImageURL(response.imageUrl);
          setsocketNFTImageMediaType(response.mediaType);
        } else {
          console.error(Response);
        }
      } else {
        setsocketNFTImageURL(null);
        setsocketNFTImageMediaType(null);
      }
    };
    fetchTokenBalance();
    fetchNFTs();
    fetchAccountPersonaNFT();
  }, [
    address,
    isConnected,
    vanityAddress,
    fetchTokenBalance,
    fetchNFTs,
    testCDEBalance,
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

  return (
    <>
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
          <div className="flex flex-col mt-2 gap-4 sm:items-center md:items-start">
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
              Endorsee Quest Form
            </Link>
            <Link
              to="/jotform2"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Jotform 2
            </Link>
            <Link
              to="/jotform2"
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
              Wrap or purchase your CDE for a discount off the market price!
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
              Edit Persona Socket NFT
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

            {balances.wallet.map((token: any, idx: number) => (
              <div
                key={idx}
                className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
              >
                <span className="text-[#5692D9] mr-2 flex gap-1">
                  <p>{token.name}</p> <p>Token Balance:</p>
                </span>{" "}
                <span>
                  {token.balance} {token.symbol}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="md:mb-0 lg:mb-2 flex flex-col">
              <span className="md:text-sm lg:text-md font-sans text-blue-400 font-bold flex gap-3  sm:justify-center md:justify-start">
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
                <Tooltip title="CDE" arrow>
                  <a
                    href={`/#`}
                    // target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5692D9] mt-1 cursor-pointer"
                    data-tip="CDE"
                  >
                    <img src="/CDE.svg" className="h-4 w-auto" alt="CDE" />
                  </a>
                </Tooltip>
              </span>
              <hr className="sm:border-dotted sm:border-t sm:border-gray-600 sm:w-full sm:my-1 sm:m-auto md:w-full md:my-2" />
            </div>

            {balances.vanity.map((token: any, idx: number) => (
              <div
                key={idx}
                className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
              >
                <span className="text-[#5692D9] mr-2 flex gap-1">
                  <p>{token.name}</p> <p>Token Balance:</p>
                </span>{" "}
                <span>
                  {token.balance} {token.symbol}
                </span>
              </div>
            ))}
            <div className="md:text-sm lg:text-md text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1">
              <span className="text-[#5692D9] mr-2">
                Test CDE Token Balance:
              </span>{" "}
              <span>{testCDEBalance} TCDE</span>
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
            className="flex gap-3 items-center justify-center sm:w-full md:w-52 lg:w-56 xl:w-60 rounded-3xl bg-blue-400 p-2.5 text-white hover:text-blue-900 cursor-pointer"
          >
            <FiArrowLeftCircle className="text-2xl mt-1" />
            <span className="flex gap-2 items-center">
              <p className="mt-1">Shop</p>
              <GiBiceps className="text-xl" />
            </span>
          </Link>
        </div>
        {/* meeting room */}
        <div className="flex-1 min-w-0 flex justify-end">
          <div
            className="flex gap-2 sm:mr-0 md:mr-2 items-end justify-center sm:w-full md:w-52 lg:w-56 xl:w-60 rounded-3xl bg-blue-400 p-2.5 text-white hover:text-blue-900 cursor-pointer"
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

      {/* NFT cards */}
      <div className="mt-3">
        <NftCard NFTDetails={NFTdata} />
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
