import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { ShopNFTDetails } from "../../../utils/Types";
import Pagination from "../../../utils/Pagination";
import ZoomedImage from "../modals/ZoomedImage";
import { IoMdQrScanner } from "react-icons/io";
import CardInteractMenus from "./CardInteractMenus";
import CardChainFilterMenus from "./CardChainFilterMenus";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import CardMedianTokenFilterMenus from "./CardMedianTokenFilterMenus";

const ShopeNftcard: React.FC<{
  NFTDetails: ShopNFTDetails[];
  CardType: string;
  tabValue: string;
}> = ({ NFTDetails, CardType, tabValue }) => {
  const [isContractAddressCopied, setIsContractAddressCopied] = useState<
    number | null
  >(null);
  const [isTokenIdCopied, setIsTokenIdCopied] = useState<number>(-1);
  const copyTimeoutRef: any = useRef(null);
  const { isConnected } = useWeb3ModalAccount();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [open, setOpen] = useState(false);
  const [zommedImageURL, setZommedImageURL] = useState("");
  const [selectedChain, setSelectedChain] = useState<string>("All");
  const [selectedMedianToken, setSelectedMedianToken] = useState<number | null>(-1);


  // Extract numeric value from "value" field
  const getNumericValue = (value: string | undefined): number => {
    if (!value) return 0;
    const numericPart = parseInt(value.split("_")[0], 10);
    return isNaN(numericPart) ? 0 : numericPart;
  };

  // Filter NFTs based on selected chain
  // const filteredNFTDetails =
  //   selectedChain === "All"
  //     ? NFTDetails
  //     : NFTDetails.filter((nft) => nft.chainName === selectedChain);
 

  // Filter NFTs by Chain
  const filteredByChain =
    selectedChain === "All"
      ? NFTDetails
      : NFTDetails.filter((nft) => nft.chainName === selectedChain);

  const filteredNFTDetails = selectedMedianToken === -1 ? filteredByChain 
  : filteredByChain.filter((nft: any) => {
      
      // Find the trait with "weighted median tokens"
      const weightedMedianTrait = nft?.traits?.find((trait: any) => trait?.trait_type === "weighted median tokens");
      if (weightedMedianTrait) {
        // Get the value and extract the numeric part (e.g., "10_CDE" -> 10)
        const tokenValue = getNumericValue(weightedMedianTrait.value);
        
        return tokenValue === selectedMedianToken;
      }

      return false; 
  });

  // Total number of page
  const totalPages = Math.ceil(filteredNFTDetails.length / itemsPerPage);

  // Slice nftDetail
  const slicedNFTDetails = filteredNFTDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


// Extract unique numeric values from the "weighted median tokens" trait values
const uniqueMedianTokenNumbers: number[] = Array.from(
  new Set(
    NFTDetails.flatMap((nft) =>
      nft?.traits
        ? nft?.traits
            .filter((trait: any) => trait.trait_type === "weighted median tokens" && trait.value)
            .map((trait: any) => {
              // Extract the number part before '_CDE' using regex
              const match = trait.value.match(/^(\d+)/);
              return match ? Number(match[1]) : null;
            })
            .filter((value): value is number => value !== null) // TypeScript type guard to ensure only numbers remain
        : []
    )
  )
);

  // Get unique chains from NFTDetails
  const uniqueChains: string[] = Array.from(
    new Set(
      NFTDetails.map((nft) => nft.chainName).filter(
        (chain): chain is string => chain !== undefined
      )
    )
  );

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Handle copy nft contract address
  const handleCopyAddress = (index: number) => {
    navigator.clipboard.writeText(NFTDetails[index]?.contractAddress || "");
    setIsContractAddressCopied(index);
    clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setIsContractAddressCopied(-1);
    }, 1000);
  };

  // Handle copy tokenId
  const handleCopyTokenID = (index: number) => {
    navigator.clipboard.writeText(NFTDetails[index]?.tokenId || "");
    setIsTokenIdCopied(index);
    clearTimeout(copyTimeoutRef.current);
    copyTimeoutRef.current = setTimeout(() => {
      setIsTokenIdCopied(-1);
    }, 1000);
  };

  // Convert image url
  const convertIpfsUrl = (imageUrl: string) => {
    if (!imageUrl) {
      return imageUrl; 
    }
    if (imageUrl.startsWith("ipfs://")) {
      const ipfsHash = imageUrl.slice(7);
      // const newImageUrl = `https://ipfs.moralis.io:2053/ipfs/${ipfsHash}`;
      const newImageUrl = `https://ipfs.io/ipfs/${ipfsHash}`;
      return newImageUrl;
    }
    return imageUrl;
  };

  // Handle image zoomed action
  const handleImageClick = (imageUrl: any) => {
    const newImageUrl = convertIpfsUrl(imageUrl);
    setZommedImageURL(newImageUrl);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setZommedImageURL("");
  };

  useEffect(() => {
    // Handle Esc key to close zoomed image
    const handleEscKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleEscKeyDown);

    return () => {
      window.removeEventListener("keydown", handleEscKeyDown);
    };
  }, [open]);

  // Reset current page on chain change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedChain, selectedMedianToken]);

  return (
    <>
      {/* Dropdowns for Filters */}
      <div className="flex justify-end items-center container mx-auto px-6 gap-4 mb-4">
         {/* Filter by Weighted Median Tokens */}
         {CardType === "BuyNft" && tabValue === "1" && (
          <>
            <div className="flex items-center gap-2">
              <label className="text-md font-bold text-[#5692D9]">
                Filter by Weighted Median Tokens:
              </label>
              <CardMedianTokenFilterMenus
              uniqueMedianTokenNumbers={uniqueMedianTokenNumbers}
                selectedMedianToken={selectedMedianToken}
                setSelectedMedianToken={setSelectedMedianToken}
                component="NFTCard"
              />
            </div>
          </>
        )}
        {/* Filter by Chain */}
        <div className="flex justify-end items-center gap-2">
          <label className="text-md font-bold text-[#5692D9]">
            Filter by Chain:
          </label>
          <CardChainFilterMenus
            uniqueChains={uniqueChains}
            selectedChain={selectedChain}
            setSelectedChain={setSelectedChain}
            component="NFTCard"
          />
        </div>
       
      </div>

      {/* Grid of NFTs*/}
      <div
        className="container mx-auto px-4 mt-2 grid grid-cols-1  sm:p-0 md:px-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
        style={{
          opacity: open ? 0.2 : 1,
        }}
      >
        {slicedNFTDetails?.map((nft, index) => {
          const globalIndex = (currentPage - 1) * itemsPerPage + index;
          const selectedNFT: ShopNFTDetails = {
            chainName: nft.chainName || "",
            contractAddress: nft.contractAddress || "",
            tokenId: nft.tokenId || "",
            name: nft.name || "Unknown",
            tokenType: nft.tokenType || "ERC721",
            tokenUri: nft.tokenUri || "",
            imageUrl: nft.imageUrl || "",
            mediaType: nft.mediaType || "",
            timeLastUpdated: nft.timeLastUpdated || new Date().toISOString(),
            floorPrice: nft.floorPrice || null,
            floorPriceUsd: nft.floorPriceUsd || 0,
            priceCurrency: nft.priceCurrency || null,
            lastclaimedAt: nft.lastclaimedAt || null,
            totalClaimedRewardCount: nft.totalClaimedRewardCount || 0,
            totalClaimedRewardHash: nft.totalClaimedRewardHash || [],
            traits: nft.traits || [],
          };
          return (
            <div
              key={globalIndex}
              className="relative flex flex-col my-4 bg-[#F5F5F5] shadow-sm border border-slate-200 rounded-lg w-full"
            >
              <div className="p-2 mt-2 text-sm flex flex-column justify-between">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                  {nft.chainName === "Matic" ? "Polygon" : nft.chainName}
                </span>
                <span></span>
                <p className="flex gap-1">
                  {nft.contractAddress?.slice(0, 6)}...
                  {nft.contractAddress?.slice(-4)}
                  {isContractAddressCopied === globalIndex ? (
                    <FaCheck className="ml-1 mt-1 text-green-500 cursor-pointer" />
                  ) : (
                    <FaCopy
                      onClick={() => handleCopyAddress(globalIndex)}
                      className="ml-1 mt-1 cursor-pointer"
                      data-tip="Copy Address"
                      data-tip-content=".tooltip"
                    />
                  )}
                </p>
              </div>
              <div className="relative h-44 m-1.5 overflow-hidden text-black rounded-xl">
                {nft.imageUrl !== undefined ? (
                  nft.mediaType === "video/mp4" ? (
                    <video
                      className="h-full w-full object-cover hover:scale-105 transition duration-300 ease-in-out"
                      controls
                      src={convertIpfsUrl(nft.imageUrl)}
                    />
                  ) : (
                    <>
                      <img
                        className="h-full w-full object-cover hover:scale-110 transition duration-300 ease-in-out"
                        src={convertIpfsUrl(nft.imageUrl)}
                        alt={nft.name || "NFT"}
                      />
                      <span className="absolute z-20 bg-transparent bottom-1 right-1  mr-2 mb-2 p-2 rounded-full hover:bg-gray-700 hover:bg-opacity-75">
                        <IoMdQrScanner
                          className="text-white cursor-pointer"
                          onClick={() => handleImageClick(nft.imageUrl)}
                        />
                      </span>
                    </>
                  )
                ) : (
                  <img
                    className="h-full w-full object-cover hover:scale-110 transition duration-300 ease-in-out"
                    src="/blank_nft.png"
                    alt="NFT not found"
                  />
                )}
              </div>
              <div className="p-2">
                <h6 className="mb-4 text-slate-800 text-xl font-semibold">
                  {nft.name !== null ? nft.name : "Name Not Found"}
                </h6>

                <div className="mb-2 text-sm flex flex-column justify-between">
                  <p className="text-sm">Token ID </p>
                  <span className="flex gap-2">
                    <p>
                      {nft?.tokenId?.length > 12 ? (
                        <p className="">
                          {nft?.tokenId?.slice(0, 6)}...
                          {nft?.tokenId?.slice(-4)}
                        </p>
                      ) : (
                        <p>{nft?.tokenId}</p>
                      )}
                    </p>
                    <p>
                      {isTokenIdCopied === globalIndex ? (
                        <FaCheck className="mt-0.5 text-green-500 cursor-pointer" />
                      ) : (
                        <FaRegCopy
                          onClick={() => handleCopyTokenID(globalIndex)}
                          className="mt-0.5 cursor-pointer"
                          data-tip="Copy Token ID"
                          data-tip-content=".tooltip"
                        />
                      )}
                    </p>
                  </span>
                </div>

                <div className="mb-2 text-sm flex flex-column justify-between">
                  <p className="text-sm">Token Standard </p>
                  <p className="">{nft.tokenType}</p>
                </div>

                <div className="mb-2 text-sm flex flex-column justify-between">
                  <p className="text-sm">Price </p>
                  <span className="flex gap-2">
                    {nft?.floorPrice === 0 ? (
                      "Price Not Found"
                    ) : (
                      <>
                        <span className=" flex flex-col gap-2">
                          <p className="">
                            {Number(nft?.floorPrice).toFixed(4)}{" "}
                            {nft?.priceCurrency}
                          </p>
                          {/* <p className="">
                            {Number(nft?.floorPriceUsd).toFixed(2)} USD
                          </p> */}
                        </span>
                      </>
                    )}
                  </span>
                </div>

                <div className="mb-2 text-sm flex flex-column justify-between">
                  <p className="text-sm">Last Updated </p>
                  <p className="">
                    {moment(nft.timeLastUpdated).format("DD-MM-YY")}
                  </p>
                </div>
              </div>
              {CardType === "walletNFT" && (
                <div className="flex justify-end items-end mt-auto mr-2 mb-2">
                  <CardInteractMenus selectedNFT={selectedNFT} />
                </div>
              )}
              {/* BuyNft */}
              {CardType === "BuyNft" && (
                <div className="flex justify-end items-end mt-auto mr-2 mb-2">
                  {isConnected ? (
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
                      onClick={() =>
                        window.open(
                          `https://opensea.io/assets/matic/${nft.contractAddress}/${nft.tokenId}`,
                          "_blank"
                        )
                      }
                    >
                      Purchase to Earn Rewards
                    </button>
                  ) : (
                    <button
                      className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded shadow-md transition duration-200"
                      onClick={() =>
                        window.open(
                          `https://opensea.io/assets/matic/${nft.contractAddress}/${nft.tokenId}`,
                          "_blank"
                        )
                      }
                    >
                      Connect to Interact
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination at the bottom */}
      <div className="text-white py-4 m-auto">
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* open zoomed image components */}
      {open && (
        <>
          <ZoomedImage
            open={open}
            handleClose={handleClose}
            src={zommedImageURL}
          />
        </>
      )}
    </>
  );
};

export default ShopeNftcard;
