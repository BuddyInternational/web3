import React, { useEffect, useState } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
// import { Alchemy, Network } from "alchemy-sdk";
import NftCard from "./NftCard";
import { NFTData } from "../utils/Types";
import Moralis from "moralis";
import { FaCopy } from "react-icons/fa";

// API KEY
const api_key: any = process.env.REACT_APP_NFT_API_KEY;

const Home = () => {
  const { address } = useWeb3ModalAccount();
  const [NFTdata, setNFTdata] = useState<NFTData[]>([]);

  // // fetch Ethereum NFT's Alchamy
  // const fetchEthereumNFTs = async () => {
  //   try {
  //     const settings = {
  //       apiKey: api_key,
  //       network: Network.ETH_MAINNET,
  //     };
  //     const alchemy = new Alchemy(settings);
  //     console.log("fetching NFTs for address:", address);

  //     // if (address !== undefined) {
  //     const nftsForOwner = await alchemy.nft.getNftsForOwner(
  //       // address
  //       "0xDB9849fD5979ba41EFfd4Dcd935dEe03FD0549Da",
  //       { pageSize: 2 }
  //     );

  //     const nftDetails: NFTData[] = [];

  //     for (const nft of nftsForOwner?.ownedNfts) {
  //       const metadata = await alchemy.nft.getNftMetadata(
  //         nft.contract.address,
  //         nft.tokenId
  //       );

  //       console.log("metadata ethereum-------------", metadata);
  //       const floorPriceDetails: any = await alchemy.nft.getFloorPrice(
  //         nft.contract.address
  //       );

  //       // Extract relevant NFT data
  //       const nftItem: NFTData = {
  //         chainName: "Ethereum",
  //         contractAddress: nft?.contract?.address,
  //         tokenId: nft?.tokenId,
  //         name: metadata?.name,
  //         description: metadata?.description,
  //         tokenType: nft?.tokenType,
  //         tokenUri: nft?.tokenUri,
  //         imageUrl: nft?.image?.originalUrl,
  //         timeLastUpdated: metadata?.timeLastUpdated,
  //         floorPrices: floorPriceDetails,
  //       };

  //       nftDetails.push(nftItem);
  //       //   }

  //       setNFTdata(nftDetails);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Ethereum NFTs:", error);
  //   }
  // };

  // // fetch Polygon NFT's Alchamy
  // const fetchPolygonNFTs = async () => {
  //   try {
  //     const settings = {
  //       apiKey: api_key,
  //       network: Network.MATIC_MAINNET,
  //     };
  //     const alchemy = new Alchemy(settings);
  //     console.log("fetching NFTs for address:", address);

  //     // if (address !== undefined) {
  //     const nftsForOwner = await alchemy.nft.getNftsForOwner(
  //       // address
  //       "0xDB9849fD5979ba41EFfd4Dcd935dEe03FD0549Da",
  //       { pageSize: 5 }
  //     );

  //     const nftDetails: NFTData[] = [];

  //     for (const nft of nftsForOwner?.ownedNfts) {
  //       const metadata = await alchemy.nft.getNftMetadata(
  //         nft.contract.address,
  //         nft.tokenId
  //       );

  //       console.log("metadata polygon------------", metadata);
  //       // const floorPriceDetails : any  = await alchemy.nft.getFloorPrice(nft.contract.address);

  //       // Extract relevant NFT data
  //       const nftItem: NFTData = {
  //         chainName: "Polygon",
  //         contractAddress: nft?.contract?.address,
  //         tokenId: nft?.tokenId,
  //         name: metadata?.name,
  //         description: metadata?.description,
  //         tokenType: nft?.tokenType,
  //         tokenUri: nft?.tokenUri,
  //         imageUrl: nft?.image?.originalUrl,
  //         timeLastUpdated: metadata?.timeLastUpdated,
  //         // floorPrices: floorPriceDetails,
  //       };

  //       nftDetails.push(nftItem);
  //       //   }

  //       setNFTdata(nftDetails);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching Polygon NFTs:", error);
  //   }
  // };

  // // fetch Arbitrum NFT's Alchamy
  // const fetchArbitrumNFTs = async () => {
  //   const settings = {
  //     apiKey: api_key,
  //     network: Network.ARB_MAINNET,
  //   };
  //   const alchemy = new Alchemy(settings);
  //   console.log("fetching NFTs for address:", address);

  //   // if (address !== undefined) {
  //   const nftsForOwner = await alchemy.nft.getNftsForOwner(
  //     // address
  //     "0xD6468d57646e73aF0f6485216B9a851c94Ae01D6",
  //     { pageSize: 2 }
  //   );

  //   const nftDetails: NFTData[] = [];

  //   for (const nft of nftsForOwner?.ownedNfts) {
  //     const metadata = await alchemy.nft.getNftMetadata(
  //       nft.contract.address,
  //       nft.tokenId
  //     );
  //     // const floorPriceDetails: any = await alchemy.nft.getFloorPrice(nft.contract.address);
  //     // Extract relevant NFT data
  //     const nftItem: NFTData = {
  //       chainName: "Arbitrum",
  //       contractAddress: nft?.contract?.address,
  //       tokenId: nft?.tokenId,
  //       name: metadata?.name,
  //       description: metadata?.description,
  //       tokenType: nft?.tokenType,
  //       tokenUri: nft?.tokenUri,
  //       imageUrl: nft?.image?.originalUrl,
  //       timeLastUpdated: metadata?.timeLastUpdated,
  //       // floorPrices: floorPriceDetails,
  //     };

  //     nftDetails.push(nftItem);
  //     //   }

  //     setNFTdata(nftDetails);
  //   }
  // };

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
        "0x4f59CE7bb4777b536F09116b66C95A5d1Ea8a8E6"; // 0xA02113a2ed51e82B05649709FbBD4232dc11244c
      const [ethereumNFTs, polygonNFTs, arbitrumNFTs] = await Promise.all([
        Moralis.EvmApi.nft.getWalletNFTs({
          chain: "0x1", // Ethereum
          format: "decimal",
          mediaItems: true,
          normalizeMetadata: true,
          limit: 10,
          address: testWalletAddress,
        }),
        Moralis.EvmApi.nft.getWalletNFTs({
          chain: "0x89", // Polygon
          format: "decimal",
          mediaItems: true,
          normalizeMetadata: true,
          limit: 10,
          address: testWalletAddress,
        }),
        Moralis.EvmApi.nft.getWalletNFTs({
          chain: "0xa4b1", // Arbitrum
          format: "decimal",
          mediaItems: true,
          normalizeMetadata: true,
          limit: 10,
          address: testWalletAddress,
        }),
      ]);

      console.log(
        "ethereumNFTs Details ------------------",
        ethereumNFTs.raw.result
      );
      console.log(
        "polygonNFTs Details -----------------",
        polygonNFTs.raw.result
      );
      console.log(
        "arbitrumNFTs Details --------------",
        arbitrumNFTs.raw.result
      );

      const combinedNFTs: NFTData[] = [
        ...ethereumNFTs.raw.result.map((nft: any) => ({
          chainName: "Ethereum",
          contractAddress: nft.token_address,
          tokenId: nft.token_id,
          name: nft.name,
          tokenType: nft.contract_type,
          tokenUri: nft.token_uri,
          imageUrl: nft.media?.original_media_url,
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
    // fetchEthereumNFTs();
    // fetchPolygonNFTs();
    // fetchArbitrumNFTs();
    fetchNFTs();
  }, [address]);

  console.log("All nft Details------------", NFTdata);

  return (
    <div>
      <div className="flex justify-between">
        <span className="flex gap-3">
          <p className="text-white">Connected Address : {address}</p>
          <FaCopy onClick= {() => { navigator.clipboard.writeText(address || "");}} className="text-white mt-1"/>
        </span>
        <p className="text-white">Total Value : {"300 USD"}</p>
      </div>
      <NftCard NFTDetails={NFTdata} />
    </div>
  );
};

export default Home;
