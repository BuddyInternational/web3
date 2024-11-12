import React,{useEffect,useState} from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import ShopeNftcard from "../components/homeComponents/card/ShopeNftcard";
import { NFTDetails } from "../utils/Types";

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

interface OpenSeaCollectionResponse {
  nfts: NFT[];
}

const ApiKey: string | undefined= process.env.REACT_APP_OPENSEA_API_KEY|| "";
const Shop = () => {
  // Nft static data 
  const NFTdata1: NFTDetails[] = [
    {
      chainName: "Ethereum",
      contractAddress: "0xABC123456789DEF",
      tokenId: "1",
      name: "CryptoKitty #1",
      tokenType: "ERC721",
      tokenUri: "https://example.com/api/nft/1",
      imageUrl: "https://contenthub-static.crypto.com/cdn-cgi/image/width=800,quality=75/wp_media/2023/08/TOP-10-NFT-TOKENS-TO-KNOW-IN-2023-.jpg",  // Replace with actual NFT image URL
      mediaType: "image",
      timeLastUpdated: "2023-09-28T10:00:00Z",
      floorPrice: 2.5,
      floorPriceUsd: 5000,
      priceCurrency: "",
      lastclaimedAt: new Date("2023-10-01T12:30:00Z"),
      totalClaimedRewardCount: 5,
      totalClaimedRewardHash: [
        "0xhash1",
        "0xhash2",
        "0xhash3",
        "0xhash4",
        "0xhash5"
      ],
    },
    {
      chainName: "Ethereum",
      contractAddress: "0xDEF123456789ABC",
      tokenId: "2",
      name: "CryptoKitty #2",
      tokenType: "ERC721",
      tokenUri: "https://example.com/api/nft/2",
      imageUrl: "https://i.seadn.io/s/raw/files/87ed0dd90f7f6be4aba2bcdc86a6fcb7.png?auto=format&dpr=1&w=1000",  // Replace with actual NFT image URL
      mediaType: "image",
      timeLastUpdated: "2023-09-28T10:30:00Z",
      floorPrice: 3.0,
      floorPriceUsd: 6000,
      priceCurrency: "",
      lastclaimedAt: new Date("2023-10-02T14:00:00Z"),
      totalClaimedRewardCount: 3,
      totalClaimedRewardHash: [
        "0xhash6",
        "0xhash7",
        "0xhash8"
      ],
    },
    {
      chainName: "Ethereum",
      contractAddress: "0x123456789DEFABC",
      tokenId: "3",
      name: "CryptoKitty #3",
      tokenType: "ERC721",
      tokenUri: "https://example.com/api/nft/3",
      imageUrl: "https://preview.redd.it/rbx-network-mint-and-sell-your-nfts-p2p-validate-on-core-v0-482saok8g1gc1.jpeg?width=640&crop=smart&auto=webp&s=6ec4f3850d55becfe8287b424913bb95f63d6a98",  // Replace with actual NFT image URL
      mediaType: "image",
      timeLastUpdated: "2023-09-28T11:00:00Z",
      floorPrice: 1.8,
      floorPriceUsd: 3600,
      priceCurrency: "",
      lastclaimedAt: new Date("2023-10-03T16:00:00Z"),
      totalClaimedRewardCount: 4,
      totalClaimedRewardHash: [
        "0xhash9",
        "0xhash10",
        "0xhash11",
        "0xhash12"
      ],
    },
    {
      chainName: "Ethereum",
      contractAddress: "0x123456789DEFABC",
      tokenId: "4",
      name: "CryptoKitty #4",
      tokenType: "ERC721",
      tokenUri: "https://example.com/api/nft/3",
      imageUrl: "https://preview.redd.it/rbx-network-mint-and-sell-your-nfts-p2p-validate-on-core-v0-482saok8g1gc1.jpeg?width=640&crop=smart&auto=webp&s=6ec4f3850d55becfe8287b424913bb95f63d6a98",  // Replace with actual NFT image URL
      mediaType: "image",
      timeLastUpdated: "2023-09-28T11:00:00Z",
      floorPrice: 1.8,
      floorPriceUsd: 3600,
      priceCurrency: "",
      lastclaimedAt: new Date("2023-10-03T16:00:00Z"),
      totalClaimedRewardCount: 4,
      totalClaimedRewardHash: [
        "0xhash9",
        "0xhash10",
        "0xhash11",
        "0xhash12"
      ],
    },
    {
      chainName: "Ethereum",
      contractAddress: "0x123456789DEFABC",
      tokenId: "5",
      name: "CryptoKitty #5",
      tokenType: "ERC721",
      tokenUri: "https://example.com/api/nft/3",
      imageUrl: "https://preview.redd.it/rbx-network-mint-and-sell-your-nfts-p2p-validate-on-core-v0-482saok8g1gc1.jpeg?width=640&crop=smart&auto=webp&s=6ec4f3850d55becfe8287b424913bb95f63d6a98",  // Replace with actual NFT image URL
      mediaType: "image",
      timeLastUpdated: "2023-09-28T11:00:00Z",
      floorPrice: 1.8,
      floorPriceUsd: 3600,
      priceCurrency: "",
      lastclaimedAt: new Date("2023-10-03T16:00:00Z"),
      totalClaimedRewardCount: 4,
      totalClaimedRewardHash: [
        "0xhash9",
        "0xhash10",
        "0xhash11",
        "0xhash12"
      ],
    },
  ];
  const [NFTdata, setNFTdata] = useState<NFTDetails[]>([]);

  // fetch Nft data
  useEffect(() => {
    const fetchNFTs = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": `${ApiKey}`,
        },
      };

      try {
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
          totalClaimedRewardHash: nft.claim_hashes || [],
        }));
        console.log(formattedNFTs);

        setNFTdata(formattedNFTs);
      } catch (err) {
        console.error("Error fetching NFT data from OpenSea:", err);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
      <Link to="/" className="text-blue-500 hover:underline flex items-center mb-4">
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>

      <div className="mt-3">
        <h1 className="text-3xl text-white text-center font-bold mb-4">NFT Marketplace</h1>
        <ShopeNftcard NFTDetails={NFTdata} CardType="BuyNft" />
      </div>
    </div>
  );
};

export default Shop;

