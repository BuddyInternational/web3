import axios, { AxiosResponse } from "axios";
import { ScreenWriteContentSubmission } from "../utils/Types";

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// Define Response interfaces
interface SaveScreenWriteContentResponse {
  message: string;
  contentData: any;
}

// Function to save screen write content details
export const saveScreenWriteContentDetails = async (
  walletAddress: string,
  vanityAddress: string,
  contentDetails: ScreenWriteContentSubmission
): Promise<SaveScreenWriteContentResponse | null> => {
  try {
    const response: AxiosResponse<SaveScreenWriteContentResponse> = await axios.post(
      `${server_api_base_url}/api/screenWrite-content/saveScreenWriteContent`,
      {
        walletAddress,
        vanityAddress,
        contentDetails,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving Screen Write Content Details:", error);
    return null;
  }
};

// Function to fetch the Screen Write Content Details
export const getScreenWriteContent = async (vanityAddress: string) => {
    try {
      const response: any = await axios.get(
        `${server_api_base_url}/api/screenWrite-content/getScreenWriteContent`,
        {
          params: { vanityAddress },
        }
      );
      if(response){
        return response.data;
      }
      else{
        return null;
      }
    } catch (error) {
      console.error("Error fetching Screen Write Content details:", error);
      return null;
    }
  };

// Function to Delete the Screen Write Content Details
export const deleteScreenWriteContent = async (walletAddress: string,ipfsHash:string) => {
    try {
      const response:any = await axios.delete(
        `${server_api_base_url}/api/screenWrite-content/deleteScreenWriteContentDetail/${walletAddress}/${ipfsHash}`
      );
      return response.data;
    } catch (error) {
      console.error("Error deleting screen Write content detail:", error);
      return null;
    }
  }

// Function to update a specific screen write content details
export const updateScreenWriteContentDetail = async (
    walletAddress: string,
    ipfsHash: string,
    isSubbmited: boolean,
    submissionDate: string,
    submissionHash: string,
    chainId: number,
  ) => {
    try {
      const response: any = await axios.put(
        `${server_api_base_url}/api/screenWrite-content/updateScreenWriteContentDetail/${walletAddress}/${ipfsHash}`,
        {
          isSubbmited,
          submissionDate,
          submissionHash,
          chainId,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating Screen Write content detail:", error);
      return null;
    }
  };

// Function to update a wallet address because vanity Details transfer
export const updateVanityScreenWriteContentWalletForVanityTransfer = async (
    vanityAddress: string,
    newWalletAddress: string
  ) => {
    try {
      const response: any = await axios.put(
        `${server_api_base_url}/api/screenWrite-content/updateVanityScreenWriteContentWalletForVanityTransfer`,
        {
          vanityAddress,
          newWalletAddress,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating wallet address:", error);
      return null;
    }
  };