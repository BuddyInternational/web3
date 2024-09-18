import React, { useEffect, useState } from "react";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Alchemy, Network } from "alchemy-sdk";
import NftCard from "./NftCard";
import { NFTData } from "../utils/Types";

// API KEY
const api_key: any = process.env.REACT_APP_NFT_API_KEY;

const Home = () => {
  const { address } = useWeb3ModalAccount();
  const [NFTdata, setNFTdata] = useState<NFTData[]>([]);


  // fetch Ethereum NFT's
  const fetchEthereumNFTs = async () => {
    const settings = {
      apiKey: api_key,
      network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(settings);
    console.log("fetching NFTs for address:", address);

    // if (address !== undefined) {
    const nftsForOwner = await alchemy.nft.getNftsForOwner(
      // address
      "0xD6468d57646e73aF0f6485216B9a851c94Ae01D6",
      { pageSize: 2 }
    );

    const nftDetails: NFTData[] = [];

    for (const nft of nftsForOwner?.ownedNfts) {
      const metadata = await alchemy.nft.getNftMetadata(
        nft.contract.address,
        nft.tokenId
      );

      const floorPriceDetails: any = await alchemy.nft.getFloorPrice(
        nft.contract.address
      );

      // Extract relevant NFT data
      const nftItem: NFTData = {
        chainName: "Ethereum",
        contractAddress: nft?.contract?.address,
        tokenId: nft?.tokenId,
        name: metadata?.name,
        description: metadata?.description,
        tokenType: nft?.tokenType,
        tokenUri: nft?.tokenUri,
        imageUrl: nft?.image?.originalUrl,
        timeLastUpdated: metadata?.timeLastUpdated,
        floorPrices: floorPriceDetails,
      };

      nftDetails.push(nftItem);
      //   }

      setNFTdata(nftDetails);
    }
  };

  // fetch Polygon NFT's
  const fetchPolygonNFTs = async () => {
    const settings = {
      apiKey: api_key,
      network: Network.MATIC_MAINNET,
    };
    const alchemy = new Alchemy(settings);
    console.log("fetching NFTs for address:", address);

    // if (address !== undefined) {
    const nftsForOwner = await alchemy.nft.getNftsForOwner(
      // address
      "0x3Dc8AA949a7e92E765399A83ea2279351E951f18",
      { pageSize: 2 }
    );

    const nftDetails: NFTData[] = [];

    for (const nft of nftsForOwner?.ownedNfts) {
      const metadata = await alchemy.nft.getNftMetadata(
        nft.contract.address,
        nft.tokenId
      );

      // const floorPriceDetails : any  = await alchemy.nft.getFloorPrice(nft.contract.address);

      // Extract relevant NFT data
      const nftItem: NFTData = {
        chainName: "Polygon",
        contractAddress: nft?.contract?.address,
        tokenId: nft?.tokenId,
        name: metadata?.name,
        description: metadata?.description,
        tokenType: nft?.tokenType,
        tokenUri: nft?.tokenUri,
        imageUrl: nft?.image?.originalUrl,
        timeLastUpdated: metadata?.timeLastUpdated,
        // floorPrices: floorPriceDetails,
      };

      nftDetails.push(nftItem);
      //   }

      setNFTdata(nftDetails);
    }
  };

  // fetch Arbitrum NFT's
  const fetchArbitrumNFTs = async () => {
    const settings = {
      apiKey: api_key,
      network: Network.ARB_MAINNET,
    };
    const alchemy = new Alchemy(settings);
    console.log("fetching NFTs for address:", address);

    // if (address !== undefined) {
    const nftsForOwner = await alchemy.nft.getNftsForOwner(
      // address
      "0xD6468d57646e73aF0f6485216B9a851c94Ae01D6",
      { pageSize: 2 }
    );

    const nftDetails: NFTData[] = [];

    for (const nft of nftsForOwner?.ownedNfts) {
      const metadata = await alchemy.nft.getNftMetadata(
        nft.contract.address,
        nft.tokenId
      );
      // const floorPriceDetails: any = await alchemy.nft.getFloorPrice(nft.contract.address);
      // Extract relevant NFT data
      const nftItem: NFTData = {
        chainName: "Arbitrum",
        contractAddress: nft?.contract?.address,
        tokenId: nft?.tokenId,
        name: metadata?.name,
        description: metadata?.description,
        tokenType: nft?.tokenType,
        tokenUri: nft?.tokenUri,
        imageUrl: nft?.image?.originalUrl,
        timeLastUpdated: metadata?.timeLastUpdated,
        // floorPrices: floorPriceDetails,
      };

      nftDetails.push(nftItem);
      //   }

      setNFTdata(nftDetails);
    }
  };

  useEffect(() => {
    fetchEthereumNFTs();
    // fetchPolygonNFTs();
    // fetchArbitrumNFTs();
  }, [address]);

  return (
    <div>
      <p className="text-white">Connected Address : {address}</p>
      <NftCard NFTDetails={NFTdata} />
    </div>
  );
};

export default Home;
