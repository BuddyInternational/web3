import axios, { AxiosResponse } from "axios";
import { ContentSubmission } from "../utils/Types";

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// Define Response interfaces
interface SaveUserContentResponse {
  message: string;
  contentData: any;
}

// Function to save user content details
export const saveContentDetails = async (
  walletAddress: string,
  vanityAddress: string,
  contentDetails: ContentSubmission
): Promise<SaveUserContentResponse | null> => {
  try {
    const response: AxiosResponse<SaveUserContentResponse> = await axios.post(
      `${server_api_base_url}/api/user-content/saveUserContent`,
      {
        walletAddress,
        vanityAddress,
        contentDetails,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving User Generated Content:", error);
    return null;
  }
};

// Function to fetch the User Content
export const getUserContent = async (vanityAddress: string) => {
  try {
    const response: any = await axios.get(
      `${server_api_base_url}/api/user-content/getUserContent`,
      {
        params: { vanityAddress },
      }
    );
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching user Content details:", error);
    return null;
  }
};

// Function to Delete the User Content
export const deleteUserContent = async (
  walletAddress: string,
  ipfsHash: string
) => {
  try {
    const response: any = await axios.delete(
      `${server_api_base_url}/api/user-content/deleteContentDetail/${walletAddress}/${ipfsHash}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting content detail:", error);
    return null;
  }
};

// Function to update a specific content detail
export const updateContentDetail = async (
  walletAddress: string,
  ipfsHash: string,
  isSubbmited: boolean,
  submissionDate: string,
  submissionHash: string
) => {
  try {
    const response: any = await axios.put(
      `${server_api_base_url}/api/user-content/updateContentDetail/${walletAddress}/${ipfsHash}`,
      {
        isSubbmited,
        submissionDate,
        submissionHash,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating content detail:", error);
    return null;
  }
};

// Function to update a wallet address because vanity Details transfer
export const updateVanityUserContentWalletForVanityTransfer = async (
  vanityAddress: string,
  newWalletAddress: string
) => {
  try {
    const response: any = await axios.put(
      `${server_api_base_url}/api/user-content/updateVanityUserContentWalletForVanityTransfer`,
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
