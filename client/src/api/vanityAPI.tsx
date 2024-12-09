import axios, { AxiosResponse } from "axios";

interface GenerateVanityResponse {
  data: string[];
  message: string;
}

interface GenerateVanityWalletResponse {
  success: boolean;
  data: Array<{ address: string; privKey: string }>;
  message: string;
}

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

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

// Function to check existing vanity address
export const checkExistingVanityAddress = async (walletAddress: string) => {
  try {
    const response: any = await axios.get(
      `${server_api_base_url}/api/vanity/checkVanityAddress`,
      {
        params: { walletAddress },
      }
    );
    if (response) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error checking existing vanity address:", error);
    return null;
  }
};

// Generate the vanityWallet
export const generateVanityWallet = async (
  suffix: string,
  count: number = 1
): Promise<GenerateVanityWalletResponse | null> => {
  try {
    const response: AxiosResponse<GenerateVanityWalletResponse> =
      await axios.post(
        `${server_api_base_url}/api/vanity/generateVanityWallet`,
        { suffix, count }
      );
    return response.data;
  } catch (error) {
    console.error("Error generating vanity wallet:", error);
    return null;
  }
};

// Store vanity Data
export const storeVanityWallet = async (
  walletAddress: string,
  vanityAddress: string,
  vanityPrivateKey: string,
  vanityAccountType: string,
) => {
  try {
    const response = await axios.post(
      `${server_api_base_url}/api/vanity/storeVanityWallet`,
      {
        walletAddress,
        vanityAddress,
        vanityPrivateKey,
        vanityAccountType,
      }
    );
    // console.log(" store VanityWallet response:", response);
    return response.data;
  } catch (error) {
    console.error("Error storing vanity wallet:", error);
    return null;
  }
};

// Function to Delete specific vanity Details from wallet
export const deleteVanityAddress = async (walletAddress: string,vanityAddressToDelete:string) => {
  try {
    const response:any = await axios.delete(
      `${server_api_base_url}/api/vanity/deleteVanityAddress/${walletAddress}/${vanityAddressToDelete}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting content detail:", error);
    return null;
  }
}