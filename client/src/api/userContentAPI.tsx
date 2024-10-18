import axios, { AxiosResponse } from "axios";

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// Define Content interface
interface ContentDetails {
  mood: string;
  content?: string;
  ipfsHash?: string;
  generateContentDate: string;
}

// Define Response interfaces
interface SaveUserContentResponse {
  message: string;
  contentData: any;
}

// Function to save user content details
export const saveContentDetails = async (
  walletAddress: string,
  vanityAddress: string,
  contentDetails: ContentDetails
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
export const getUserContent = async (walletAddress: string) => {
  try {
    const response: any = await axios.get(
      `${server_api_base_url}/api/user-content/getUserContent`,
      {
        params: { walletAddress },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user Content details:", error);
    return null;
  }
};
