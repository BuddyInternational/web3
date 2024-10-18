import { UserContentData } from '../models/userContent.js';

//  save user content data
export const saveUserContent = async (req, res) => {
  try {
    const { walletAddress, vanityAddress, contentDetails } = req.body;

    let userContent = await UserContentData.findOne({ walletAddress, vanityAddress });

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
      message: 'Content saved successfully!',
      contentData: savedContent,
    });
  } catch (error) {
    console.error('Error saving content:', error);
    return res.status(500).json({
      message: 'Error saving content',
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

    if (!userContent) {
      return res.status(404).json({
        message: 'Content not found for this wallet address',
      });
    }

    return res.status(200).json({
      message: 'Content fetched successfully!',
      data: userContent,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return res.status(500).json({
      message: 'Error fetching content',
      error,
    });
  }
};
