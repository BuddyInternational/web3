import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import ShopeNftcard from "../components/homeComponents/card/ShopeNftcard";
import { NFTDetails, ShopNFTDetails } from "../utils/Types";
import { Box, Tab, Tabs } from "@mui/material";

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
// API KEY
const api_key: any = process.env.REACT_APP_MORALIS_NFT_API;
const ApiKey: string | undefined = process.env.REACT_APP_OPENSEA_API_KEY || "";

const Shop = () => {
  const [buddyPassportNFTdata, setBuddyPassportNFTdata] = useState<
    ShopNFTDetails[]
  >([]);
  const [teamNFTdata, setTeamNFTdata] = useState<ShopNFTDetails[]>([]);
  const [managerNFTdata, setManagerNFTdata] = useState<ShopNFTDetails[]>([]);
  const [teamNFTWithTraits, setTeamNFTWithTraits] = useState<ShopNFTDetails[]>(
    []
  );
  const [value, setValue] = React.useState(0);
  const [isAPICall, setIsAPICall] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // fetch nft Traits Details
  const fetchNFTTraitsWithRetry = async (nft: any, retries: number = 3, delay: number = 60000) => {
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
        return { ...nft, traits: traitData?.nft?.traits || [] };
      } catch (error) {
        attempts++;
        if (attempts < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay * attempts)); // Exponential backoff
        } else {
          console.error(`Failed to fetch traits for ${nft.tokenId}:`, error);
          return { ...nft, traits: [] }; // Fallback to empty traits
        }
      }
    }
  };

  // Fetch floor price with retries
  const fetchNFTFloorPriceWithRetry = async (
    collectionSlug: string,
    tokenId: string,
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

    const floorPriceApiUrl = `https://api.opensea.io/api/v2/listings/collection/${collectionSlug}/nfts/${tokenId}/best`;

    let attempts = 0;
    while (attempts < retries) {
      try {
        const floorPriceResponse = await fetch(floorPriceApiUrl, options);
        if (!floorPriceResponse.ok) {
          throw new Error(`API Error: ${floorPriceResponse.status}`);
        }
        const floorPriceData = await floorPriceResponse.json();

        const floorPrice = floorPriceData?.price?.current?.value
          ? parseFloat(floorPriceData.price.current.value) /
            Math.pow(10, floorPriceData.price.current.decimals)
          : null; // Convert from Wei to ETH

        return floorPrice;
      } catch (error) {
        attempts++;
        if (attempts < retries) {
          await new Promise((resolve) => setTimeout(resolve, delay * attempts));
        } else {
          console.error(
            `Failed to fetch floor price for ${collectionSlug}:`,
            error
          );
          return null;
        }
      }
    }
  };

  // fetch Nft Collection data
  useEffect(() => {
    const fetchNFTsCollection = async () => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          "x-api-key": ApiKey, // No need for template literal here
        },
      };

      // // Define collection URLs
      // const collectionUrls = [
      //   "https://api.opensea.io/api/v2/collection/gully-buddy-international-passport-polygon/nfts",
      //   "https://api.opensea.io/api/v2/collection/gullybuddypolygon/nfts?limit=200",
      //   // "https://api.opensea.io/api/v2/collection/gullybuddypolygon/nfts",
      //   "https://api.opensea.io/api/v2/collection/gully-buddy-international-socketed-nfts-bonus-comm/nfts",
      // ];

      // Define collection URLs and their slugs
      const collections = [
        {
          url: "https://api.opensea.io/api/v2/collection/gully-buddy-international-passport-polygon/nfts",
          slug: "gully-buddy-international-passport-polygon",
        },
        {
          url: "https://api.opensea.io/api/v2/collection/gullybuddypolygon/nfts?limit=70",
          slug: "gullybuddypolygon",
        },
        {
          url: "https://api.opensea.io/api/v2/collection/gully-buddy-international-socketed-nfts-bonus-comm/nfts",
          slug: "gully-buddy-international-socketed-nfts-bonus-comm",
        },
      ];

      try {
        // // Fetch all collections in parallel
        // const responses = await Promise.all(
        //   collectionUrls.map((url) => fetch(url, options))
        // );

        // Fetch collections in parallel
        const responses = await Promise.all(
          collections.map((collection) => fetch(collection.url, options))
        );

        // Parse JSON responses
        const collectionsData = await Promise.all(
          responses.map((response) => response.json())
        );
        // // Define a utility function to format NFTs
        // const formatNFTs = (nfts = []) =>
        //   nfts.map((nft: any) => ({
        //     chainName: nft.asset_contract?.chain || "Matic",
        //     contractAddress: nft.contract || "",
        //     tokenId: nft.identifier || "",
        //     name: nft.name || "Unnamed NFT",
        //     tokenType: nft.asset_contract?.schema_name || "ERC721",
        //     tokenUri: nft.permalink || "",
        //     imageUrl: nft.display_image_url || "",
        //     mediaType: nft.display_animation_url ? "video" : "image",
        //     timeLastUpdated: nft.updated_at || new Date().toISOString(),
        //     floorPrice: nft.floor_price || 0,
        //     floorPriceUsd: nft.floor_price_usd || 0,
        //     priceCurrency: nft.payment_token?.symbol || "ETH",
        //     lastclaimedAt: new Date(nft.last_claimed_date || Date.now()),
        //     totalClaimedRewardCount: nft.claim_count || 0,
        //     totalClaimedRewardHash: nft.claim_hashes || [],
        //     traits: nft.traits || [],
        //   }));

        // // Extract and format data for each collection
        // const [
        //   buddyPassportCollectionData,
        //   teamCollectionData,
        //   managerCollectionData,
        // ] = collectionsData;

        // setBuddyPassportNFTdata(formatNFTs(buddyPassportCollectionData.nfts));
        // setTeamNFTdata(formatNFTs(teamCollectionData.nfts));
        // setManagerNFTdata(formatNFTs(managerCollectionData.nfts));

        // Fetch floor prices and enrich NFT data
        const enrichedCollections = await Promise.all(
          collections.map(async (collection, index) => {
            return await Promise.all(
              collectionsData[index].nfts.map(async (nft: any) => {
                // Fetch floor price for each NFT
                const floorPrice = await fetchNFTFloorPriceWithRetry(
                  collection.slug,
                  nft.identifier
                );

                // Return enriched NFT data
                return {
                  chainName: nft.asset_contract?.chain || "Matic",
                  contractAddress: nft.contract || "",
                  tokenId: nft.identifier || "",
                  name: nft.name || "Unnamed NFT",
                  tokenType: nft.asset_contract?.schema_name || "ERC721",
                  tokenUri: nft.permalink || "",
                  imageUrl: nft.display_image_url || "",
                  mediaType: nft.display_animation_url ? "video" : "image",
                  timeLastUpdated: nft.updated_at || new Date().toISOString(),
                  floorPrice: floorPrice || nft.floor_price || 0, 
                  floorPriceUsd: nft.floor_price_usd || 0,
                  priceCurrency: nft.payment_token?.symbol || "ETH",
                  lastclaimedAt: new Date(nft.last_claimed_date || Date.now()),
                  totalClaimedRewardCount: nft.claim_count || 0,
                  totalClaimedRewardHash: nft.claim_hashes || [],
                  traits: nft.traits || [],
                };
              })
            );
          })
        );

        console.log("collection 1===============", enrichedCollections[0]);

        // Set state for each collection
        setBuddyPassportNFTdata(enrichedCollections[0]);
        setTeamNFTdata(enrichedCollections[1]);
        setManagerNFTdata(enrichedCollections[2]);
      } catch (err) {
        console.error("Error fetching NFT data from OpenSea:", err);
      }
    };

    fetchNFTsCollection();
  }, []);

  // Fetch traits for Team NFTs after teamNFTdata is set
  useEffect(() => {
    const fetchTeamTraits = async () => {
      if (teamNFTdata && teamNFTdata.length > 0 && !isAPICall) {
        setIsAPICall(true);
        const enrichedTeamNFTs = await Promise.all(
          teamNFTdata.map((nft, index) => fetchNFTTraitsWithRetry(nft, 3, 60000))
        );
        setTeamNFTWithTraits(enrichedTeamNFTs); // Store traits for filtering
        setTeamNFTdata(enrichedTeamNFTs); // Update teamNFTdata with traits
        setIsAPICall(false);
      }
    };
    fetchTeamTraits();
  }, [teamNFTdata,isAPICall]);

  return (
    <div className="container m-auto flex flex-col mt-2 gap-3 ">
      <Link
        to="/"
        className="text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>

      <div className="mt-3">
        <h1 className="text-3xl text-white text-center font-bold mb-4">
          NFT Marketplace
        </h1>

        {/* Holding options */}
        <div className="container m-auto flex flex-col gap-3 py-2 mt-3 px-4 w-full">
          <Box sx={{ width: "100%" }}>
            <Tabs value={value} onChange={handleChange} centered>
              <Tab label="Passport" sx={{ color: "white" }} />
              <Tab label="Team Member" sx={{ color: "white" }} />
              <Tab label="Persona Of Manager" sx={{ color: "white" }} />
            </Tabs>
          </Box>
        </div>

        {value === 0 &&
          (buddyPassportNFTdata.length > 0 ? (
            <ShopeNftcard
              NFTDetails={buddyPassportNFTdata}
              CardType="BuyNft"
              tabValue="0"
            />
          ) : (
            <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
              No NFTs exits at the moment
            </h1>
          ))}
        {value === 1 &&
          (teamNFTdata.length > 0 ? (
            <ShopeNftcard
              NFTDetails={teamNFTdata}
              CardType="BuyNft"
              tabValue="1"
            />
          ) : (
            <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
              No NFTs exits at the moment
            </h1>
          ))}
        {value === 2 &&
          (managerNFTdata.length > 0 ? (
            <ShopeNftcard
              NFTDetails={managerNFTdata}
              CardType="BuyNft"
              tabValue="2"
            />
          ) : (
            <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
              No NFTs exits at the moment
            </h1>
          ))}
      </div>
    </div>
  );
};

export default Shop;
