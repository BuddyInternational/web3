import { RegisterData } from "../models/Register.js";

const maskSensitiveInfo = (input) => {
  if (!input) return "N/A";

  if (input.includes("@")) {
    // Mask Email
    const [name, domain] = input.split("@");
    return `${name.substring(0, 2)}****@${domain}`;
  } else {
    // Mask Mobile
    return `${input.substring(0, 2)}****${input.substring(input.length - 2)}`;
  }
};

// store User Vanity Details
export const storeUserVanityWallet = async (req, res) => {
  const {
    mobile,
    email,
    vanityAddress,
    vanityPrivateKey,
    vanityAccountType,
    logInStatus = false,
  } = req.body;

  try {
    // Validate that either mobile or email is provided, but not both
    if ((!mobile && !email) || (mobile && email)) {
      return res.status(400).json({
        message: "Provide either mobile or email, but not both.",
      });
    }

    // Find a record with the given mobile or email
    let query = mobile ? { mobile } : { email };
    let userRecord = await RegisterData.findOne(query);

    if (!userRecord) {
      // If no record exists, create a new entry
      userRecord = new RegisterData({
        mobile: mobile || null,
        email: email || null,
        logInStatus,
        vanityDetails: [
          {
            vanityAddress,
            vanityPrivateKey,
            vanityAccountType,
          },
        ],
        createdAt: new Date(),
      });
      await userRecord.save();
    } else {
      // If a record exists, add the new vanity details to the existing record
      userRecord.vanityDetails.push({
        vanityAddress,
        vanityPrivateKey,
        vanityAccountType,
      });
      await userRecord.save();
    }

    console.log("Stored vanity details:", userRecord);

    res.status(200).json({
      message: "Vanity details stored successfully",
      data: userRecord,
    });
  } catch (e) {
    res.status(500).json({
      message: "Error storing vanity details",
      error: e.message,
    });
  }
};

// Check if a vanity address exists for a given mobile or email
export const checkExistingUserVanityAddress = async (req, res) => {
  const { mobile, email } = req.query;
  try {
    // Validate that either mobile or email is provided, but not both
    if ((!mobile && !email) || (mobile && email)) {
      return res.status(400).json({
        message: "Provide either mobile or email, but not both.",
      });
    }

    // Create the query to find a record based on either mobile or email
    let query = mobile ? { mobile } : { email };

    // Search for the user in the database
    const existingEntry = await RegisterData.findOne(query);

    if (existingEntry) {
      console.log("Vanity details found for:", existingEntry);
      return res.status(200).json({
        message: "Vanity address found",
        vanityDetails: existingEntry.vanityDetails,
      });
    } else {
      return res.status(404).json({
        message: "No vanity address found for this mobile or email",
      });
    }
  } catch (e) {
    return res.status(500).json({
      message: "Error checking vanity address",
      error: e.message,
    });
  }
};

// Fetch All Registered User Data
export const getAllUsersData = async (req, res) => {
  try {
    // Fetch all user records from the database
    const allUsers = await RegisterData.find();

    if (allUsers.length === 0) {
      return res.status(404).json({
        message: "No user data found",
      });
    }
    // Extract only the required fields and mask sensitive info
    const formattedUsers = allUsers.map((user) => ({
      // vanityAddress: user.vanityAddress || "N/A",
      vanityAddress: user.vanityDetails
            .map((detail) => detail.vanityAddress)
            .join(", "),
      contact: user.email
        ? maskSensitiveInfo(user.email)
        : maskSensitiveInfo(user.mobile),
    }));

    // console.log("Filtered and masked user data:", formattedUsers);

    return res.status(200).json({
      message: "User data fetched successfully",
      data: formattedUsers,
    });
  } catch (error) {
    console.error("Error fetching all user data:", error);
    return res.status(500).json({
      message: "Error fetching all user data",
      error: error.message,
    });
  }
};

// Login User
export const logInUser = async (req, res) => {
  const { logInContent } = req.body;
  try {
    // Find user by mobile or email
    const user = await RegisterData.findOne({
      $or: [{ mobile: logInContent }, { email: logInContent }],
    });

    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }

    // Update the logInStatus to true
    user.logInStatus = true;

    // Save the updated user
    await user.save();
    return res.status(200).json({
      message: "User logged in successfully",
      UserData: user,
    });
  } catch (e) {
    console.error("Error during login:", e);
    return res.status(500).json({
      message: "Error during login",
      error: e.message,
    });
  }
};

// LogOut User
export const logOutUser = async (req, res) => {
  const { mobile, email } = req.body;
  try {
    // Find user by mobile or email
    const user = await RegisterData.findOne({
      $or: [{ mobile: mobile }, { email: email }],
    });
    if (!user) {
      return res.status(404).json({
        message: "User Not Found",
      });
    }
    // Update the logInStatus to false
    user.logInStatus = false;
    // Save the updated user
    await user.save();
    return res.status(200).json({
      message: "User logged out successfully",
      UserData: user,
    });
  } catch (e) {
    console.error("Error during logout:", e);
    return res.status(500).json({
      message: "Error during logout",
      error: e.message,
    });
  }
};

// Download if vanity data exists
export const downloadVanityAddressForUser = async (req, res) => {
  try {
    const data = await RegisterData.find();
    if (data && data.length > 0) {
      console.log("Data found-----", data);
      return res.status(200).json({
        message: "Vanity data found",
        data: data,
      });
    } else {
      return res.status(404).json({ message: "Vanity data not found" });
    }
  } catch (e) {
    res
      .status(500)
      .json({ message: "Error fetching vanity data", error: e.message });
  }
};
