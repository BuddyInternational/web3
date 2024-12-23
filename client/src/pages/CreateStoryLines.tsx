import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import React, { useEffect, useRef, useState } from "react";
import { useVanityContext } from "../context/VanityContext";
import { create as createIPFSClient } from "ipfs-http-client";
import { getStoryLineContent ,saveStoryLineContentDetails} from "../api/storyLineContentAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaCheck, FaRegCopy } from "react-icons/fa";
import { StoryLineContentSubmission } from "../utils/Types";
import { saveAs } from "file-saver";
import axios from "axios";
import { Slider } from "@mui/material";
import { useLoader } from "../context/LoaderContext";
import Loader from "../utils/Loader";
import StoryLineContributions from "../components/contributeComponents/StoryLineContributions";
import { motion } from "framer-motion"; 
import { downloadStoryLineContent } from "../utils/DownloadCSV";

// Define mood options
const moodOptions = [
  { label: "Happy  😊", value: "Happy 😊" },
  { label: "Sad  😢", value: "Sad 😢" },
  { label: "Angry  😠", value: " Angry 😠" },
  { label: "Excited  🎉", value: "Excited 🎉" },
  { label: "Thoughtful  🤔", value: "Thoughtful 🤔" },
  { label: "Surprised  😲", value: "Surprised 😲" },
  { label: "Relaxed  😌", value: "Relaxed 😌" },
  { label: "Nervous  😬", value: " Nervous😬" },
  { label: "Curious  🤨", value: "Curious 🤨" },
  { label: "Confident  😎", value: "Confident 😎" },
  { label: "Grateful  🙏", value: "Grateful 🙏" },
  { label: "Inspired  ✨", value: "Inspired ✨" },
  { label: "Confused  🤯", value: "Confused 🤯" },
  { label: "News 📰", value: "News 📰" },
  { label: "Citation 📑", value: "Citation 📑" },
  { label: "Developer 💻", value: "Developer 💻" },
  { label: "Board/Governance 👥", value: "Board/Governance 👥" },
];

const ipfs = createIPFSClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    Authorization:
      "Basic " +
      btoa(
        `${process.env.REACT_APP_INFURA_PROJECT_ID}:${process.env.REACT_APP_INFURA_PROJECT_SECRET}`
      ),
  },
});

