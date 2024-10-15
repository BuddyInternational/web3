import React, { useState } from "react";
import { NFTData } from "../../../utils/Types";
import { FaCheck } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import moment from "moment";


const ModalNFTCard: React.FC<{ nft: NFTData; key: number }> = ({
  nft,
  key,
}) => {
  const [isContractAddressCopied, setIsContractAddressCopied] =
    useState<number>(-1);

  // Handle copy nft contract address
  const handleCopyAddress = (index: number) => {
    navigator.clipboard.writeText(nft.contractAddress || "");
    setIsContractAddressCopied(index);
    setTimeout(() => {
      setIsContractAddressCopied(-1);
    }, 1000);
  };

  return (
    <div className="mx-2 my-4 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Chain and NFT Address */}
      <div className="p-2 mx-5 text-sm flex flex-col sm:flex-row justify-between items-center">
        <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">
          {nft.chainName}
        </span>
        <p className="flex gap-1">
          {nft.contractAddress?.slice(0, 6)}...
          {nft.contractAddress?.slice(-4)}
          {isContractAddressCopied === key ? (
            <FaCheck className="ml-1 mt-1 text-green-500 cursor-pointer" />
          ) : (
            <FaRegCopy
              onClick={() => handleCopyAddress(key)}
              className="ml-1 mt-1 cursor-pointer"
              data-tip="Copy Address"
              data-tip-content=".tooltip"
            />
          )}
        </p>
      </div>
      {/* Divider */}
      <div>
        <hr className="my-1 mx-6 border-gray-200 dark:border-gray-600" />
      </div>
      {/* NFT Content */}
      <div className="flex flex-col lg:flex-row my-2 mx-5 gap-3">
        <div className="w-full lg:w-5/12">
          <img
            className="w-full h-36 object-cover rounded-xl py-2"
            src={nft.imageUrl}
            alt={nft.name}
          />
        </div>
        <div className="lg:w-full xl:w-1/2 flex flex-col gap-1">
          <h2 className="text-md font-bold">{nft.name}</h2>
          <div className="text-sm flex justify-between">
            <p className="text-sm">Token ID:</p>
            <p>{nft.tokenId}</p>
          </div>
          <div className="text-sm flex justify-between">
            <p className="text-sm">Token Standard:</p>
            <p>{nft.tokenType}</p>
          </div>
          <div className="text-sm flex justify-between">
            <p className="text-sm">Price:</p>
            <span className="flex flex-col">
              {nft?.floorPrice === null ? (
                <p>Price Not Found</p>
              ) : (
                <>
                  <p>
                    {Number(nft?.floorPrice).toFixed(4)} {nft?.priceCurrency}{" "}
                    ETH
                  </p>
                  <p>
                    {Number(nft?.floorPriceUsd).toFixed(2)} USD
                  </p>
                </>
              )}
            </span>
          </div>
          <div className="text-sm flex justify-between">
            <p className="text-sm">Last Updated:</p>
            <p>{moment(nft.timeLastUpdated).format("DD-MM-YY")}</p>
          </div>
        </div>
      </div>
      {/* Socket Button */}
      <div className="flex justify-end mt-1 mx-2 py-1 ">
        <button className="w-full md:w-32 bg-blue-400 p-2 rounded-lg text-white hover:text-blue-900">
          Socket
        </button>
      </div>
    </div>
  );
};

export default ModalNFTCard;