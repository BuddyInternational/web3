import axios from "axios";

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

// export const saveNFTDetails = async (nftData: {
//   walletAddress: string;
//   vanityAddress: string;
//   nftAddress: string;
//   nftName: string;
//   chainName: string;
//   imageUri: string;
//   tokenId: string;
//   tokenType: string;
//   priceInEther: number;
//   priceInUSD: number;
//   lastclaimedAt: Date;
//   totalClaimedRewardCount: number;
//   totalClaimedRewardHash: string;
// }) => {
//   try {
//     const response = await axios.post(
//       `${server_api_base_url}/api/nft/saveNftDetails`,
//       nftData
//     );
//     console.log("nft details response================", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error Saving NFT details:", error);
//     return null;
//   }
// };

// Function to save NFT details
// export const saveNFTDetails = async (nfts: any[], walletAddress: string, vanityAddress: string) => {
//   try {
//     const response = await axios.post(`${server_api_base_url}/api/nft/`, { nfts, walletAddress, vanityAddress });
//     return response.data; // Return the response data
//   } catch (error) {
//     throw new Error(error.response?.data?.error || 'Error saving NFT details');
//   }
// };
