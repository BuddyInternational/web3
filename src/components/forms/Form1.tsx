import React, { useEffect, useState } from "react";
import Jotform from "react-jotform";
import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import { Submission } from "../../utils/Types";
import ResponseTable from "../../utils/ResponseTable";

//get variable
const form1Url = process.env.REACT_APP_JOTFORM1_LINK;
const form1Id: string |undefined = process.env.REACT_APP_JOTFORM1_ID || '';
const jotformApi: string | undefined =
  process.env.REACT_APP_JOTFORM_API_KEY || "";

const Form1 = () => {
  const { address } = useWeb3ModalAccount();
  const [formResponse, setFormResponse] = useState<Submission[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [jotformLoaded, setJotformLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setJotformLoaded(true);
    }, 2000);
  }, []);

  // get user form response
  const handleResponse = async (formID: string) => {
    setIsLoading(true);
    try {
      const config = {
        method: 'get',
        url: `https://api.jotform.com/form/${formID}/submissions?apiKey=${jotformApi}`,
        // filter:{
        //     "walletAddress": "0x3f88C36C69199FAa7298815a4e8aa7119d089448"
        // }
      };

      const response = await axios.request(config);
      const data : Submission[] = response.data.content;
      console.log("data----------",data);
      const filteredResponses = data.filter((response) => {
        const walletAddress = response.answers['15'].answer;
        return walletAddress === address;
      });
      
      // if (filteredResponses.length > 0) {
      //   console.log("Matching responses:");
      //   filteredResponses.forEach((response) => {
      //     console.log("final====================",response);
      //   });
      // } else {
      //   console.log("No matching responses found.");
      // }

      console.log("final----------------------------------",filteredResponses);
      setFormResponse(filteredResponses);
      console.log("form response data", response.data);
      console.log("form response data answer", response.data.content);
    } catch (error) {
      console.error("Error fetching form submissions:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="w-2/3 h-auto m-auto">
        <Link to="/" className="text-blue-500 hover:underline mr-4">
          <MdKeyboardBackspace className="text-3xl text-white" />
        </Link>
        {jotformLoaded ? (
          <Jotform
            src={form1Url || ""}
            defaults={{ walletAddress: address || "" }}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={300} />
        )}
        <button
          disabled={isLoading}
          onClick={() => handleResponse(form1Id)}
          className="bg-blue-500 text-white px-3 py-2 rounded-md mt-4 mb-2"
        >
          {isLoading ? "Loading..." : "Get Response"}
        </button>

        {formResponse && (
          <div className="mt-4 mb-4">
           <ResponseTable ResponseDetails={formResponse}/>
          </div>
        )}
      </div>
    </>
  );
};

export default Form1;
