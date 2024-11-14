import React, { useCallback, useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import NftCard from "../components/homeComponents/card/NftCard";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useVanityContext } from "../context/VanityContext";
import Moralis from "moralis";
import { NFTDetails } from "../utils/Types";

// API KEY
const api_key: any = process.env.REACT_APP_MORALIS_NFT_API;

const SocketNFTDetails = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const [socketNFTdata, setSocketNFTdata] = useState<NFTDetails[]>([]);

  // Fetch Socket NFTs from all chains using moralis
  const fetchSocketNFTs = useCallback(async () => {
    try {
      if (!Moralis.Core.isStarted) {
        await Moralis.start({ apiKey: api_key });
      }
      if (vanityAddress) {
        const chains = [
          { chain: "0x1", name: "Ethereum" },
          { chain: "0x89", name: "Polygon" },
          { chain: "0xa4b1", name: "Arbitrum" },
          { chain: "0xaa36a7", name: "Sepolia" },
          { chain: "0x13882", name: "Polygon Amoy" },
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
                imageUrl: nft.media?.original_media_url,
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
        setSocketNFTdata(combinedNFTs);
      }
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  }, [vanityAddress]);

  // Function to calculate the total USD value of all Socketed NFTs
  const calculateTotalSocketedNFTValue = () => {
    if (!socketNFTdata.length) return 0;

    let totalFloorPriceUsd = 0;
    for (const nft of socketNFTdata) {
      if (nft.floorPriceUsd !== null) {
        totalFloorPriceUsd += Number(nft.floorPriceUsd);
      }
    }
    return Number(totalFloorPriceUsd).toFixed(4);
  };

  useEffect(() => {
    if (address && isConnected && vanityAddress) {
      fetchSocketNFTs();
    }
  }, [address, isConnected, vanityAddress, fetchSocketNFTs]);

  return (
    <div className="container m-auto flex flex-col mt-2 gap-3 ">
      <Link
        to="/"
        className="text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>
      {/* Socket NFT cards */}
      {socketNFTdata &&
      socketNFTdata.length > 0 &&
      vanityAddress !== "0x0000000000000000000000000000000000000000" ? (
        <div className="mt-3">
          <span className="text-white flex gap-2 mx-6 my-2 mb-4 text-xl justify-end">
            <p className="text-[#5692D9]">Total Value:</p>
            <p>{calculateTotalSocketedNFTValue()} USD</p>
          </span>
          <NftCard NFTDetails={socketNFTdata} CardType={"vanityNFT"} />
        </div>
      ) : (
        <p className="text-2xl text-white m-auto my-6">
          You don’t have any socketed NFTs at the moment. Explore and add some
          NFTs to see them here!
        </p>
      )}
    </div>
  );
};

export default SocketNFTDetails;
