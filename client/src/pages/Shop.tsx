import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import NftCard from "../components/homeComponents/card/NftCard";
import { NFTDetails } from "../utils/Types";

const Shop = () => {
  const NFTdata: NFTDetails[] = [
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

  return (
    <div className="w-full  mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>

      {/* <div className="flex text-white text-center text-xl gap-2 flex-col">
        <h1 className="text-3xl font-bold mb-4">This Feature is Coming soon</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NFTdata.map((nft, index) => (
            <NftCard  NFTDetails={nft} CardType={"walletNFT1"} />
          ))}
          <NftCard  NFTDetails={NFTdata} CardType={"walletNFT1"} />
        </div>
      </div> */}

      <div className="mt-3">
        <h1 className="text-3xl text-white text-center font-bold mb-4"> NFT Marketplace</h1>
        <NftCard  NFTDetails={NFTdata} CardType={"BuyNft"} />
      </div>
    </div>
  );
};

export default Shop;

