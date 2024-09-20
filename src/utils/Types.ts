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