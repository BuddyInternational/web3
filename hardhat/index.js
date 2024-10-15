const express = require("express");
const { ethers, parseEther } = require("ethers");
require("dotenv").config();
// const nftAbi = require('./artifacts/contracts/Simple721NFT.sol/Simple721NFT.json')
const cdeTokenAbi = require("./ignition/deployments/chain-11155111/artifacts/CDETokenModule#Token.json");
const timTokenAbi = require("./ignition/deployments/chain-11155111/artifacts/TIMTokenModule#Token.json");
const nftMarketAbi = require("./ignition/deployments/chain-11155111/artifacts/NFTMarketModule#NFTMarket.json");

const app = express();
const port = process.env.PORT || 4000;
console.log("port----------", port);
const provider = new ethers.JsonRpcProvider(process.env.INFURA_URL);
const wallet = new ethers.Wallet(process.env.NFT_PRIVATE_KEY, provider);

// Middleware to parse JSON requests
app.use(express.json());

// ************************************************* Token API  *********************************************
const cdeTokenContractAddress = process.env.CDE_TOKEN_CONTRACT_ADDRESS;
const cdeTokenContract = new ethers.Contract(
  cdeTokenContractAddress,
  cdeTokenAbi.abi,
  wallet
);

const timTokenContractAddress = process.env.TIM_TOKEN_CONTRACT_ADDRESS;
const timTokenContract = new ethers.Contract(
  timTokenContractAddress,
  timTokenAbi.abi,
  wallet
);

// API endpoint to approve an TIM token
app.post("/approvetimtoken", async (req, res) => {
  const { spenderAddress } = req.body;

  if (!spenderAddress) {
    return res.status(400).send("Missing required parameters.");
  }

  try {

    const totalSupply = await timTokenContract.totalSupply();
    console.log("totalSupply------------",totalSupply);
    const tx = await timTokenContract.approve(spenderAddress, totalSupply);
    res.json({ success: true, transactionHash: tx.hash , balance: totalSupply.toString(),});
  } catch (error) {
    console.error("Error approving token:", error);
    res.status(500).send("An error occurred while approving the token.");
  }
});

// API endpoint to check allowance an TIM token
app.post("/timtokenallowance", async (req, res) => {
  const { ownerAddress, spenderAddress } = req.body;

  if (!spenderAddress || !ownerAddress) {
    return res.status(400).send("Missing required parameters.");
  }

  try {
    const tx = await timTokenContract.allowance(ownerAddress, spenderAddress);
    console.log("tx---------------", tx);
    res.json({ success: true, transactionHash: tx.hash ,amount:tx.toString()});
  } catch (error) {
    console.error("Error check in allowance token:", error);
    res.status(500).send("An error occurred while approving the token.");
  }
});

// API endpoint to approve an CDE token
app.post("/approvecdetoken", async (req, res) => {
  const { spenderAddress } = req.body;

  if (!spenderAddress) {
    return res.status(400).send("Missing required parameters.");
  }

    // const nftContract = new ethers.Contract(
    //   "0x704C2fa2585214eD8F701464A792E289ae4eD420",
    //   nftMarketAbi.abi,
    //   wallet
    // );

    // let a = await nftContract.owner();

    //   console.log("owner--------",a);
    //   return;
  // //   const test = new ethers.Contract(a, tokenAbi.abi, wallet);

  try {
    // console.log("Spender Address: ", spenderAddress);
    const totalSupply = await cdeTokenContract.totalSupply();
    const tx = await cdeTokenContract.approve(spenderAddress, totalSupply);

    res.json({
      success: true,
      transactionHash: tx.hash,
      balance: totalSupply.toString(),
    });
  } catch (error) {
    console.error("Error approving token:", error);
    res.status(500).send("An error occurred while approving the token.");
  }
});

// API endpoint to check allowance an CDE token
app.post("/cdetokenallowance", async (req, res) => {
  const { ownerAddress, spenderAddress } = req.body;

  if (!spenderAddress || !ownerAddress) {
    return res.status(400).send("Missing required parameters.");
  }

  try {
    const tx = await cdeTokenContract.allowance(ownerAddress, spenderAddress);
    console.log("tx---------------", tx);
    res.json({ success: true, transactionHash: tx.hash ,amount:tx.toString()});
  } catch (error) {
    console.error("Error check in allowance token:", error);
    res.status(500).send("An error occurred while approving the token.");
  }
});


//trasfer token
app.post("/transferToken", async (req, res) => {
  const { toAddress, amount } = req.body;

  // Ensure toaddress is provided
  if (!toAddress) {
    return res.status(400).send("to address is required.");
  }
  // Ensure amount is provided
  if (!amount) {
    return res.status(400).send("amount is required.");
  }

  try {
    const transaction = await tokenContract.transfer(toAddress, amount);
    const receipt = await transaction.wait();
    console.log("receipt-----------", receipt);
    res.status(200).json({ transactionHash: receipt.transactionHash });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// check token balance
app.get("/tokenBalance/:userAddress", async (req, res) => {
  const { userAddress } = req.params;
  try {
    const userBalance = await tokenContract.balanceOf(userAddress);
    console.log("userBalance---------------------", userBalance.toString());
    res.status(200).json({ userBalance: userBalance.toString() });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//************************************************* NFT API ****************************************************

// const contractAddress = process.env.NFT_CONTRACT_ADDRESS;
// const nftContract = new ethers.Contract(contractAddress, nftAbi.abi, wallet);

// // Get Token Owner endpoint
// app.get('/owner/:tokenId', async (req, res) => {
//     const { tokenId } = req.params;
//     try {
//         const owner = await nftContract.ownerOf(tokenId);
//         res.status(200).json({ owner });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// // Get contract owner
// app.get('/getOwner',async(req,res)=>{
//     try {
//         const owner = await nftContract.owner();
//         console.log("owner-----------",owner);
//         res.status(200).json({ owner });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// })

// // Mint NFT endpoint
// app.post('/mint', async (req, res) => {
//     const { recipient } = req.body;

//     // Ensure recipient is provided
//     if (!recipient) {
//         return res.status(400).send('Recipient address is required.');
//     }

//     try {
//         const transaction = await nftContract.mintNFT(recipient);
//         const receipt = await transaction.wait();
//         res.status(200).json({ transactionHash: receipt.transactionHash });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });

// ********************************* NFT MARKET  *************************************
// const nftMarketContractAddress = process.env.NFT_MARKET_CONTRACT_ADDRESS;
// const nftMarketContract = new ethers.Contract(nftMarketContractAddress, nftMarketAbi.abi, wallet);

// // API to transfer NFT and pay
// app.post('/transferNFTAndPay', async (req, res) => {
//     const { vanityAddress, nftAddress, tokenId, tokenStandard, price } = req.body;
//     try {
//         const tx = await nftMarketContract.transferNFTAndPay(
//             vanityAddress,
//             nftAddress,
//             tokenId,
//             tokenStandard,
//             price
//         );
//         await tx.wait(); // Wait for the transaction to be mined
//         res.status(200).json({ transactionHash: tx.hash });
//     } catch (error) {
//         console.error('Error transferring NFT and paying:', error);
//         res.status(500).send(error.message);
//     }
// });

// Start the server
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
