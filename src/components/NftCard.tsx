import moment from 'moment';
import React, { useState } from 'react';
import { FaCopy } from 'react-icons/fa';
import { NFTData } from '../utils/Types';

const NftCard: React.FC<{ NFTDetails: NFTData[] }> = ({ NFTDetails }) => {

  // const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (index: number) => {
    navigator.clipboard.writeText(NFTDetails[index]?.contractAddress || ''); 
    // setIsCopied(true);
    // setTimeout(() => setIsCopied(false), 5000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
      {NFTDetails?.map((nft, index) => (
          <div className="relative flex flex-col my-6 bg-white shadow-sm border border-slate-200 rounded-lg w-full">
            <div className="p-3 mt-2 text-sm flex flex-column justify-between">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-1 rounded dark:bg-blue-900 dark:text-blue-300">{nft.chainName}</span>
              <p className="flex gap-1">
                {nft.contractAddress?.slice(0, 6)}...
                {nft.contractAddress?.slice(-4)}
                <FaCopy onClick={() => handleCopy(index)} className="ml-1 mt-1 cursor-pointer" />
              </p>
            </div>
            <div className="relative h-44 m-1.5 overflow-hidden text-white rounded-xl">
                {nft.imageUrl !== undefined ?  <img src={nft.imageUrl} alt="NFT image" /> :  <img src ="/blank_nft.png" alt="NFT image" /> }
            </div>
            <div className="p-2">
              <h6 className="mb-4 text-slate-800 text-xl font-semibold">
                {nft.name !== undefined ? nft.name : "---" }
              </h6>

              <div className="mb-2 text-sm flex flex-column justify-between">
                <p className="text-sm">Token ID   </p>
                <p className="">{nft.tokenId}</p>
              </div>

              <div className="mb-2 text-sm flex flex-column justify-between">
                <p className="text-sm">Token Standard  </p>
                <p className="">{nft.tokenType}</p>
              </div>

              <div className="mb-2 text-sm flex flex-column justify-between">
                <p className="text-sm">OpenSea Price  </p>
                <span className='flex  gap-2'>
                 {nft.floorPrices?.openSea?.floorPrice === 0
                    ? 'Not Listed'
                    : `${nft.floorPrices?.openSea?.floorPrice} ${nft.floorPrices?.openSea?.priceCurrency}`}
                </span>
              </div>

              <div className="mb-2 text-sm flex flex-column justify-between">
                <p className="text-sm">LooksRare Price </p>
                <span className='flex  gap-2'>
                  {""}
                  {nft.floorPrices?.looksRare?.floorPrice === 0
                    ? 'Not Listed'
                    : `${nft.floorPrices?.looksRare?.floorPrice}  ${nft.floorPrices?.looksRare?.priceCurrency}`}
                </span>
              </div>

              <div className="mb-2 text-sm flex flex-column justify-between">
                <p className="text-sm">Last Updated  </p>
                <p className="">{moment(nft.timeLastUpdated).format('DD-MM-YY')}</p>
              </div>

            </div>
          </div>
      ))}
    </div>
  );
};

export default NftCard;