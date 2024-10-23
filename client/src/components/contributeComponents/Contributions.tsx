import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { toast } from "react-toastify";
import { ethers } from "ethers";
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { useVanityContext } from "../../context/VanityContext";
import {
  deleteUserContent,
  updateContentDetail,
} from "../../api/userContentAPI";
import { ContentSubmission } from "../../utils/Types";
import {  useGullyBuddyNotifier } from "../../utils/GullyBuddyNotifier";

interface ContributionsProps {
  submissions: ContentSubmission[];
}


const Contributions: React.FC<ContributionsProps> = ({ submissions }) => {
  const { address } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const { notifyGullyBuddy } = useGullyBuddyNotifier();

  // submit user content onchain
  const handleSubmit = async (ipfsHash: string) => {
    try {
      const sender = address!;
      const message = `The user with Wallet Address "${address!}" and Vanity Wallet "${vanityAddress}" has submitted a new contribution to the network.`;
      // Send notification
      const notificationResult = await notifyGullyBuddy(sender, message);
      if (notificationResult && notificationResult.hash) {
        toast.success("Notification sent to Buddyinternational.eth");
        // Update the content detail
        const updateResponse = await updateContentDetail(
          address!,
          ipfsHash,
          true,
          new Date().toISOString(),
          notificationResult.hash
        );

        if (updateResponse) {
          toast.success("Content detail updated successfully!");
        } else {
          toast.error("Failed to update content detail.");
        }
      }
    } catch (error: any) {
      toast.error("Error sending notification:", error);
    }
  };

  // handleDeleteContent
  const handleDeleteContent = async (
    walletAddress: string,
    ipfsHash: string
  ) => {
    const response = await deleteUserContent(walletAddress, ipfsHash);
    if (response) {
      console.log(response.message);
      toast.success("Delete Content Succefully");
    } else {
      console.error("Failed to delete content detail.");
      toast.error("Failed to delete content detail.");
    }
  };

  return (
    <div className="border-2 border-blue-400 rounded-md shadow-lg">
      {submissions.map((submission, index) => (
        <Accordion
          key={index}
          sx={{
            backgroundColor: "#1f2937",
            color: "white",
            margin: "10px 0",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-2">
              <div className="flex-1 text-center md:text-left">
                <Typography variant="body2" color="inherit">
                  {submission.mood}
                </Typography>
              </div>
              <div className="flex-1 text-center md:text-left">
                <Typography variant="body2" color="inherit">
                  {new Date(submission.generateContentDate).toLocaleString()}
                </Typography>
              </div>
              {submission.isSubbmited === false && (
                <div className="flex-1 flex flex-col md:flex-row justify-center md:justify-end">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{
                      marginBottom: { xs: 1, md: 0 },
                      marginRight: { md: 1 },
                    }}
                    onClick={() => {
                      handleSubmit(submission?.ipfsHash!);
                    }}
                  >
                    Submit Application
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ color: "red" }}
                    onClick={() => {
                      handleDeleteContent(address!, submission?.ipfsHash!);
                    }}
                  >
                    Delete Contribution
                  </Button>
                </div>
              )}
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="inherit">
              {submission.content}
            </Typography>
            {submission.isSubbmited && submission.submissionHash && (
              <Typography
                variant="body2"
                color="inherit"
                style={{ marginTop: "8px" }}
              >
                <a
                  href={`https://etherscan.io/tx/${submission.submissionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#1976d2", textDecoration: "underline" }}
                >
                  Check Your OnChain Message
                </a>
              </Typography>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default Contributions;
