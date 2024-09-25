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
      answer?: { first: string; last: string };
    };
  };
}
