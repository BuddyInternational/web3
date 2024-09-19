export interface NFTData {
    chainName?: string;
    contractAddress?: string;
    tokenId?: any;
    name?: string;
    tokenType?: string;
    tokenUri?: string;
    imageUrl?: string;
    timeLastUpdated?: string;
    floorPrice?: number | null;
    floorPriceUsd?: number | null;
    priceCurrency?: string | null;
  }