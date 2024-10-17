import axios, { AxiosResponse } from "axios";

// Define NFT interface
interface NFTDetails {
  nftAddress?: string;
  name?: string;
  chainName?: string;
  mediaType?: string;
  imageUrl?: string;
  tokenId?: string;
}

// Define Response interfaces
interface SaveSocketNFTResponse {
  message: string;
  socketNFT?: any;
}

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// Function to save Socket NFT detail and update last transfer
export const saveSocketNFTAndUpdateLastTransfer = async (
  walletAddress: string,
  vanityAddress: string,
  nft: NFTDetails
): Promise<SaveSocketNFTResponse | null> => {
  try {
    const response: AxiosResponse<SaveSocketNFTResponse> = await axios.post(
      `${server_api_base_url}/api/socket-nft/saveSocketNFTAndUpdateLastTransfer`,
      {
        walletAddress,
        vanityAddress,
        nft,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving Socket NFT:", error);
    return null;
  }
};

// Function to fetch the last transfer details of a socket NFT
export const getSocketNFTLastTransferDetails = async (
  vanityAddress: string
) => {
  try {
    const response: any = await axios.post(
      `${server_api_base_url}/api/socket-nft/getSocketNFTLastTransferDetails`,
      {
        vanityAddress,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching last transfer details:", error);
    return null;
  }
};
