import {
  Box,
  DialogContent,
  DialogTitle,
  Fade,
  IconButton,
  Modal,
} from "@mui/material";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { NFTData } from "../../../utils/Types";
import ModalNFTCard from "../card/ModalNFTCard";
import CardChainFilterMenus from "../card/CardChainFilterMenus";

const nftData: NFTData[] = [
  {
    chainName: "Ethereum",
    contractAddress: "0xfefc20ba3d59431044b9f4a943b132cd99235b1c",
    tokenId: "496",
    name: "Subscription",
    tokenType: "ERC721",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/Qmec6kdRt5uYhqhTPtrfBZ4PjUkwNNT4sPZWNqjdBr1DEA/496.json",
    imageUrl: "ipfs://Qmb46UGAwX4aZNUNgBGt2bBVGgP2rQ6xhvMXanEzRVVBfY",
    mediaType: "video/mp4",
    timeLastUpdated: "2024-10-15T10:39:53.907Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Ethereum",
    contractAddress: "0xfe43c34b84aeb62172de931b9a0f219a187a7a3a",
    tokenId: "191",
    name: "Genie : Genesis",
    tokenType: "ERC1155",
    tokenUri: "https://www.genmarket.app/ipfs/191",
    imageUrl: "https://arweave.net/Df3J1PikpMqTD9uWuC6579L3yAgiZTr10OfCTfy6eyE",
    mediaType: "image/png",
    timeLastUpdated: "2024-10-15T10:31:29.681Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Ethereum",
    contractAddress: "0xfd2b5dc2ca033fa42af1c161966b9a9711494641",
    tokenId: "5719",
    name: "NIFE WARS COMICS",
    tokenType: "ERC721",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/QmfKhCuHNMjRy3ssKG5b7FYxJ3dRpRSySR9yNn7oEvUE2A/5719",
    imageUrl:
      "https://moccasin-bright-cricket-465.mypinata.cloud/ipfs/QmeFYtihBKf11yzZGMqXaq3Vs3Lb8EG66GNpqwD9Jos4Ac/1338.png",
    mediaType: "image/png",
    timeLastUpdated: "2024-10-15T10:39:53.932Z",
    floorPrice: 0.042899,
    floorPriceUsd: 100.727,
  },
  {
    chainName: "Ethereum",
    contractAddress: "0xf24725072ba2269b361b8de18335e431c460fce4",
    tokenId: "7",
    name: "OnCyber Block",
    tokenType: "ERC1155",
    tokenUri: "/7",
    timeLastUpdated: "2024-10-15T10:31:29.674Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Ethereum",
    contractAddress: "0xf055503fbb25c4b62cd9b46c6e5a3e8394345466",
    tokenId: "267",
    name: "Secret Diverse Lab",
    tokenType: "ERC1155",
    tokenUri: "https://divpic.xyz/ipfs/267",
    imageUrl: "ipfs://QmVGnEA1hF9TBMA5m8p7T7UHbTX3fRWshofdc29rp1He16/361.png",
    timeLastUpdated: "2024-10-15T10:31:29.667Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Polygon",
    contractAddress: "0xfe402a02a0b054332bd5a15d2bbebe6c39debe35",
    tokenId: "603",
    name: "BitCase FreeSpin Vouchers",
    tokenType: "ERC1155",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/bafybeicjqjfmayhcd6gwrpc7sehkex56d3oto46uhdoydtu4zlrr7lpozq/603.json",
    imageUrl:
      "ipfs://bafybeig5gkp2jb6bendvhxohnkui6po7omxesen5xfvo5enpvofwglpeom/bitcase.png",
    mediaType: "image/png",
    timeLastUpdated: "2024-10-15T10:39:53.764Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Polygon",
    contractAddress: "0xfe3f4cdeb12eedd23d53bad4eef2ab9542523751",
    tokenId: "0",
    name: "$2000 ETH",
    tokenType: "ERC1155",
    tokenUri:
      "https://etherbycb.com/metadata_cb%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500%252500",
    imageUrl: "https://etherbycb.com/image.png",
    timeLastUpdated: "2024-10-15T10:31:29.793Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Polygon",
    contractAddress: "0xfe3e74c9745b2117aeb1e4365d150d04c7b76eb4",
    tokenId: "420",
    name: "10 Collection",
    tokenType: "ERC721",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/QmU1rw6bsJzjhzNATwGtmcDqZ2McJUvLn2nawC1BqcUtb8?filename=sa768.png",
    timeLastUpdated: "2024-10-15T10:31:29.877Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Polygon",
    contractAddress: "0xfe2b8975267f4d54142415874cec29ec93eec402",
    tokenId: "1",
    name: "$3000 USDT Airdrop",
    tokenType: "ERC1155",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/bafybeibflgxatvbr2dwe4py5k3a7xv7conzytx6xf47ztt46w7hq6eycue/token.json",
    imageUrl:
      "ipfs://bafybeiewyxleubryqjooz76xrny4vg2jw373uj4wxr4xict275rcg7pv7u/logo.png",
    mediaType: "image/png",
    timeLastUpdated: "2024-10-15T10:39:53.767Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Polygon",
    contractAddress: "0xfe2396690c36ad63ef5d08afd30b1e1caa4de13b",
    tokenId: "1",
    name: "1ETH Reward at web3eth.lol 🎁 ",
    tokenType: "ERC1155",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/QmU5JikBUXGg3qeCjioKvGtC8DVZ9uxFPrciyeJ7sPmEYF",
    imageUrl:
      "https://coral-delicate-lobster-984.mypinata.cloud/ipfs/QmTd1UYxQmFxFL96fNU9ywSzEWuBmukotyaLc2sS96vkuQ",
    mediaType: "image/jpeg",
    timeLastUpdated: "2024-10-15T10:39:53.768Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Arbitrum",
    contractAddress: "0xba6ffa42c0581814a4a69219841433af9cdce4f3",
    tokenId: "1",
    name: "null",
    tokenType: "ERC1155",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/QmdGtFiBptw8HNDCmGhwwq5C3Pu2PmZESy1LFkASJUQ1Kx",
    imageUrl:
      "https://gateway.pinata.cloud/ipfs/QmdQek7ZUdcrQuNV55kdZWBUSVpzS5Jwcr5gVvoHoN82sn",
    timeLastUpdated: "2024-10-15T10:39:53.778Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Arbitrum",
    contractAddress: "0xb3a19533288a8f7073ba3b2bc0113104f0ad3248",
    tokenId: "1",
    name: "null",
    tokenType: "ERC1155",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/QmfKQ6p6YMw3WeKEtHWfH2jiCYu1JHLKos9BDsN7pHLnMk",
    imageUrl:
      "https://gateway.pinata.cloud/ipfs/QmZ9sfSqjk7teAx4ApKq7fp7XahN5K6SEapgo741u1qGRd",
    timeLastUpdated: "2024-10-15T10:39:53.782Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Arbitrum",
    contractAddress: "0x74c87cf2a2d4b298d7b92c4a586a39b616c5bf31",
    tokenId: "1",
    name: "Beep, beep! Vroom, vroom!",
    tokenType: "ERC1155",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/QmeMZuLEZQBbCzUjVSJ3mxjhWETSi7bj2pVFWQhkvD6exV/1.json",
    imageUrl: "ipfs://QmQmKv96Sp66oAsyYUVmDGTTSaCrnWtjcBaDwZuT4YBFZN",
    timeLastUpdated: "2024-10-15T10:39:53.773Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Arbitrum",
    contractAddress: "0x4ea511cccb53925e40124da297fde111831d8588",
    tokenId: "311",
    name: "APECOIN AIRDROP V5",
    tokenType: "ERC721",
    tokenUri:
      "https://ipfs.moralis.io:2053/ipfs/bafkreihjpmn35yemsdydl34bspz2qr3x6mlvmf6ue5tajnvkllgtd33cia",
    imageUrl:
      "ipfs://bafybeialnn5rbxyzlg2egkotyof3jpwcgmhcptzzsmxt47uoaxhqcm6uve",
    timeLastUpdated: "2024-10-15T10:39:53.787Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
  {
    chainName: "Arbitrum",
    contractAddress: "0x02bb77b22edc0e28c877b5105aa12b484468d655",
    tokenId: "21",
    name: "Camelot staking position NFT",
    tokenType: "ERC721",
    tokenUri: "null",
    timeLastUpdated: "2024-10-15T10:31:29.832Z",
    floorPrice: null,
    floorPriceUsd: 0,
  },
];

const SocketNFT: React.FC<{
  open: boolean;
  onClose: () => void;
  NFTDetails: NFTData[];
}> = ({ open, onClose, NFTDetails }) => {
  // console.log("NFTDetails--------------",NFTDetails);
  const [selectedChain, setSelectedChain] = useState<string>("All");
  // Get unique chains from NFTDetails
  const uniqueChains: string[] = Array.from(
    new Set(
      NFTDetails.map((nft) => nft.chainName).filter(
        (chain): chain is string => chain !== undefined
      )
    )
  );

  // Filter NFTs based on selected chain
  const filteredNFTDetails =
    selectedChain === "All"
      ? NFTDetails
      : NFTDetails.filter((nft) => nft.chainName === selectedChain);

  return (
    <Modal open={open} onClose={onClose}>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            // width: { xs: "70%", sm: "70%", md: "55%", lg: "45%", xl: "35%" },
            width: {
              xs: "99vw",
              sm: "80vw",
              md: "70vw",
              lg: "70vw",
              xl: "50vw",
            },
            maxHeight: "80%",
            overflowY: "auto",
            borderRadius: "8px",
            boxShadow: 3,
            p: 3,
          }}
        >
          <DialogTitle
            sx={{ m: 0, p: 2, textAlign: "center" }}
            id="customized-dialog-title"
          >
            Persona Socket NFT
          </DialogTitle>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={(theme) => ({
              position: "absolute",
              right: 16,
              top: 16,
              fontSize: "20px",
              border: "1px solid gray",
              borderRadius: "10px",
            })}
          >
            <IoClose />
          </IconButton>
          <DialogContent dividers>
            {/* Dropdown for filtering by chain */}
            <div className="flex justify-end sm: mb-1 md:mb-3 container mx-auto px-4 gap-2">
              <label
                htmlFor="chainSelect"
                className="text-md font-bold text-[#191818] sm:py-2 md:py-4 "
              >
                Filter by Chain:
              </label>
              <CardChainFilterMenus
                uniqueChains={uniqueChains}
                selectedChain={selectedChain}
                setSelectedChain={setSelectedChain}
                component="SocketNFT"
              />
            </div>
            {filteredNFTDetails.map((nft, index) => (
              <ModalNFTCard
                key={index}
                nft={nft}
              />
            ))}
          </DialogContent>
        </Box>
      </Fade>
    </Modal>
  );
};

export default SocketNFT;
