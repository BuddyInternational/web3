import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { Submission } from "../../utils/Types";
import ResponseTable from "../../utils/ResponseTable";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { Skeleton } from "@mui/material";

// form details
const form1Id: string | undefined = process.env.REACT_APP_JOTFORM1_ID || "";
const jotformApi: string | undefined =
  process.env.REACT_APP_JOTFORM_API || "";

const EndorseeQuest = () => {
  const { address } = useWeb3ModalAccount();
  const [formResponse, setFormResponse] = useState<Submission[]>();
  const [isLoading, setIsLoading] = useState(false);

  // get user endorsee form response
  const handleResponse = async (formID: string) => {
    setIsLoading(true);
    try {
      const config = {
        method: "get",
        url: `https://api.jotform.com/form/${formID}/submissions?apiKey=${jotformApi}`,
        // filter:{
        //     "walletAddress": "0x3f88C36C69199FAa7298815a4e8aa7119d089448"
        // }
      };
      const response = await axios.request(config);
      const data: Submission[] = response.data.content;
      //filter the connected user response
      const filteredResponses = data.filter((response) => {
        const walletAddress = response.answers["15"].answer;
        return walletAddress === address;
      });

      setFormResponse(filteredResponses);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleResponse(form1Id)
  }, [form1Id])

  return (
    <>
      <div className="w-2/3 h-auto m-auto">
        <Link to="/" className="text-blue-500 hover:underline mr-4">
          <MdKeyboardBackspace className="text-3xl text-white" />
        </Link>
        <p className="text-white text-center text-lg">Endorsee Quest Completed By :  <span className="text-blue-500 ml-2">{address}</span></p>
        {isLoading ? (
          <>
            <Skeleton variant="rectangular" width="100%" height={600} />
          </>
        ) : formResponse && (
          formResponse?.length > 0 ? (
            <div className="mt-4">
              <ResponseTable ResponseDetails={formResponse} />
            </div>
          ) : (
            <p className="mt-6 text-center text-gray-500 text-base">
              You haven't submitted any Endorsee Quest forms yet.
            </p>
          )
        )
    }
      </div>
    </>
  );
};

export default EndorseeQuest;
