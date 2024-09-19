import moment from "moment";
import React, { useRef, useState } from "react";
import { FaCheck, FaCopy } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa";
import { NFTData } from "../utils/Types";

const NftCard: React.FC<{ NFTDetails: NFTData[] }> = ({ NFTDetails }) => {
  const [isAddressCopied, setIsAddressCopied] = useState<number>(-1);
  const [isTokenIdCopied, setIsTokenIdCopied] = useState<number>(-1);
  const copyTimeoutRef :any = useRef(null);

  const handleCopyAddress = (index: number) => {
    navigator.clipboard.writeText(NFTDetails[index]?.contractAddress || "");
    setIsAddressCopied(index);
    clearTimeout(copyTimeoutRef.current); // Clear previous timeout if any
    copyTimeoutRef.current = setTimeout(() => {
      setIsAddressCopied(-1);
    }, 1000);
  };

  const handleCopyTokenID = (index: number) => {
    navigator.clipboard.writeText(NFTDetails[index]?.tokenId || "");
    setIsTokenIdCopied(index);
    clearTimeout(copyTimeoutRef.current); // Clear previous timeout if any
    copyTimeoutRef.current = setTimeout(() => {
      setIsTokenIdCopied(-1);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
      {NFTDetails?.map((nft, index) => (
        <div
          key={index+1}
          className="relative flex flex-col my-6 bg-[#F5F5F5] shadow-sm border border-slate-200 rounded-lg w-full"
        >
          <div className="p-3 mt-2 text-sm flex flex-column justify-between">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
              {nft.chainName}
            </span>
            <p className="flex gap-1">
              {nft.contractAddress?.slice(0, 6)}...
              {nft.contractAddress?.slice(-4)}
              {isAddressCopied === index  ? (
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
              <img
                className="h-full w-full object-cover hover:scale-110 transition duration-300 ease-in-out"
                src={nft.imageUrl}
                alt="NFT image"
              />
            ) : (
              <img src="/blank_nft.png" alt="NFT image" />
            )}
          </div>
          <div className="p-2">
            <h6 className="mb-4 text-slate-800 text-xl font-semibold">
              {nft.name !== null ? nft.name : "---"}
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
                  {isTokenIdCopied === index  ? (
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
                {/* {nft?.floorPrice === null
                    ? 'Not Listed'
                    : `${nft?.floorPrice} ${nft?.priceCurrency}`} */}
                {nft?.floorPrice === null ? (
                  "Not Listed"
                ) : (
                  <>
                    <span className=" flex flex-col gap-2">
                      <p className="">
                        {nft?.floorPrice} {nft?.priceCurrency}
                      </p>
                      <p className="">{nft?.floorPriceUsd} USD</p>
                    </span>
                  </>
                )}
              </span>
            </div>

            {/* <div className="mb-2 text-sm flex flex-column justify-between">
                <p className="text-sm">LooksRare Price </p>
                <span className='flex  gap-2'>
                  {""}
                  {nft.floorPrices?.looksRare?.floorPrice === 0
                    ? 'Not Listed'
                    : `${nft.floorPrices?.looksRare?.floorPrice}  ${nft.floorPrices?.looksRare?.priceCurrency}`}
                </span>
              </div> */}

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
  );
};

export default NftCard;
