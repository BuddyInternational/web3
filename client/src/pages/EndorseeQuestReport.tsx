import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { Submission } from "../utils/Types";
import ResponseTable from "../components/EndorseeQuestComponents/tables/ResponseTable";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Skeleton } from "@mui/material";
import { BsArrowDownCircleFill } from "react-icons/bs";

// Form details
const form1Id: string | undefined = process.env.REACT_APP_JOTFORM1_ID || "";
const jotformApi: string | undefined = process.env.REACT_APP_JOTFORM_API || "";

const EndorseeQuest = () => {
  const { address } = useWeb3ModalAccount();
  const [formResponse, setFormResponse] = useState<Submission[]>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get user endorsee form response
    const handleResponse = async (formID: string) => {
      setIsLoading(true);
      try {
        const config = {
          method: "get",
          url: `https://api.jotform.com/form/${formID}/submissions?apiKey=${jotformApi}`,
        };
        const response = await axios.request(config);
        const data: Submission[] = response.data.content;
        console.log("data-------------", data);
        // Filter the connected user response
        const filteredResponses = data.filter((response) => {
          const walletAddress = response.answers["18"].answer;
          return walletAddress === address;
        });

        setFormResponse(filteredResponses);
      } catch (error) {
        console.error("Error fetching form submissions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    handleResponse(form1Id);
  }, [address]);

  console.log("form response-------------", formResponse);
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>
      <div className="flex text-white text-center text-xl gap-2 flex-col">
        <span> Endorsee Quest Completed By: </span>

        <span className="text-blue-500 ml-2">
          {/* Show full address on small screens */}
          <span className="block sm:hidden md:block">{address}</span>
          {/* Show sliced address on medium screens and above */}
          <span className="hidden sm:block md:hidden">
            {address?.slice(0, 8)}...{address?.slice(-6)}
          </span>
        </span>
      </div>
      {isLoading ? (
        <Skeleton variant="rectangular" width="100%" height={600} />
      ) : (
        formResponse &&
        (formResponse.length > 0 ? (
          <div className="m-4">
            <ResponseTable ResponseDetails={formResponse} />
          </div>
        ) : (
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-base">
              You haven't submitted any Endorsee Quest forms yet.
            </p>
            <BsArrowDownCircleFill className="text-3xl text-gray-400 m-auto my-6 animate-bounce" />
            <div className="flex justify-center mt-6">
              <Link to="/endorsee/quest" rel="noreferrer">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
                  Fill the Endorsee Quest Form
                </button>
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default EndorseeQuest;
