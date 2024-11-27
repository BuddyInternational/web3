import axios, { AxiosResponse } from "axios";
import { StoryLineContentSubmission } from "../utils/Types";

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// Define Response interfaces
interface SaveStoryLineContentResponse {
  message: string;
  contentData: any;
}

// Function to save story content details
export const saveStoryLineContentDetails = async (
  walletAddress: string,
  vanityAddress: string,
  contentDetails: StoryLineContentSubmission
): Promise<SaveStoryLineContentResponse | null> => {
  try {
    const response: AxiosResponse<SaveStoryLineContentResponse> = await axios.post(
      `${server_api_base_url}/api/storyLine-content/saveStoryLineContent`,
      {
        walletAddress,
        vanityAddress,
        contentDetails,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error saving Story Line Content:", error);
    return null;
  }
};

// Function to fetch the Story Line Content
export const getStoryLineContent = async (walletAddress: string) => {
  try {
    const response: any = await axios.get(
      `${server_api_base_url}/api/storyLine-content/getStoryLineContent`,
      {
        params: { walletAddress },
      }
    );
    if(response){
      return response.data;
    }
    else{
      return null;
    }
  } catch (error) {
    console.error("Error fetching Story Line Content details:", error);
    return null;
  }
};

// Function to Delete the Story Line Content
export const deleteStoryLineContent = async (walletAddress: string,ipfsHash:string) => {
  try {
    const response:any = await axios.delete(
      `${server_api_base_url}/api/storyLine-content/deleteStoryLineContentDetail/${walletAddress}/${ipfsHash}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting story line content detail:", error);
    return null;
  }
}

// Function to update a specific story Line content detail
export const updateStoryLineContentDetail = async (
  walletAddress: string,
  ipfsHash: string,
  isSubbmited: boolean,
  submissionDate: string,
  submissionHash: string
) => {
  try {
    const response: any = await axios.put(
      `${server_api_base_url}/api/storyLine-content/updateStoryLineContentDetail/${walletAddress}/${ipfsHash}`,
      {
        isSubbmited,
        submissionDate,
        submissionHash
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating Story Line content detail:", error);
    return null;
  }
};


