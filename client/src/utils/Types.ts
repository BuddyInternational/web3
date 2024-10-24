export interface NFTData {
  chainName?: string;
  contractAddress?: string;
  tokenId?: any;
  name?: string;
  tokenType?: string;
  tokenUri?: string;
  imageUrl?: string;
  mediaType?: any;
  timeLastUpdated?: string;
  floorPrice?: number | null;
  floorPriceUsd?: number;
  priceCurrency?: string | null;
}

export interface Submission {
  id: string;
  form_id: string;
  ip: string;
  created_at: string;
  status: string;
  new: number;
  flag: number;
  notes: string;
  updated_at: string | null;
  answers: {
    [key: string]: {
      name: string;
      order: number;
      text: string;
      type: string;
      answer?: string | { first: string; last: string };
    };
  };
}

// Define NFT interface for save details in Database
export interface NFTDetails {
  chainName?: string;
  contractAddress?: string;
  tokenId?: any;
  name?: string;
  tokenType?: string;
  tokenUri?: string;
  imageUrl?: string;
  mediaType?: any;
  timeLastUpdated?: string;
  floorPrice?: number | null;
  floorPriceUsd?: number;
  priceCurrency?: string | null;
  lastclaimedAt: Date | null;
  totalClaimedRewardCount: number;
  totalClaimedRewardHash: string[];
}

export interface ContentSubmission {
  mood: string;
  content: string;
  ipfsHash?: string;
  generateContentDate: string;
  submissionHash: string;
  isSubbmited: boolean;
  submissionDate: string;
}
