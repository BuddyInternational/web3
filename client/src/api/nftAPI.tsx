import axios from "axios";
import { NFTDetails } from "../utils/Types";

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// Function to save NFT details
export const saveNFTDetails = async (
  nft: NFTDetails,
  walletAddress: string,
  vanityAddress: string
) => {
  try {
    const response = await axios.post(
      `${server_api_base_url}/api/nft/saveNftDetails`,
      { nft, walletAddress, vanityAddress }
    );
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error(
      "Error saving NFT details:",
      error.response?.data?.error || error.message
    );
    return null;
  }
};

// Function to fetch NFT details
export const getNFTDetails = async (walletAddress: string) => {
  try {
    const response = await axios.get(
      `${server_api_base_url}/api/nft/getNFTDetails/${walletAddress}`
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching NFT details:",
      error.response?.data?.message || error.message
    );
    return null;
  }
};

// Function to update NFT claim details
export const updateNFTClaimDetails = async (
  walletAddress: string,
  tokenId: string,
  contractAddress: string,
  lastclaimedAt: Date,
  totalClaimedRewardHash: string[]
) => {
  try {
    const response = await axios.post(
      `${server_api_base_url}/api/nft/updateNftClaimDetails`,
      {
        walletAddress,
        tokenId,
        contractAddress,
        lastclaimedAt,
        totalClaimedRewardHash,
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Error updating NFT claim details:",
      error.response?.data?.error || error.message
    );
    return null;
  }
};

// Function to get Claim Details
export const getClaimDetails = async (
  walletAddress: string,
  tokenId: string,
  contractAddress: string
) => {
  try {
    const response = await axios.get(
      `${server_api_base_url}/api/nft/getNFTClaimDetails/${walletAddress}/${tokenId}/${contractAddress}`
    );
    // console.log("response-------------", response);
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (error: any) {
    console.error("Error fetching claim details:", error);
  }
};
