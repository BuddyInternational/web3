import React, { useState } from "react";
import { NFTData } from "../../../utils/Types";
import { FaCheck } from "react-icons/fa";
import { FaRegCopy } from "react-icons/fa6";
import moment from "moment";
import { ethers } from "ethers";
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import nftMarketAbi from "../../../artifacts/contracts/NFTMarket.sol/NFTMarket.json";
import { useVanityContext } from "../../../context/VanityContext";
import { ERC1155ABI, ERC721ABI } from "../../../utils/ABI";

const ModalNFTCard: React.FC<{ nft: NFTData; key: number }> = ({
  nft,
  key,
}) => {
  const [isContractAddressCopied, setIsContractAddressCopied] =
    useState<number>(-1);
  const [isTokenIdCopied, setIsTokenIdCopied] = useState<number>(-1);
  const { walletProvider } = useWeb3ModalProvider();
  const { vanityAddress } = useVanityContext();
  const nftMarketContractAddress: string | undefined =
    process.env.REACT_APP_NFT_MARKET_CONTRACT_ADDRESS;

  // Convert image url
  const convertIpfsUrl = (imageUrl: string) => {
    if (imageUrl.startsWith("ipfs://")) {
      const ipfsHash = imageUrl.slice(7);
      const newImageUrl = `https://ipfs.moralis.io:2053/ipfs/${ipfsHash}`;
      return newImageUrl;
    }
    return imageUrl;
  };
  // Handle copy nft contract address
  const handleCopyAddress = (index: number) => {
    navigator.clipboard.writeText(nft.contractAddress || "");
    setIsContractAddressCopied(index);
    setTimeout(() => {
      setIsContractAddressCopied(-1);
    }, 1000);
  };

  // Handle copy tokenId
  const handleCopyTokenID = (index: number) => {
    navigator.clipboard.writeText(nft?.tokenId || "");
    setIsTokenIdCopied(index);
    setTimeout(() => {
      setIsTokenIdCopied(-1);
    }, 1000);
  };

  // handle socket button click
  const handleButtonClick = async (nftData: NFTData) => {
    console.log("NFT Data:", nftData);
    if (typeof window.ethereum === "undefined") {
      console.error(
        "Ethereum provider is not available. Make sure to install a Web3 wallet like MetaMask."
      );
      // setLoading(false);
      return;
    }
    const ethersProvider = new ethers.BrowserProvider(
      walletProvider as ethers.Eip1193Provider
    );
    const signer = await ethersProvider.getSigner();
    console.log("signer-------------", signer);
    const nftMarketContract = new ethers.Contract(
      nftMarketContractAddress!,
      nftMarketAbi.abi,
      signer
    );
    // setLoading(true);
    try {
      const tokenStandard: string | undefined = nftData.tokenType;
      // Approve the NFT to the smart contract
      if (tokenStandard === "ERC721") {
        console.log("Approving ERC721 NFT...");
        const nftContract = new ethers.Contract(
          nftData.contractAddress!,
          ERC721ABI,
          signer
        );
        console.log("-----------1");
        const approvalTx = await nftContract.approve(
          nftMarketContractAddress,
          nftData.tokenId
        );
        console.log("Approval transaction sent:", approvalTx);
        await approvalTx.wait();
        console.log("Approval transaction confirmed:", approvalTx.hash);
      } else if (tokenStandard === "ERC1155") {
        console.log("Approving ERC1155 NFT...");
        const nftContract = new ethers.Contract(
          nftData.contractAddress!,
          ERC1155ABI,
          signer
        );
        console.log("-----------2");
        const approvalTx = await nftContract.setApprovalForAll(
          nftMarketContractAddress,
          true
        );
        console.log("Approval transaction sent:", approvalTx);
        await approvalTx.wait();
        console.log("Approval transaction confirmed:", approvalTx.hash);
      } else {
        console.error("Invalid token standard:", nftData.tokenType);
        return;
      }

      // Call the transferNFTtoVanityAddress function
      const tx = await nftMarketContract.transferNFTtoVanityAddress(
        vanityAddress,
        nftData.contractAddress,
        nftData.tokenId,
        nftData.tokenType
      );
      console.log("Transaction sent:", tx);
      // Wait for the transaction to be confirmed
      await tx.wait();
      console.log("Transaction confirmed:", tx.hash);
    } catch (error) {
      console.error("Error executing transaction:", error);
    } finally {
      // setLoading(false);
      // onClose();
    }
  };

  return (
    <div className="max-w-screen sm:w-auto md:w-auto mx-2 my-4 p-2 border border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      {/* Chain and NFT Address */}
      <div className="p-2 mx-5 text-sm flex sm:flex-col md:flex-row gap-2 justify-between items-center">
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
        <hr className="my-1 mx-6 border-gray-200 " />
      </div>
      {/* NFT Content */}
      <div className="flex flex-col lg:flex-row my-2 mx-5 gap-4">
        <div className="w-full lg:w-5/12">
          {/* <img
            className="w-full h-40 object-cover rounded-xl py-2 hover:scale-105 transition duration-300 ease-in-out"
            src={nft.imageUrl}
            alt={nft.name}
          /> */}
          {nft.imageUrl !== undefined ? (
            nft.mediaType === "video/mp4" ? (
              <video
                className="h-48 w-full object-cover rounded-xl py-2 hover:scale-105 transition duration-300 ease-in-out"
                controls
                src={convertIpfsUrl(nft.imageUrl)}
              />
            ) : (
              <>
                <img
                  className="h-48 w-full object-cover rounded-xl py-2 hover:scale-110 transition duration-300 ease-in-out"
                  src={convertIpfsUrl(nft.imageUrl)}
                  alt={nft.name || "NFT"}
                />
              </>
            )
          ) : (
            <img
              className="h-48 w-full object-cover rounded-xl py-2 hover:scale-110 transition duration-300 ease-in-out"
              src="/blank_nft.png"
              alt="NFT not found"
            />
          )}
        </div>
        <div className="w-full xl:w-1/2 flex flex-col gap-1">
          <h2 className="text-md font-bold">{nft.name}</h2>
          <div className="text-sm flex justify-between">
            <p className="text-sm">Token ID:</p>
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
                {isTokenIdCopied === key ? (
                  <FaCheck className="mt-0.5 text-green-500 cursor-pointer" />
                ) : (
                  <FaRegCopy
                    onClick={() => handleCopyTokenID(key)}
                    className="mt-0.5 cursor-pointer"
                    data-tip="Copy Token ID"
                    data-tip-content=".tooltip"
                  />
                )}
              </p>
            </span>
          </div>
          <div className="text-sm flex justify-between">
            <p className="">Token Standard:</p>
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
                  <p>{Number(nft?.floorPriceUsd).toFixed(2)} USD</p>
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
        <button
          className="w-full md:w-32 bg-blue-400 p-2 rounded-lg text-white hover:text-blue-900"
          onClick={() => handleButtonClick(nft)}
        >
          Socket
        </button>
      </div>
    </div>
  );
};

export default ModalNFTCard;
