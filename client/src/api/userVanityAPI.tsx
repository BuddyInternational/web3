import axios from "axios";

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// Function to check existing vanity address for user Mobile and Email
export const checkUserExistingVanityAddress = async (mobile?: string, email?: string) => {
    try {
      // Ensure only one of mobile or email is provided, not both
      if ((!mobile && !email) || (mobile && email)) {
        console.error("You must provide either mobile or email, but not both.");
        return null;
      }
  
      // Send the request to the backend API with either mobile or email
      const response: any = await axios.get(
        `${server_api_base_url}/api/user-vanity/checkUserVanityAddress`, // Correct endpoint
        {
          params: { mobile, email },
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

  // Function to store vanity details (either using mobile or email)
export const storeUserVanityWallet = async (
    mobile: string | undefined,
    email: string | undefined,
    vanityAddress: string,
    vanityPrivateKey: string,
    vanityAccountType: string
  ) => {
    try {
      // Validate that either mobile or email is provided, but not both
      if ((!mobile && !email) || (mobile && email)) {
        console.error("You must provide either mobile or email, but not both.");
        return null;
      }
  
      // Send the request to the backend API with mobile or email
      const response: any = await axios.post(
        `${server_api_base_url}/api/user-vanity/storeUserVanityWallet`,
        {
          mobile,
          email,
          vanityAddress,
          vanityPrivateKey,
          vanityAccountType,
        }
      );
  
      if (response) {
        console.log("Stored vanity details successfully:", response.data);
        return response.data; 
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error storing vanity wallet:", error);
      return null;
    }
  };

  // Function to log in the user
export const logInUser = async (logInContent?: string) => {
    try {
      // Ensure only one of mobile or email is provided, not both
      if (!logInContent) {
        console.error("You must provide either mobile or email, but not both.");
        return null;
      }
  
      // Send the request with either mobile or email
      const response = await axios.post(
        `${server_api_base_url}/api/user-vanity/logInUser`, 
        { logInContent }
      );

  
      if (response.status === 200) {
        return response.data.UserData; 
      } else {
        console.error("Login failed:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error logging in:", error);
      return null;
    }
  };

  // Function to log out the user
export const logOutUser = async (mobile?: string, email?: string) => {
    try {
      // Ensure only one of mobile or email is provided, not both
      if ((!mobile && !email) || (mobile && email)) {
        console.error("You must provide either mobile or email, but not both.");
        return null;
      }
  
      // Send the request with either mobile or email
      const response = await axios.post(
        `${server_api_base_url}/api/user-vanity/logOutUser`, 
        { mobile, email }
      );
      if (response.status === 200) {
        return response.data.UserData; 
      } else {
        console.error("Logout failed:", response.data.message);
        return null;
      }
    } catch (error) {
      console.error("Error logging out:", error);
      return null;
    }
  };
  
  