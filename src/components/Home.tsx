import React, { useEffect, useState, useRef } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import NftCard from "./NftCard";
import { NFTData } from "../utils/Types";
import { ERC20ABI } from "../utils/ABI";
import Moralis from "moralis";
import { FaCopy, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import {ethers,Contract} from "ethers";
import Web3 from "web3";

// Token address
const token1Address:any = process.env.REACT_APP_TOKEN1_ADDRESS;
const token2Address:any = process.env.REACT_APP_TOKEN2_ADDRESS;

// API KEY
const api_key: any = process.env.REACT_APP_NFT_API_KEY;

// Another links
const sponsorshipURL: any = process.env.REACT_APP_SPONSORSHIP_LINK;
const purchaseTokenURL: any = process.env.REACT_APP_PURCHASE_TOKEN_LINK;
const leadershipURL:any = process.env.REACT_APP_LEADERSHIP_LINK;

const Home = () => {
  const { address } = useWeb3ModalAccount();
  const [token1Balance, setToken1Balance] = useState(0);
  const [token2Balance, setToken2Balance] = useState(0);
  const [NFTdata, setNFTdata] = useState<NFTData[]>([]);
  const [isAddressCopied, setIsAddressCopied] = useState(false);
  const copyAddressTimeoutRef: any = useRef(null);

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

  // fetch connected user token balance
  const fetchTokenBalance = async () => {
    try {
      if (address) {
        const testAddress = '0xFaba74f2e5557323487e337A5f93BbfaEef00310'
        const provider = ethers.getDefaultProvider();
        const token1Contract = new Contract(token1Address, ERC20ABI, provider);
        const token2Contract = new Contract(token2Address, ERC20ABI, provider);

        const [token1Bal, token2Bal] = await Promise.all([
          token1Contract.balanceOf(testAddress),
          token2Contract.balanceOf(testAddress),
        ]);

        const formattedToken1Bal = Number(Web3.utils.fromWei(token1Bal, "ether")).toFixed(4);
        const formattedToken2Bal = Number(Web3.utils.fromWei(token2Bal, "ether")).toFixed(4);

        setToken1Balance(Number(formattedToken1Bal));
        setToken2Balance(Number(formattedToken2Bal));
      } else {
        console.log("No wallet connected");
      setToken1Balance(0);
      setToken2Balance(0);
      }
    } catch (error) {
      console.error("Error fetching token balances:", error);
      setToken1Balance(0);
      setToken2Balance(0);
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

      // console.log(
      //   "ethereumNFTs Details ------------------",
      //   ethereumNFTs.raw.result
      // );
      // console.log(
      //   "polygonNFTs Details -----------------",
      //   polygonNFTs.raw.result
      // );
      // console.log(
      //   "arbitrumNFTs Details --------------",
      //   arbitrumNFTs.raw.result
      // );

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
    // fetchNFTs();
  }, [address,token1Balance,token2Balance]);

  // console.log("All nft Details------------", NFTdata);

  return (
    <>
      <div className="flex justify-between mt-2">
        {/* connected address */}
        <div className="flex gap-3 ml-2">
          <p className="text-white">
            Connected Address : {address?.slice(0, 6)}... {address?.slice(-4)}
          </p>
          {isAddressCopied ? (
            <FaCheck className="mt-0.5 text-green-500 cursor-pointer" />
          ) : (
            <FaCopy
              onClick={() => {
                navigator.clipboard.writeText(address || "");
                setIsAddressCopied(true);
                clearTimeout(copyAddressTimeoutRef.current);
                copyAddressTimeoutRef.current = setTimeout(() => {
                  setIsAddressCopied(false);
                }, 1000);
              }}
              className="text-white mt-1"
              data-tip="Copy Wallet Address"
              data-tip-content=".tooltip"
            />
          )}
        </div>
        {/* Links */}
        <div className="flex flex-col text-white text-center text-sm underline gap-2 mt-2">
          <Link to="/jotform1" className="hover:text-blue-700 cursor-pointer" >Jotform 1</Link>
          <Link to="/jotform2" className="hover:text-blue-700 cursor-pointer">Jotform 2</Link>
          <Link to="/#" className="hover:text-blue-700 cursor-pointer">Sponsorship/Endoring</Link>
          <Link to="/#" className="hover:text-blue-700 cursor-pointer">Purchase Token</Link>
          <Link to="/#"  className="hover:text-blue-700 cursor-pointer">Leadership/Ranking</Link>
          
        </div>
        {/* Total valuation */}
        <div className="flex flex-col gap-1">
          <p className="text-white">
            Total Value : {calculateTotalNFTValue()} USD
          </p>
          <p className="text-white">CDE1 Token Balance : {token1Balance} CDE</p>
          <p className="text-white">CDE2 Token Balance : {token2Balance} CDE</p>
        </div>
      </div>
      <NftCard NFTDetails={NFTdata} />
    </>
  );
};

export default Home;
