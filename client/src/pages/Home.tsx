import React, { useCallback, useEffect, useState } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Moralis from "moralis";
import { Link } from "react-router-dom";
import { ethers, Contract } from "ethers";
import Web3 from "web3";
import { NFTData } from "../utils/Types";
import { ERC20ABI } from "../utils/ABI";
import NftCard from "../components/homeComponents/cards/NftCard";
import TermsModel from "../components/homeComponents/modals/TermsModal";
import CDEReward from "../components/homeComponents/modals/CDEReward";
import { useVanityContext } from "../context/VanityContext";

// Constant Token address
const tokenAddresses: any = {
  CDE1: process.env.REACT_APP_TOKEN1_ADDRESS,
  CDE2: process.env.REACT_APP_TOKEN2_ADDRESS,
  TIM: process.env.REACT_APP_TOKEN3_ADDRESS,
};

// API KEY
const api_key: any = process.env.REACT_APP_MORALIS_NFT_API;
const rpc_url: any = process.env.REACT_APP_RPC_URL;

// Another links
const sponsorshipURL: any = process.env.REACT_APP_SPONSORSHIP_LINK;
const purchaseTokenURL: any = process.env.REACT_APP_PURCHASE_TOKEN_LINK;
const leadershipURL: any = process.env.REACT_APP_LEADERSHIP_LINK;

const testWalletAddress: string = "0xFaba74f2e5557323487e337A5f93BbfaEef00310";
const testVanityAddress: string = "0x273a6fa0cA05601b4703Cb6C1C500594e44C5CDE";

const Home = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const [balances, setBalances] = useState<any>({
    wallet: { CDE1: 0, CDE2: 0, TIM: 0 },
    vanity: { CDE1: 0, CDE2: 0, TIM: 0 },
  });
  const [NFTdata, setNFTdata] = useState<NFTData[]>([]);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const [openCDERewardModal, setOpenCDERewardModal] = useState(false);
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
          wallet: { CDE1: 0, CDE2: 0, TIM: 0 },
          vanity: { CDE1: 0, CDE2: 0, TIM: 0 },
        });
        return;
      }

      const provider = new ethers.JsonRpcProvider(rpc_url);
      const tokenContracts = Object.keys(tokenAddresses).map(
        (token) => new Contract(tokenAddresses[token], ERC20ABI, provider)
      );

      // wallet address balance
      const walletbalances = await Promise.all(
        tokenContracts.map((contract) => contract.balanceOf(testWalletAddress))
      );

      const formattedWalletBalances = walletbalances.map((balance) =>
        Number(Web3.utils.fromWei(balance, "ether")).toFixed(4)
      );

      // vanity address balance
      const vanitybalances = await Promise.all(
        tokenContracts.map((contract) => contract.balanceOf(vanityAddress))
      );

      const formattedVanityBalances = vanitybalances.map((balance) =>
        Number(Web3.utils.fromWei(balance, "ether")).toFixed(4)
      );

      setBalances({
        wallet: {
          CDE1: Number(formattedWalletBalances[0]),
          CDE2: Number(formattedWalletBalances[1]),
          TIM: Number(formattedWalletBalances[2]),
        },
        vanity: {
          CDE1: Number(formattedVanityBalances[0]),
          CDE2: Number(formattedVanityBalances[1]),
          TIM: Number(formattedVanityBalances[2]),
        },
      });

    } catch (error) {
      console.error("Error fetching token balances:", error);
    }
  }, [address, vanityAddress]);

  // Fetch NFTs from all chains using moralis
  const fetchNFTs = useCallback(async () => {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({ apiKey: api_key });
      }
      const testWalletAddressNFT = "0x4f59CE7bb4777b536F09116b66C95A5d1Ea8a8E6";
      const chains = [
        { chain: "0x1", name: "Ethereum" },
        { chain: "0x89", name: "Polygon" },
        { chain: "0xa4b1", name: "Arbitrum" },
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
    fetchTokenBalance();
    fetchNFTs();
  }, [address, vanityAddress]);

  return (
    <>
      <div className="container m-auto flex justify-between mt-2 flex-col md:flex-row gap-3">
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
              Account Persona: [Default]
            </p>
            <img
              src="/accountPersona.png"
              alt="Account Persona image"
              className="md:w-30 sm:w-48 h-auto rounded-md"
            />
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
              to="/#"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Sponsorship/Endorsements
            </Link>
            <Link
              to="/#"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Purchase Token
            </Link>
            <Link
              to="/#"
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Leadership/Ranking
            </Link>
            <Link
              to="/#"
              className="hover:text-[#5692D9] cursor-pointer underline"
              onClick={handleOpenModal(setOpenCDERewardModal)}
            >
              Click Here To Wrap CDE For Rewards (version 1.1)
            </Link>
            <Link
              to={`/quest/completed/${address}`}
              className="hover:text-[#5692D9] cursor-pointer underline"
            >
              Get Your Endorsee Quest Response
            </Link>
            {/* divider */}
            <div>
              <hr className="sm:border-t sm:border-gray-600 sm:w-11/12 sm:my-4 md:border-t-0 md:w-0 md:my-0 md:m-0" />
            </div>
          </div>
        </div>

        {/* Last section : Total valuation */}
        <div className="flex flex-col gap-4 text-md font-normal w-full md:w-1/4 sm:text-center md:text-left">
          <div className="text-white flex gap-1">
            <span className="text-blue-400 mr-2">Total Value :</span>{" "}
            <span>{calculateTotalNFTValue()} USD</span>
          </div>
          <div className="flex flex-col gap-2">
            <div className="lg:m-0 xl:m-auto mb-2 flex flex-col">
              <span className="text-md font-sans text-blue-400 font-bold">
                Wallet Address Balance
              </span>
              <hr className="sm:border-dotted sm:border-t sm:border-gray-600 sm:w-1/2 sm:m-auto md:w-full md:my-2" />
            </div>
            {Object.keys(balances.wallet).map((token, idx) => (
              <div
                key={idx}
                className="text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
              >
                <span className="text-[#5692D9] mr-2">
                  {token} Token Balance:
                </span>{" "}
                <span>
                  {balances.wallet[token]} {token}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 mt-2">
            <div className="lg:m-0 xl:m-auto mb-2 flex flex-col">
              <span className="text-md font-sans text-blue-400 font-bold">
                Vanity Address Balance
              </span>
              <hr className="sm:border-dotted sm:border-t sm:border-gray-600 sm:w-1/2 sm:m-auto md:w-full md:my-2" />
            </div>
            {Object.keys(balances.vanity).map((token, idx) => (
              <div
                key={idx}
                className="text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1"
              >
                <span className="text-[#5692D9] mr-2">
                  {token} Token Balance:
                </span>{" "}
                <span>
                  {balances.vanity[token]} {token}
                </span>
              </div>
            ))}
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
    </>
  );
};

export default Home;