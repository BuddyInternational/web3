import React, { useCallback, useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import NftCard from "../components/homeComponents/card/NftCard";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useVanityContext } from "../context/VanityContext";
import Moralis from "moralis";
import { NFTDetails } from "../utils/Types";
import { Box, Tab, Tabs } from "@mui/material";

// API KEY
const api_key: any = process.env.REACT_APP_MORALIS_NFT_API;
const ApiKey: string | undefined = process.env.REACT_APP_OPENSEA_API_KEY || "";
const gullyBuddyNFTCollectionAddress = [
  process.env.REACT_APP_PASSPORT_NFT_COLLECTION_ADDRESS!,
  process.env.REACT_APP_TEAM1_NFT_COLLECTION_ADDRESS!,
  process.env.REACT_APP_TEAM2_NFT_COLLECTION_ADDRESS!,
  process.env.REACT_APP_MANAGER_NFT_COLLECTION_ADDRESS!,
];

// const staticNFTData = [
//   {
//     chainName: "Sepolia",
//     contractAddress: "0x7d551e93e8db94a89f94b7fdcbe004a170384eaf",
//     tokenId: "1",
//     name: "chamardi",
//     tokenType: "ERC721",
//     tokenUri:
//       "https://ipfs.moralis.io:2053/ipfs/Qman3jDc7jZmycLcW633hiGoSqeNZgSCEANT9YpsvUC2Tm?_gl=1*1uz6vt*_ga*ODcxMDc2NzUzLjE2OTM0NzE3MjY.*_ga_5RMPXG14TE*MTY5MzQ3MTcyNS4xLjEuMTY5MzQ3Mjc0My42MC4wLjA.",
//     imageUrl:
//       "https://maroon-fierce-dog-206.mypinata.cloud/ipfs/QmYP9YYrb1D22EiDJEhaVi21sEdEncFib1iPfWFgqcUCh5?_gl=1*bnlfiw*_ga*ODcxMDc2NzUzLjE2OTM0NzE3MjY.*_ga_5RMPXG14TE*MTY5MzQ3MTcyNS4xLjEuMTY5MzQ3MTkzOS4yMi4wLjA.",
//     mediaType: "image/jpeg",
//     timeLastUpdated: "2024-11-22T08:45:22.104Z",
//     floorPrice: 0.5,
//     floorPriceUsd: 23,
//     lastclaimedAt: null,
//     totalClaimedRewardCount: 0,
//     totalClaimedRewardHash: [],
//   },
//   {
//     chainName: "Matic",
//     contractAddress: "0xabc1234567890fedcba0987654321abcdeffedcb",
//     tokenId: "2",
//     name: "CryptoArt",
//     tokenType: "ERC721",
//     tokenUri: "https://ipfs.example.com/ipfs/QmExampleTokenUri",
//     imageUrl: "https://example.com/images/nft2.jpeg",
//     mediaType: "image/jpeg",
//     timeLastUpdated: "2024-11-21T12:00:00.000Z",
//     floorPrice: 0.2,
//     floorPriceUsd: 3,
//     lastclaimedAt: null,
//     totalClaimedRewardCount: 5,
//     totalClaimedRewardHash: ["0xhash1", "0xhash2", "0xhash3"],
//   },
//   {
//     chainName: "Matic",
//     contractAddress: "0x1fbf42835599959491c665747ddaac4aa121383b",
//     tokenId: "9992",
//     name: "#9992",
//     tokenType: "ERC721",
//     tokenUri: "https://ipfs.example.com/ipfs/QmExampleTokenUri",
//     imageUrl: "https://example.com/images/nft2.jpeg",
//     mediaType: "image/jpeg",
//     timeLastUpdated: "2024-11-21T12:00:00.000Z",
//     floorPrice: 0.5,
//     floorPriceUsd: 5,
//     lastclaimedAt: null,
//     totalClaimedRewardCount: 5,
//     totalClaimedRewardHash: ["0xhash1", "0xhash2", "0xhash3"],
//   },
//   {
//     chainName: "Matic",
//     contractAddress: "0x446c44b7b01d689e794820e13ec251fe63098e19",
//     tokenId: "5",
//     name: "CryptoArt",
//     tokenType: "ERC721",
//     tokenUri: "https://ipfs.example.com/ipfs/QmExampleTokenUri",
//     imageUrl: "https://example.com/images/nft2.jpeg",
//     mediaType: "image/jpeg",
//     timeLastUpdated: "2024-11-21T12:00:00.000Z",
//     floorPrice: null,
//     floorPriceUsd: null,
//     lastclaimedAt: null,
//     totalClaimedRewardCount: 5,
//     totalClaimedRewardHash: ["0xhash1", "0xhash2", "0xhash3"],
//   },
//   {
//     chainName: "Matic",
//     contractAddress: "0x1fbf42835599959491c665747ddaac4aa121383b",
//     tokenId: "9996",
//     name: "#9996",
//     tokenType: "ERC721",
//     tokenUri: "https://ipfs.example.com/ipfs/QmAnotherExampleTokenUri",
//     imageUrl: "https://example.com/images/nft3.png",
//     mediaType: "image/png",
//     timeLastUpdated: "2024-11-19T10:30:00.000Z",
//     floorPrice: null,
//     floorPriceUsd: null,
//     lastclaimedAt: null,
//     totalClaimedRewardCount: 10,
//     totalClaimedRewardHash: ["0xhashA", "0xhashB"],
//   },
//   {
//     chainName: "Sepolia",
//     contractAddress: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
//     tokenId: "1",
//     name: "PixelPunk",
//     tokenType: "ERC1155",
//     tokenUri: "https://ipfs.example.com/ipfs/QmAnotherExampleTokenUri",
//     imageUrl: "https://example.com/images/nft3.png",
//     mediaType: "image/png",
//     timeLastUpdated: "2024-11-19T10:30:00.000Z",
//     floorPrice: null,
//     floorPriceUsd: null,
//     lastclaimedAt: null,
//     totalClaimedRewardCount: 10,
//     totalClaimedRewardHash: ["0xhashA", "0xhashB"],
//   },
// ];

