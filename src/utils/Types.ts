export interface NFTData {
    chainName?: string;
    contractAddress?: string;
    tokenId?: string;
    name?: string;
    description?: string;
    tokenType?: string;
    tokenUri?: string;
    imageUrl?: string;
    timeLastUpdated?: string;
    floorPrices?: {
      looksRare?: {
        floorPrice: number;
        priceCurrency: string;
      };
      openSea?: {
        floorPrice: number;
        priceCurrency: string;
      };
    };
  }