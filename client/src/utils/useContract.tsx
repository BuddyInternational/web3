import React from "react";
import { ethers } from "ethers";
import nftMarketAbi from "../artifacts/contracts/NFTMarket.sol/NFTMarket.json"; 

// Contract Address
const NFTEthereumContractAddress = process.env.REACT_APP_NFT_MARKET_CONTRACT_ADDRESS_ETHEREUM!;
const NFTPolygonContractAddress = process.env.REACT_APP_NFT_MARKET_CONTRACT_ADDRESS_POLYGON!;

const useContract = () => {
  const getContract = async (
    walletProvider: ethers.Eip1193Provider,
    chainId: number
  ) => {
    try {
      const provider = new ethers.BrowserProvider(walletProvider);
      const signer = await provider.getSigner();

      // Define contract addresses based on chainId
      const contractAddress =
        chainId === 1
          ? NFTEthereumContractAddress 
          : NFTPolygonContractAddress; 

      // Instantiate the contract
      return new ethers.Contract(contractAddress, nftMarketAbi.abi, signer);
    } catch (error) {
      console.error("Failed to get contract:", error);
      throw new Error("Unable to create contract instance.");
    }
  };

  return { getContract };
};

export default useContract;
