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
      { params: { walletAddress } }
    );
    return response.data; // Vanity address found
  } catch (error: any) {
    if (error.response?.status === 404) {
      // Specific handling for 404 - No vanity address found
      return { message: "No vanity address found for this wallet" };
    } else if (error.code === "ERR_NETWORK") {
      // Handle network errors
      return {
        AxiosError: {
          code: error.code,
          message: "Network error: Please check your internet connection.",
        },
      };
    } else {
      // Handle other errors
      return {
        AxiosError: {
          code: error.response?.status || "ERR_UNKNOWN",
          message: error.message || "An unexpected error occurred.",
        },
      };
    }
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
      console.log("generate vanity wallet Details:",response.data);
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
  vanityAccountType: string
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
    console.log(" store VanityWallet response:", response);
    return response.data;
  } catch (error) {
    console.error("Error storing vanity wallet:", error);
    return null;
  }
};

// Function to Delete specific vanity Details from wallet
export const deleteVanityAddress = async (
  walletAddress: string,
  vanityAddressToDelete: string
) => {
  try {
    const response: any = await axios.delete(
      `${server_api_base_url}/api/vanity/deleteVanityAddress/${walletAddress}/${vanityAddressToDelete}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting content detail:", error);
    return null;
  }
};
