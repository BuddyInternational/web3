import { UserContentData } from "../models/userContent.js";
import { UserContentCallLogData } from "../models/UserContentCallLog.js";

//  save user content data
export const saveUserContent = async (req, res) => {
  try {
    const { walletAddress, vanityAddress, contentDetails } = req.body;

      console.log("contentDetails--------",contentDetails)
    let userContent = await UserContentData.findOne({
      walletAddress,
      vanityAddress,
    });

    if (!userContent) {
      // Create new user content if it doesn't exist
      userContent = new UserContentData({
        walletAddress,
        vanityAddress,
        contentDetails,
      });
    } else {
      // If user content already exists, update the content details
      userContent.contentDetails.push(contentDetails);
    }

    // Save the updated/created document to the database
    const savedContent = await userContent.save();
    return res.status(201).json({
      message: "Content saved successfully!",
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

// fetch user content data by wallet address
export const getUserContent = async (req, res) => {
  try {
    const { walletAddress } = req.query;

    // Fetch content data based on wallet address
    const userContent = await UserContentData.findOne({ walletAddress });

    // if (!userContent) {
    //   return res.status(404).json({
    //     message: 'Content not found for this wallet address',
    //   });
    // }
    if (userContent) {
      return res.status(200).json({
        message: "Content fetched successfully!",
        data: userContent,
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

// Update specific content detail
export const updateContentDetail = async (req, res) => {
  try {
    const { walletAddress, ipfsHash } = req.params;
    const { isSubbmited, submissionDate, submissionHash } = req.body;

    // Find the user content by wallet address
    const userContent = await UserContentData.findOne({ walletAddress });

    if (!userContent) {
      return res.status(404).json({
        message: "Content not found for this wallet address",
      });
    }

    // Find the content detail and update using ipfsHash
    const contentDetail = userContent.contentDetails.find(
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

    // Save to the database
    const updatedContent = await userContent.save();

    return res.status(200).json({
      message: "Content detail updated successfully!",
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

// Delete specific content detail
export const deleteContentDetail = async (req, res) => {
  try {
    const { walletAddress, ipfsHash } = req.params;

    // Find the user content by wallet address
    const userContent = await UserContentData.findOne({ walletAddress });

    if (!userContent) {
      return res.status(404).json({
        message: "Content not found for this wallet address",
      });
    }

    // Filter out the content detail to delete using ipfsHash
    userContent.contentDetails = userContent.contentDetails.filter(
      (detail) => detail.ipfsHash !== ipfsHash
    );

    // Save to the database
    const updatedContent = await userContent.save();

    return res.status(200).json({
      message: "Content detail deleted successfully!",
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

// Track dowanload user content data
export const trackDownloadUserContent= async( req, res)=> {
  const { vanityAddress } = req.body;

  if (!vanityAddress) {
    return res.status(400).json({ error: 'Vanity address is required' });
  }

  try {
    // Find or create the entry for the vanity address
    let log = await UserContentCallLogData.findOne({ vanityAddress });
    console.log("log1===========",log);
    if (log) {
      log.callCount += 1; // Increment individual call count
    } else {
      log = new UserContentCallLogData({ vanityAddress });
    }

    console.log("log==========",log);
    await log.save();

    res.json({
      message: 'Call tracked successfully',
      log,
    });
  } catch (error) {
    console.error('Error tracking call:', error);
    res.status(500).json({ error: 'Failed to track the call' });
  }
}
