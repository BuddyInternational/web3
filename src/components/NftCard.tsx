import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { NFTData } from "../utils/Types";
import Pagination from "../utils/Pagination";
import ZoomedImage from "./modals/ZoomedImage";
import { IoMdQrScanner } from "react-icons/io";

const NftCard: React.FC<{ NFTDetails: NFTData[] }> = ({ NFTDetails }) => {
  const [isContractAddressCopied, setIsContractAddressCopied] =
    useState<number>(-1);
  const [isTokenIdCopied, setIsTokenIdCopied] = useState<number>(-1);
  const copyTimeoutRef: any = useRef(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(NFTDetails.length / itemsPerPage);
  const [open, setOpen] = useState(false);
  const [zommedImageURL, setZommedImageURL] = useState("");

  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Slice nftDetail
  const slicedNFTDetails = NFTDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
    if (imageUrl.startsWith("ipfs://")) {
      const ipfsHash = imageUrl.slice(7);
      const newImageUrl = `https://ipfs.moralis.io:2053/ipfs/${ipfsHash}`;
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

  // Handle Esc key to close zoomed image
  const handleEscKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && open) {
      handleClose();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscKeyDown);

    return () => {
      window.removeEventListener("keydown", handleEscKeyDown);
    };
  }, [open]);

  return (
    <>
      <div
        className="container mx-auto px-4 mt-4 grid grid-cols-1 md:grid-cols-4 gap-4"
        style={{
          opacity: open ? 0.2 : 1,
        }}
      >
        {slicedNFTDetails?.map((nft, index) => (
          <div
            key={index + 1}
            className="relative flex flex-col my-4 bg-[#F5F5F5] shadow-sm border border-slate-200 rounded-lg w-full"
          >
            <div className="p-2 mt-2 text-sm flex flex-column justify-between">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
                {nft.chainName}
              </span>
              <p className="flex gap-1">
                {nft.contractAddress?.slice(0, 6)}...
                {nft.contractAddress?.slice(-4)}
                {isContractAddressCopied === index ? (
                  <FaCheck className="ml-1 mt-1 text-green-500 cursor-pointer" />
                ) : (
                  <FaCopy
                    onClick={() => handleCopyAddress(index)}
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
                      alt="NFT image"
                    />
                    <IoMdQrScanner
                      className="absolute bottom-1 right-1 text-white z-20 mr-2 mb-2 cursor-pointer bg-transparent rounded-full hover:bg-gray-800"
                      onClick={() => handleImageClick(nft.imageUrl)}
                    />
                  </>
                )
              ) : (
                <img
                  className="h-full w-full object-cover hover:scale-110 transition duration-300 ease-in-out"
                  src="/blank_nft.png"
                  alt="NFT image"
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
                        {nft?.tokenId?.slice(0, 6)}...{nft?.tokenId?.slice(-4)}
                      </p>
                    ) : (
                      <p>{nft?.tokenId}</p>
                    )}
                  </p>
                  <p>
                    {isTokenIdCopied === index ? (
                      <FaCheck className="mt-0.5 text-green-500 cursor-pointer" />
                    ) : (
                      <FaRegCopy
                        onClick={() => handleCopyTokenID(index)}
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
                  {nft?.floorPrice === null ? (
                    "Price Not Found"
                  ) : (
                    <>
                      <span className=" flex flex-col gap-2">
                        <p className="">
                          {Number(nft?.floorPrice).toFixed(4)}{" "}
                          {nft?.priceCurrency}
                        </p>
                        <p className="">
                          {Number(nft?.floorPriceUsd).toFixed(2)} USD
                        </p>
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
          </div>
        ))}
      </div>
      {/* Pagination at the bottom */}
      <div className="text-white py-4">
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

export default NftCard;
