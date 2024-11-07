import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the NFT type
interface NFT {
  chainName: string;
  contractAddress: string;
  tokenId: string;
  name: string;
  tokenType: string;
  tokenUri: string;
  imageUrl: string;
  mediaType: string;
  timeLastUpdated: string;
  floorPrice: number;
  floorPriceUsd: number;
  priceCurrency: string;
  lastclaimedAt: Date;
  totalClaimedRewardCount: number;
  totalClaimedRewardHash: string[];
}

// Define the context type, which could be either an array of NFTs or undefined initially
interface NFTContextType {
  nfts: NFT[];
}

// Create the NFT context with default value as an empty array
const NFTContext = createContext<NFTContextType>({ nfts: [] });

// Custom hook to use NFTContext
export function useNFTs() {
  return useContext(NFTContext);
}

// NFT Provider component
interface NFTProviderProps {
  children: ReactNode;
}

export function NFTProvider({ children }: NFTProviderProps) {
  const [nfts, setNFTs] = useState<NFT[]>([]);

  useEffect(() => {
    async function fetchNFTs() {
      const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'x-api-key': '4ba444656d66435a9423b7851f76237c'
        }
      };

      try {
        const response = await fetch('https://api.opensea.io/api/v2/collection/courtyard-nft/nfts?limit=2', options);
        const data = await response.json();
        const formattedNFTs = data.nfts.map((nft: any) => formatNFTData(nft));
        setNFTs(formattedNFTs);
      } catch (error) {
        console.error("Error fetching NFT data from OpenSea:", error);
        setNFTs([]);
      }
    }

    fetchNFTs();
  }, []);

  return <NFTContext.Provider value={{ nfts }}>{children}</NFTContext.Provider>;
}

// Helper function to format NFT data into NFT type
function formatNFTData(nft: any): NFT {
  return {
    chainName: nft.asset_contract?.chain || "Unknown Chain",
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
    totalClaimedRewardHash: nft.claim_hashes || []
  };
}