const CreateStoryLines: React.FC = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const [content, setContent] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [age, setAge] = useState<number>(25);
  const [submissions, setSubmissions] = useState<StoryLineContentSubmission[]>([]);
  const { isLoading, setIsLoading } = useLoader();
  const [wordCount, setWordCount] = useState<number>(0);
  const [isWalletAddressCopied, setIsWalletAddressCopied] = useState(false);
  const [isVanityAddressCopied, setIsVanityAddressCopied] = useState(false);
  const copyAddressTimeoutRef: any = useRef(null);
  const copyVanityAddressTimeoutRef: any = useRef(null);

  // Server API Base URL
  const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

  // Function to calculate word count
  const calculateWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // Handler for textarea content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    setWordCount(calculateWordCount(newContent));
  };

  // Handler for mood selection
  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMood(e.target.value);
  };

  // Fetch story Line Content from Database
  const fetchStoryLineContent = async () => {
    if (address && isConnected) {
      const storyLineContent = await getStoryLineContent(vanityAddress!);
      if (storyLineContent && storyLineContent.data) {
        setSubmissions(storyLineContent.data.contentDetails || []);
      }
    }
  };

  //save the story line content in Databse and also send onChain notification
  const handleSubmit = async () => {
    if (mood && content && age) {
      setIsLoading(true);
      try {
        const timestamp = new Date().toISOString();
        const submissionData = { mood, content, age, timestamp };
        const buffer = Buffer.from(JSON.stringify(submissionData));
        const result = await ipfs.add(buffer);
        console.log("IPFS Hash:", result.path);
        const contentDetails = {
          mood,
          content,
          age,
          ipfsHash: result.path,
          generateContentDate: timestamp,
          contentWordCount: wordCount,
          eligibleStatus: false,
          submissionHash: "",
          isSubbmited: false,
          submissionDate: "",
          chainId: 0,
        };

        // Call the API to save content details
        const response = await saveStoryLineContentDetails(
          address!,
          vanityAddress,
          contentDetails
        );

        if (response) {
          toast.success(response.message);
          setContent("");
          setMood("");
          setAge(25);
          fetchStoryLineContent();
        }
      } catch (error: any) {
        toast.error("Error uploading to IPFS:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      toast.error("Please select a Mood & Enter content.");
    }
  };

  // Initial fetch of user content when component mounts
  useEffect(() => {
    fetchStoryLineContent();
  }, [address, isConnected]);

  return (
    <>
     <motion.div
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }}  
      exit={{ opacity: 0, scale: 1.1 }}    
      transition={{ duration: 0.5 }}      
      className="page-container"
    >
      <Link
        to={`/content/${address}`}
        className="container m-auto text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>
      <div className="container mx-auto min-h-screen py-10 bg-[#0e0e0e] text-white flex flex-col items-center justify-center px-4">
        {/* Display Loader */}
        {isLoading && <Loader />}
        
        {/* Wallet and Vanity Address */}
        <div className="flex flex-col sm:flex-col md:flex-row sm:space-x-0 md:space-x-4 mb-8 mt-0 items-center gap-2 w-full sm:w-full md:w-3/4 lg:w-1/2 justify-center">
          {/* Wallet Address */}
          <div className="bg-gray-800 p-3 rounded-lg w-full max-w-xs text-center border-2 border-blue-400">
            <p>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
          <div className="text-center w-full max-w-xs">
            <p className="text-blue-400 cursor-pointer">Wallet Address</p>
          </div>
          {/* Vanity Address */}
          <div className="bg-gray-800 p-3 rounded-lg w-full max-w-xs text-center border-2 border-blue-400">
            <p>
              {vanityAddress?.slice(0, 6)}...{vanityAddress?.slice(-4)}
            </p>
          </div>
          <div className="text-center w-full max-w-xs">
            <p className="text-blue-400 cursor-pointer">Vanity Address</p>
          </div>
        </div>

        {/* Mood Dropdown */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-4">
          <label
            htmlFor="mood"
            className="text-md font-semibold mb-2 text-blue-400 block"
          >
            Select Mood :
          </label>
          <select
            id="mood"
            className="w-full p-3 bg-gray-800 rounded-lg text-white border-2 border-blue-400"
            value={mood}
            onChange={handleMoodChange}
          >
            <option value="">Select a mood...</option>
            {moodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Age Slider */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-6">
          <p className="text-md font-semibold mb-4 text-blue-400">
            Select Age :
          </p>
          <div className="flex items-center justify-between">
            <Slider
              value={age}
              onChange={(e, newValue) => setAge(newValue as number)}
              valueLabelDisplay="on"
              min={0}
              max={100}
              defaultValue={25}
              step={1}
              marks={[
                { value: 0, label: "0" },
                { value: 18, label: "18" },
                { value: 25, label: "25" },
                { value: 30, label: "30" },
                { value: 40, label: "40" },
                { value: 50, label: "50" },
                { value: 65, label: "65" },
                { value: 75, label: "75" },
                { value: 85, label: "85" },
                { value: 100, label: "100" },
              ]}
              sx={{
                color: "#5692D9",
                "& .MuiSlider-thumb": {
                  backgroundColor: "#fff",
                  border: "2px solid #5692D9",
                },
                "& .MuiSlider-markLabel": {
                  color: "#fff",
                },
                "& .MuiSlider-valueLabel": {
                  backgroundColor: "#5692D9",
                  color: "#fff",
                },
              }}
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-4">
          <p className="text-md font-semibold mb-4 text-blue-400">Content :</p>
          <textarea
            className="w-full h-40 p-4 bg-gray-800 rounded-lg text-white border-2 border-blue-400"
            placeholder="Please Enter Your Content..."
            value={content}
            onChange={handleContentChange}
          ></textarea>
        </div>

        {/* Disclaimers Section */}
        <ol className="w-full sm:w-full md:w-3/4 lg:w-1/2 text-md text-gray-400 list-decimal list-inside my-3">
          <li className="my-3">
            If your contributed content is used, you will be rewarded with the
            tokens.
          </li>
          <li className="my-5">
            $10 USD worth of fees will be deducted when the on-chain message is
            propagated through the network once you submit your contribution.
          </li>
          <li className="my-3">
            <strong>Message:</strong> The user with Wallet Address "
            <strong className="mx-1 md:hidden sm:inline">
              {/* Sliced version for small screens */}
              {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : ""} "
            </strong>
            <strong className="mx-1 sm:hidden md:inline">
              {/* Full version for medium and larger screens */}
              {address} "
            </strong>
            <strong className="inline-flex items-center mx-1">
              {isWalletAddressCopied ? (
                <FaCheck className="text-green-500 cursor-pointer" />
              ) : (
                <FaRegCopy
                  onClick={() => {
                    navigator.clipboard.writeText(address || "");
                    setIsWalletAddressCopied(true);
                    clearTimeout(copyAddressTimeoutRef.current);
                    copyAddressTimeoutRef.current = setTimeout(() => {
                      setIsWalletAddressCopied(false);
                    }, 1000);
                  }}
                  className="text-[#5692D9] font-thin cursor-pointer"
                  data-tip="Copy Wallet Address"
                  data-tip-content=".tooltip"
                />
              )}
            </strong>
            and Vanity Wallet "
            <strong className="sm:inline md:hidden">
              {/* Sliced version for small screens */}
              {vanityAddress
                ? `${vanityAddress.slice(0, 6)}...${vanityAddress.slice(-4)}`
                : ""}{" "}
              "
            </strong>
            <strong className="sm:hidden md:inline">
              {/* Full version for medium and larger screens */}
              {vanityAddress} "
            </strong>
            <strong className="inline-flex items-center mx-1">
              {isVanityAddressCopied ? (
                <FaCheck className=" text-green-500 cursor-pointer" />
              ) : (
                <FaRegCopy
                  onClick={() => {
                    navigator.clipboard.writeText(vanityAddress || "");
                    setIsVanityAddressCopied(true);
                    clearTimeout(copyVanityAddressTimeoutRef.current);
                    copyVanityAddressTimeoutRef.current = setTimeout(() => {
                      setIsVanityAddressCopied(false);
                    }, 1000);
                  }}
                  className="text-[#5692D9] font-thin cursor-pointer"
                  data-tip="Copy Vanity Address"
                  data-tip-content=".tooltip"
                />
              )}
            </strong>
            has submitted a new contribution to the network.
          </li>
        </ol>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-500 text-white hover:text-blue-950 font-bold py-2 px-8 sm:px-12 md:px-16 lg:px-24 rounded-lg mb-8"
        >
          Submit
        </button>

        {/* Your Contributions */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2">
          <p className="text-md font-semibold mb-4 text-blue-400">
            Your Contributions
          </p>
          {/* Displaying submissions in accordion */}
          {submissions.length > 0 ? (
            <StoryLineContributions submissions={submissions} />
          ) : (
            <p className="bg-gray-800 p-3 rounded-lg w-full text-center border-2 border-blue-400">
              No contributions yet.
            </p>
          )}
        </div>

        {/* Download Contribution Data */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2">
          <button
            className="bg-blue-600 hover:bg-blue-500 text-white hover:text-blue-950 font-bold py-2 px-8 mt-5 sm:px-12 md:px-16 lg:px-24 rounded-lg mb-8"
            onClick={async () => {
              setIsLoading(true);
              try {
                await downloadStoryLineContent(submissions, vanityAddress);
              } finally {
                setIsLoading(false);
              }
            }}
          >
            Download Contribution Data
          </button>
        </div>
      </div>
      </motion.div>
    </>
  );
};

export default CreateStoryLines;
