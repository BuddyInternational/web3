import axios, { AxiosResponse } from "axios";

// Define interfaces for the response types
interface ExistingVanityResponse {
  message: string;
  vanityAddress: string;
  vanityPrivateKey: string;
}

interface GenerateVanityResponse {
  data: string[];
  message: string;
}

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// Function to check existing vanity address
export const checkExistingVanityAddress = async (
  walletAddress: string
): Promise<ExistingVanityResponse | null> => {
  try {
    const response: AxiosResponse<ExistingVanityResponse | null> =
      await axios.get(`${server_api_base_url}/api/vanity/checkVanityAddress`, {
        params: { walletAddress },
      });
      if(response){
        return response.data;
      }
      else{
        return null;
      }
  } catch (error) {
    console.error("Error checking existing vanity address:", error);
    return null;
  }
};

// Function to generate and save vanity address
export const generateAndSaveVanityAddress = async (
  suffix: string,
  walletAddress: string
): Promise<GenerateVanityResponse | null> => {
  try {
    console.log("server_api_base_url", server_api_base_url);
    const response: AxiosResponse<GenerateVanityResponse> = await axios.post(
      `${server_api_base_url}/api/vanity/generateAndStoreVanityAddress`,
      {
        suffix,
        walletAddress,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error generating vanity address:", error);
    return null;
  }
};
