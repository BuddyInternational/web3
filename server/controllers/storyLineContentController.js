import { StoryLineContentData } from "../models/StoryLines.js";
import { StoryLineContentCallLogData } from "../models/StoryLineContentCallLog.js";

//  save story Line content data
export const saveStoryLineContent = async (req, res) => {
  try {
    const { walletAddress, vanityAddress, contentDetails } = req.body;

      console.log("contentDetails--------",contentDetails)
    let storyLineContent = await StoryLineContentData.findOne({
      walletAddress,
      vanityAddress,
    });

    if (!storyLineContent) {
      // Create new story line content if it doesn't exist
      storyLineContent = new StoryLineContentData({
        walletAddress,
        vanityAddress,
        contentDetails,
      });
    } else {
      // If story line content already exists, update the content details
      storyLineContent.contentDetails.push(contentDetails);
    }

    // Save the updated/created document to the database
    const savedContent = await storyLineContent.save();
    return res.status(201).json({
      message: "StoryLine Content saved successfully!",
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

// fetch story Line content data by wallet address
export const getStoryLineContent = async (req, res) => {
  try {
    const { walletAddress } = req.query;

    // Fetch content data based on wallet address
    const storyLineContent = await StoryLineContentData.findOne({ walletAddress });

    // if (!storyLineContent) {
    //   return res.status(404).json({
    //     message: 'Content not found for this wallet address',
    //   });
    // }
    if (storyLineContent) {
      return res.status(200).json({
        message: "Story LineContent fetched successfully!",
        data: storyLineContent,
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

// Update specific story Line content detail
export const updateStoryLineContentDetail = async (req, res) => {
  try {
    const { walletAddress, ipfsHash } = req.params;
    const { isSubbmited, submissionDate, submissionHash } = req.body;

    // Find the story Line content by wallet address
    const storyLineContent = await StoryLineContentData.findOne({ walletAddress });

    if (!storyLineContent) {
      return res.status(404).json({
        message: "Content not found for this wallet address",
      });
    }

    // Find the content detail and update using ipfsHash
    const contentDetail = storyLineContent.contentDetails.find(
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
    const updatedContent = await storyLineContent.save();

    return res.status(200).json({
      message: "Story Line Content detail updated successfully!",
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

// Delete specific Story Line content detail
export const deleteStoryLineContentDetail = async (req, res) => {
  try {
    const { walletAddress, ipfsHash } = req.params;

    // Find the story Line content by wallet address
    const storyLineContent = await StoryLineContentData.findOne({ walletAddress });

    if (!storyLineContent) {
      return res.status(404).json({
        message: "Content not found for this wallet address",
      });
    }

    // Filter out the content detail to delete using ipfsHash
    storyLineContent.contentDetails = storyLineContent.contentDetails.filter(
      (detail) => detail.ipfsHash !== ipfsHash
    );

    // Save to the database
    const updatedContent = await storyLineContent.save();

    return res.status(200).json({
      message: "Story Line Content detail deleted successfully!",
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

// Track dowanload story Line content data
export const trackDownloadStoryLineContent= async( req, res)=> {
  const { vanityAddress } = req.body;

  if (!vanityAddress) {
    return res.status(400).json({ error: 'Vanity address is required' });
  }

  try {
    // Find or create the entry for the vanity address
    let log = await StoryLineContentCallLogData.findOne({ vanityAddress });
    console.log("log1===========",log);
    if (log) {
      log.callCount += 1; // Increment individual call count
    } else {
      log = new StoryLineContentCallLogData({ vanityAddress });
    }

    console.log("log==========",log);
    await log.save();

    res.json({
      message: 'Story Line Call tracked successfully',
      log,
    });
  } catch (error) {
    console.error('Error tracking call:', error);
    res.status(500).json({ error: 'Failed to track the call' });
  }
}
