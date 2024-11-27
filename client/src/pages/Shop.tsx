import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import ShopeNftcard from "../components/homeComponents/card/ShopeNftcard";
import { NFTDetails, ShopNFTDetails } from "../utils/Types";
import { Box, Tab, Tabs } from "@mui/material";
import Moralis from "moralis/.";

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
  const [teamNFTWithTraits, setTeamNFTWithTraits] = useState<ShopNFTDetails[]>([]);
  const [value, setValue] = React.useState(0);
  const [traitsData, setTraitsData] = useState();

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  // Fetch traits only for Team NFTs using OpenSea API
  const fetchNFTTraits = async (nft: any) => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-api-key": ApiKey, // No need for template literal here
      },
    };
    const traitApiUrl = `https://api.opensea.io/api/v2/chain/${nft.chainName}/contract/${nft.contractAddress}/nfts/${nft.tokenId}`;
    const traitResponse = await fetch(traitApiUrl, options);
    const traitData = await traitResponse.json();

    return { ...nft, traits: traitData.nft.traits || [] };
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

      // Define collection URLs
      const collectionUrls = [
        "https://api.opensea.io/api/v2/collection/gully-buddy-international-passport-polygon/nfts",
        "https://api.opensea.io/api/v2/collection/gullybuddypolygon/nfts",
        "https://api.opensea.io/api/v2/collection/gully-buddy-international-socketed-nfts-bonus-comm/nfts",
      ];

      try {
        // Fetch all collections in parallel
        const responses = await Promise.all(
          collectionUrls.map((url) => fetch(url, options))
        );

        // Parse JSON responses
        const collectionsData = await Promise.all(
          responses.map((response) => response.json())
        );
        // Define a utility function to format NFTs
        const formatNFTs = (nfts = []) =>
          nfts.map((nft: any) => ({
            chainName: nft.asset_contract?.chain || "Matic",
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
            traits: nft.traits || [],
          }));

        // Extract and format data for each collection
        const [
          buddyPassportCollectionData,
          teamCollectionData,
          managerCollectionData,
        ] = collectionsData;

        setBuddyPassportNFTdata(formatNFTs(buddyPassportCollectionData.nfts));
        setTeamNFTdata(formatNFTs(teamCollectionData.nfts));
        setManagerNFTdata(formatNFTs(managerCollectionData.nfts));

        // Fetch traits for Team NFTs in parallel
        const teamNFTsWithTraits = await Promise.all(
          teamNFTdata.map(fetchNFTTraits)
        );

        if(teamNFTsWithTraits.length >0){
          setTeamNFTdata(teamNFTsWithTraits);
        }

      } catch (err) {
        console.error("Error fetching NFT data from OpenSea:", err);
      }
    };

    fetchNFTsCollection();
  }, []);

    // Fetch traits for Team NFTs after teamNFTdata is set
    useEffect(() => {
      const fetchTeamTraits = async () => {
        if (teamNFTdata.length > 0) {
          const enrichedTeamNFTs = await Promise.all(
            teamNFTdata.map(fetchNFTTraits)
          );
          setTeamNFTWithTraits(enrichedTeamNFTs); // Store traits for filtering
          setTeamNFTdata(enrichedTeamNFTs); // Update teamNFTdata with traits
        }
      };
  
      fetchTeamTraits();
    }, [teamNFTdata]);
  

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
            <ShopeNftcard NFTDetails={buddyPassportNFTdata} CardType="BuyNft" tabValue="0" />
          ) : (
            <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
              No NFTs exits at the moment
            </h1>
          ))}
        {value === 1 &&
          (teamNFTdata.length > 0 ? (
            <ShopeNftcard NFTDetails={teamNFTdata} CardType="BuyNft" tabValue="1" />
          ) : (
            <h1 className="text-center font-bold text-3xl sm:text-xl md:text-2xl lg:text-3xl my-7 text-white">
              No NFTs exits at the moment
            </h1>
          ))}
        {value === 2 &&
          (managerNFTdata.length > 0 ? (
            <ShopeNftcard NFTDetails={managerNFTdata} CardType="BuyNft" tabValue="2"/>
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
