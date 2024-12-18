import { ScreenWriteContentData } from "../models/ScreenWrite.js";
import { ScreenWriteContentCallLogData } from "../models/ScreenWriteContentCallLog.js";

//  save screen write content data
export const saveScreenWriteContent = async (req, res) => {
  try {
    const { walletAddress, vanityAddress, contentDetails } = req.body;

    console.log("contentDetails--------", contentDetails);
    let screenWriteContent = await ScreenWriteContentData.findOne({
      walletAddress,
      vanityAddress,
    });

    if (!screenWriteContent) {
      // Create new screen write content if it doesn't exist
      screenWriteContent = new ScreenWriteContentData({
        walletAddress,
        vanityAddress,
        contentDetails,
      });
    } else {
      // If screen write content already exists, update the content details
      screenWriteContent.contentDetails.push(contentDetails);
    }

    // Save the updated/created document to the database
    const savedContent = await screenWriteContent.save();
    return res.status(201).json({
      message: "Screen Write Content saved successfully!",
      contentData: savedContent,
    });
  } catch (error) {
    console.error("Error saving content:", error);
    return res.status(500).json({
      message: "Error saving content",
      error,
    });
  }
};

// fetch screen write content data by wallet address
export const getScreenWriteContent = async (req, res) => {
  try {
    const { vanityAddress } = req.query;

    // Fetch content data based on wallet address
    const screenWriteContent = await ScreenWriteContentData.findOne({
      vanityAddress,
    });
    if (screenWriteContent) {
      return res.status(200).json({
        message: "Screen Write Content fetched successfully!",
        data: screenWriteContent,
      });
    }
  } catch (error) {
    console.error("Error fetching content:", error);
    return res.status(500).json({
      message: "Error fetching content",
      error,
    });
  }
};

// Update specific screen write content detail
export const updateScreenWriteContentDetail = async (req, res) => {
    try {
      const { walletAddress, ipfsHash } = req.params;
      const { isSubbmited, submissionDate, submissionHash,chainId } = req.body;
  
      // Find the screen write content by wallet address
      const screenWriteContent = await ScreenWriteContentData.findOne({
        walletAddress,
      });
  
      if (!screenWriteContent) {
        return res.status(404).json({
          message: "Content not found for this wallet address",
        });
      }
  
      // Find the content detail and update using ipfsHash
      const contentDetail = screenWriteContent.contentDetails.find(
        (detail) => detail.ipfsHash === ipfsHash
      );
  
      if (!contentDetail) {
        return res.status(404).json({
          message: "Content detail not found",
        });
      }
  
      // Update the specific fields
      contentDetail.isSubbmited = isSubbmited;
      contentDetail.submissionDate = submissionDate;
      contentDetail.submissionHash = submissionHash;
      contentDetail.chainId = chainId;
  
      // Save to the database
      const updatedContent = await screenWriteContent.save();
  
      return res.status(200).json({
        message: "Screen Write Content detail updated successfully!",
        data: updatedContent,
      });
    } catch (error) {
      console.error("Error updating content detail:", error);
      return res.status(500).json({
        message: "Error updating content detail",
        error,
      });
    }
  };

// Delete specific Screen Write content detail
export const deleteScreenWriteContentDetail = async (req, res) => {
    try {
      const { walletAddress, ipfsHash } = req.params;
  
      // Find the screen write content by wallet address
      const screenWriteContent = await ScreenWriteContentData.findOne({
        walletAddress,
      });
  
      if (!screenWriteContent) {
        return res.status(404).json({
          message: "Content not found for this wallet address",
        });
      }
  
      // Filter out the content detail to delete using ipfsHash
      screenWriteContent.contentDetails = screenWriteContent.contentDetails.filter(
        (detail) => detail.ipfsHash !== ipfsHash
      );
  
      // Save to the database
      const updatedContent = await screenWriteContent.save();
  
      return res.status(200).json({
        message: "Screen Write Content detail deleted successfully!",
        data: updatedContent,
      });
    } catch (error) {
      console.error("Error deleting content detail:", error);
      return res.status(500).json({
        message: "Error deleting content detail",
        error,
      });
    }
  };

  // Update the wallet Address of a screen write when vanity Details transfer to another wallet.
export const updateVanityScreenWriteContentWalletForVanityTransfer = async (
    req,
    res
  ) => {
    try {
      // const { vanityAddress } = req.params;
      const {vanityAddress, newWalletAddress } = req.body;
      const screenWriteContent = await ScreenWriteContentData.findOne({
        vanityAddress,
      });
      if (!screenWriteContent) {
        return res.status(404).json({
          message: "Content not found for this vanity address",
        });
      }
      screenWriteContent.walletAddress = newWalletAddress;
      const updatedContent = await screenWriteContent.save();
      return res.status(200).json({
        message: "Wallet address updated successfully!",
        data: updatedContent,
      });
    } catch (error) {
      console.error("Error updating wallet address:", error);
      return res.status(500).json({
        message: "Error updating wallet address",
        error,
      });
    }
  };

// Track dowanload screen Write content data
export const trackDownloadScreenWriteContent = async (req, res) => {
    const { vanityAddress } = req.body;
  
    if (!vanityAddress) {
      return res.status(400).json({ error: "Vanity address is required" });
    }
  
    try {
      // Find or create the entry for the vanity address
      let log = await ScreenWriteContentCallLogData.findOne({ vanityAddress });
      if (log) {
        log.callCount += 1; // Increment individual call count
      } else {
        log = new ScreenWriteContentCallLogData({ vanityAddress });
      }
  
      await log.save();
  
      res.json({
        message: "Screen Write Call tracked successfully",
        log,
      });
    } catch (error) {
      console.error("Error tracking call:", error);
      res.status(500).json({ error: "Failed to track the call" });
    }
  };
    