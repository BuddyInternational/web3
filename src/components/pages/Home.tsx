import React, { useEffect, useState, useRef } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import NftCard from "../cards/NftCard";
import { NFTData } from "../../utils/Types";
import { ERC20ABI } from "../../utils/ABI";
import Moralis from "moralis";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ethers, Contract } from "ethers";
import Web3 from "web3";
import TermsModel from "../modals/TermsModal";

// Token address
const token1Address: any = process.env.REACT_APP_TOKEN1_ADDRESS;
const token2Address: any = process.env.REACT_APP_TOKEN2_ADDRESS;
const token3Address: any = process.env.REACT_APP_TOKEN3_ADDRESS;

// API KEY
const api_key: any = process.env.REACT_APP_MORALIS_NFT_API;
const rpc_url: any = process.env.REACT_APP_RPC_URL;

// Another links
const sponsorshipURL: any = process.env.REACT_APP_SPONSORSHIP_LINK;
const purchaseTokenURL: any = process.env.REACT_APP_PURCHASE_TOKEN_LINK;
const leadershipURL: any = process.env.REACT_APP_LEADERSHIP_LINK;

const Home = () => {
  const { address } = useWeb3ModalAccount();
  const [token1Balance, setToken1Balance] = useState(0);
  const [token2Balance, setToken2Balance] = useState(0);
  const [token3Balance, setToken3Balance] = useState(0);
  const [NFTdata, setNFTdata] = useState<NFTData[]>([]);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const copyAddressTimeoutRef: any = useRef(null);
  const [openTermsModal, setOpenTermsModal] = useState(false);

  // Handle termsModal
  const handleClickOpenTermsModal = () => {
    setOpenTermsModal(true);
  };

  const handleCloseTermsModal = () => {
    setOpenTermsModal(false);
  };

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

  // Fetch connected user token balance
  const fetchTokenBalance = async () => {
    try {
      if (address) {
        const testAddress = "0xFaba74f2e5557323487e337A5f93BbfaEef00310";
        const provider = new ethers.JsonRpcProvider(rpc_url);
        const token1Contract = new Contract(token1Address, ERC20ABI, provider);
        const token2Contract = new Contract(token2Address, ERC20ABI, provider);
        const token3Contract = new Contract(token3Address, ERC20ABI, provider);

        const [token1Bal, token2Bal, token3Bal] = await Promise.all([
          token1Contract.balanceOf(testAddress),
          token2Contract.balanceOf(testAddress),
          token3Contract.balanceOf(testAddress),
        ]);

        const formattedToken1Bal = Number(
          Web3.utils.fromWei(token1Bal, "ether")
        ).toFixed(4);
        const formattedToken2Bal = Number(
          Web3.utils.fromWei(token2Bal, "ether")
        ).toFixed(4);
        const formattedToken3Bal = Number(
          Web3.utils.fromWei(token3Bal, "ether")
        ).toFixed(4);

        setToken1Balance(Number(formattedToken1Bal));
        setToken2Balance(Number(formattedToken2Bal));
        setToken3Balance(Number(formattedToken3Bal));
      } else {
        console.log("No wallet connected");
        setToken1Balance(0);
        setToken2Balance(0);
        setToken3Balance(0);
      }
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setToken1Balance(0);
      setToken2Balance(0);
      setToken3Balance(0);
    }
  };

  // Fetch NFTs from all chains using moralis
  const fetchNFTs = async () => {
    try {
      if (!Moralis.Core.isStarted) {
        // Check if Moralis is already started
        await Moralis.start({
          apiKey: api_key,
        });
      }
      // 0xFaba74f2e5557323487e337A5f93BbfaEef00310
      const testWalletAddress: string =
        "0x4f59CE7bb4777b536F09116b66C95A5d1Ea8a8E6";
      const [ethereumNFTs, polygonNFTs, arbitrumNFTs] = await Promise.all([
        Moralis.EvmApi.nft.getWalletNFTs({
          chain: "0x1", // Ethereum
          format: "decimal",
          mediaItems: true,
          normalizeMetadata: true,
          limit: 5,
          address: testWalletAddress,
        }),
        Moralis.EvmApi.nft.getWalletNFTs({
          chain: "0x89", // Polygon
          format: "decimal",
          mediaItems: true,
          normalizeMetadata: true,
          limit: 5,
          address: testWalletAddress,
        }),
        Moralis.EvmApi.nft.getWalletNFTs({
          chain: "0xa4b1", // Arbitrum
          format: "decimal",
          mediaItems: true,
          normalizeMetadata: true,
          limit: 5,
          address: testWalletAddress,
        }),
      ]);

      const combinedNFTs: NFTData[] = [
        ...ethereumNFTs.raw.result.map((nft: any) => ({
          chainName: "Ethereum",
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
          priceCurrency: nft?.floor_price_currency,
        })),
        ...polygonNFTs.raw.result.map((nft: any) => ({
          chainName: "Polygon",
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
          priceCurrency: nft?.floor_price_currency,
        })),
        ...arbitrumNFTs.raw.result.map((nft: any) => ({
          chainName: "Arbitrum",
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
          priceCurrency: nft?.floor_price_currency,
        })),
      ];

      setNFTdata(combinedNFTs);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };

  useEffect(() => {
    fetchTokenBalance();
    fetchNFTs();
  }, [address]);

  return (
    <>
      <div className="container m-auto flex justify-between mt-2 flex-col md:flex-row gap-3">
        {/* Start section */}
        <div className="flex flex-col gap-8 justify-start ml-4 w-full md:w-1/4 sm:text-center md:text-left sm:ml-0 md:ml-4">
          {/* connected address */}
          <div className="flex gap-2 sm:m-auto md:m-0 sm:flex-col 2xl:flex-row items-center">
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
          {/* Terms of use */}
          <div className="">
            <button
              className="border-2 border-[#5682D980] p-0 flex-shrink sm:p-1 md:p-2 text-sm font-sans text-white rounded-md hover:bg-neutral-400 hover:text-blue-800 sm:w-44 md:w-fit"
              onClick={handleClickOpenTermsModal}
            >
              Gully Buddies Membership Rewards!!!! [Update]
            </button>
          </div>
          {/* divider */}
          <div>
            <hr className="sm:border-t sm:border-gray-600 sm:w-11/12 sm:m-auto sm:my-3 md:border-t-0 md:w-0 md:my-0 md:m-0" />
          </div>
        </div>

        {/* middle section */}
        {/* Links */}
        <div className="flex flex-col text-white text-sm gap-3 justify-center items-center m-auto w-full md:w-1/2">
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

        {/* Last section */}
        {/* Total valuation */}
        <div className="flex flex-col gap-5 text-sm font-normal font-sans w-full md:w-1/4 sm:text-center md:text-left">
          <div className="text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1">
            <span className="text-blue-400 mr-2">Total Value :</span>{" "}
            <span className="text-left">{calculateTotalNFTValue()} USD </span>
          </div>
          <div className="text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1 ">
            <span className="text-blue-400 mr-2">CDE1 Token Balance :</span>{" "}
            <span>{token1Balance} CDE </span>
          </div>
          <div className="text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1">
            <span className="text-blue-400 mr-2">CDE2 Token Balance :</span>{" "}
            <span>{token2Balance} CDE </span>
          </div>
          <div className="text-white flex sm:m-auto md:m-0 sm:flex-col 2xl:flex-row gap-1">
            <span className="text-blue-400 mr-2">TIM Token Balance :</span>{" "}
            <span>{token3Balance} TIM</span>
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
          <TermsModel open={openTermsModal} onClose={handleCloseTermsModal} />
        </>
      )}
    </>
  );
};

export default Home;