const SocketNFTDetails = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const [gullyBuddyNFTs, setGullyBuddyNFTs] = useState<NFTDetails[]>([]); // set GullyBuddy NFTs
  const [totalCDE, setTotalCDE] = useState(0);
  const [otherNFTs, setOtherNFTs] = useState<NFTDetails[]>([]); // set Other NFTs
  const [value, setValue] = React.useState(0);

  // Function to calculate the total USD value of other Socketed NFTs
  const calculateTotalOtherSocketedNFTValue = () => {
    if (!otherNFTs.length) return 0;

    let totalFloorPriceUsd = 0;
    for (const nft of otherNFTs) {
      if (nft.floorPriceUsd !== null) {
        totalFloorPriceUsd += Number(nft.floorPriceUsd);
      }
    }
    return Number(totalFloorPriceUsd).toFixed(4);
  };

  // // Function to calculate the total USD value of GullyBuddy NFTs
  // const calculateTotalGullyBuddySocketedNFTValue = () => {
  //   if (!gullyBuddyNFTs.length) return 0;

  //   let totalFloorPriceUsd = 0;
  //   for (const nft of gullyBuddyNFTs) {
  //     if (nft.floorPriceUsd !== null) {
  //       totalFloorPriceUsd += Number(nft.floorPriceUsd);
  //     }
  //   }
  //   // let totalCDEValue = uniqueMedianTokenNumbers
  //   return Number(totalFloorPriceUsd).toFixed(4);
  // };

  // Fetch Socket NFTs from all chains using moralis
  const fetchSocketNFTs = useCallback(async () => {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({ apiKey: api_key });
      }
      if (vanityAddress) {
        const chains = [
          { chain: "0x1", name: "Mainnet" },
          { chain: "0x89", name: "Matic" },
          { chain: "0xa4b1", name: "Arbitrum" },
          // { chain: "0x2105", name: "Base" },
          { chain: "0xaa36a7", name: "Sepolia" },
          // { chain: "0x13882", name: "Matic-Amoy" },
          // { chain: "0x14a34", name: "Base-Sepolia" },
        ];

        const nftPromises = chains.map((chain) =>
          Moralis.EvmApi.nft
            .getWalletNFTs({
              chain: chain.chain,
              format: "decimal",
              mediaItems: true,
              normalizeMetadata: true,
              limit: 5,
              address: vanityAddress!,
            })
            .then((res) =>
              res.raw.result.map((nft: any) => ({
                chainName: chain.name,
                contractAddress: nft.token_address,
                tokenId: nft.token_id,
                name: nft.name,
                tokenType: nft.contract_type,
                tokenUri: nft.token_uri,
                // imageUrl: nft.media?.original_media_url,
                imageUrl: nft.normalized_metadata?.image,
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

        const combinedNFTs = (await Promise.all(nftPromises)).flat();
        // Define the array of contract addresses
        const targetContractAddresses = gullyBuddyNFTCollectionAddress.map(
          (addr) => addr.toLowerCase()
        );
        // Filter based on the contract address
        const gullyBuddyNFTsData = combinedNFTs.filter((nft: any) =>
          targetContractAddresses.includes(nft.contractAddress?.toLowerCase())
        );

        const otherNFTsData = combinedNFTs.filter(
          (nft: any) =>
            !targetContractAddresses.includes(
              nft.contractAddress?.toLowerCase()
            )
        );

        // Set the filtered states
        setGullyBuddyNFTs(gullyBuddyNFTsData);
        setOtherNFTs(otherNFTsData);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, [vanityAddress]);

  // Fetch socket NFTs useEffect
  useEffect(() => {
    if (address && isConnected && vanityAddress) {
      fetchSocketNFTs();
    }
  }, [address, isConnected, vanityAddress, fetchSocketNFTs]);

  // Handle change tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // static Data
  // useEffect(() => {
  //   // Define the array of contract addresses
  //   const targetContractAddresses = gullyBuddyNFTCollectionAddress.map(
  //     (addr) => addr.toLowerCase()
  //   );
  //   // Filter based on the contract address
  //   const gullyBuddyNFTsData = staticNFTData.filter(
  //     (nft:any) =>
  //       targetContractAddresses.includes(nft.contractAddress?.toLowerCase())
  //   );

  //   const otherNFTsData = staticNFTData.filter(
  //     (nft:any) =>
  //       !targetContractAddresses.includes(nft.contractAddress?.toLowerCase())
  //   );

  //   // Set the filtered states
  //   setGullyBuddyNFTs(gullyBuddyNFTsData);
  //   setOtherNFTs(otherNFTsData);
  // }, []);

  // fetch nft Traits Details
  const fetchNFTTraitsWithRetry = async (
    nft: any,
    retries: number = 3,
    delay: number = 60000
  ) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": ApiKey,
      },
    };

    const traitApiUrl = `https://api.opensea.io/api/v2/chain/${nft.chainName}/contract/${nft.contractAddress}/nfts/${nft.tokenId}`;

    let attempts = 0;
    while (attempts < retries) {
      try {
        const traitResponse = await fetch(traitApiUrl, options);
        if (!traitResponse.ok) {
          throw new Error(`API Error: ${traitResponse.status}`);
        }
        const traitData = await traitResponse.json();
        return { traits: traitData?.nft?.traits || [] };
      } catch (error) {
        attempts++;
        if (attempts < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay * attempts)); // Exponential backoff
        } else {
          console.error(`Failed to fetch traits for ${nft.tokenId}:`, error);
          return { traits: [] }; // Fallback to empty traits
        }
      }
    }
  };

  // Fetch traits for GullyBuddy NFTs after is set
  useEffect(() => {
    const fetchGullyBuddayTraits = async () => {
      if (gullyBuddyNFTs && gullyBuddyNFTs.length > 0) {
        const enrichedBuddyNFTs = await Promise.all(
          gullyBuddyNFTs.map((nft, index) =>
            fetchNFTTraitsWithRetry(nft, 3, 60000)
          )
        );

        // Extract and sum `weighted median tokens`
        const sumWeightedMedianTokens = enrichedBuddyNFTs.reduce(
          (sum, nft: any) => {
            const weightedMedianTrait = nft.traits.find(
              (trait: any) => trait.trait_type === "weighted median tokens"
            );
            if (weightedMedianTrait && weightedMedianTrait.value) {
              // Extract numeric value from string like "100_CDE"
              const numericValue = parseFloat(
                weightedMedianTrait.value.split("_")[0]
              );
              return sum + (isNaN(numericValue) ? 0 : numericValue);
            }
            return sum;
          },
          0
        );

        console.log("Sum of Weighted Median Tokens:", sumWeightedMedianTokens);
        setTotalCDE(sumWeightedMedianTokens);
      }
    };

    fetchGullyBuddayTraits();
  }, [gullyBuddyNFTs]);

  return (
    <div className="container m-auto flex flex-col mt-2 gap-3 ">
      <Link
        to="/"
        className="text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>
      {/* Total Valuation */}
      <div className="mt-2">
        {/* Other Socketed NFT Total Value */}
        <span className="text-white flex gap-2 mx-6 my-2 mb-4 text-xl justify-end">
          <p className="text-[#5692D9]">Total Value(Other Socketd NFTs):</p>
          <p>{calculateTotalOtherSocketedNFTValue()} USD</p>
        </span>
        {/* GullyBuddy's Socketed NFT Total Value */}
        <span className="text-white flex gap-2 mx-6 my-2 mb-4 text-xl justify-end">
          <p className="text-[#5692D9]">
            Total Value(GullyBuddy's Socketd NFTs):
          </p>
          <p>{totalCDE} CDE</p>
        </span>
      </div>

      {/* Holding options */}
      <div className="container m-auto flex flex-col gap-3 py-1 mt-1 px-4 w-full">
        <Box sx={{ width: "100%" }}>
          <Tabs value={value} onChange={handleTabChange} centered>
            <Tab label="Socketed NFT Holdings" sx={{ color: "white" }} />
            <Tab
              label="Gullybuddy's Socketed NFT holdings"
              sx={{ color: "white" }}
            />
          </Tabs>
        </Box>

        {/* Socketed  NFT cards */}
        <div className="mt-3 w-full">
          {/* Render Other Socketed NFTs */}
          {value === 0 &&
            (otherNFTs.length > 0 ? (
              <div className="w-full flex flex-wrap">
                <NftCard NFTDetails={otherNFTs} CardType={"vanityNFT"} />
              </div>
            ) : (
              <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
                No Socketed NFTs in your account at the moment
              </h1>
            ))}

          {/* Render Gullybuddy's Socketed NFTs */}
          {value === 1 &&
            (gullyBuddyNFTs.length > 0 ? (
              <div className="w-full flex flex-wrap">
                <NftCard NFTDetails={gullyBuddyNFTs} CardType={"vanityNFT"} />
              </div>
            ) : (
              <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
                No Gullybuddy's Socketed NFTs in your account at the moment
              </h1>
            ))}
        </div>
      </div>
    </div>
  );
};

export default SocketNFTDetails;
