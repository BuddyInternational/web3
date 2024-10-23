import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import React, { useEffect, useRef, useState } from "react";
import { useVanityContext } from "../context/VanityContext";
import Contributions from "../components/contributeComponents/Contributions";
import { create as createIPFSClient } from "ipfs-http-client";
import { getUserContent, saveContentDetails } from "../api/userContentAPI";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { FaCheck, FaRegCopy } from "react-icons/fa";

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

const ContributeContent: React.FC = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const [content, setContent] = useState<string>("");
  const [mood, setMood] = useState<string>("");
  const [submissions, setSubmissions] = useState<
    {
      mood: string;
      content: string;
      generateContentDate: string;
      ipfsHash: string;
      isSubbmited: boolean;
      submissionDate: string;
    }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isWalletAddressCopied, setIsWalletAddressCopied] = useState(false);
  const [isVanityAddressCopied, setIsVanityAddressCopied] = useState(false);
  const copyAddressTimeoutRef: any = useRef(null);
  const copyVanityAddressTimeoutRef: any = useRef(null);

  // Handler for textarea content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Handler for mood selection
  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMood(e.target.value);
  };

  //save the content in Databse and also send onChain notification
  const handleSubmit = async () => {
    if (mood && content) {
      setLoading(true);
      try {
        const timestamp = new Date().toISOString();
        const submissionData = { mood, content, timestamp };
        const buffer = Buffer.from(JSON.stringify(submissionData));
        const result = await ipfs.add(buffer);
        console.log("IPFS Hash:", result.path);
        const contentDetails = {
          mood,
          content,
          ipfsHash: result.path,
          generateContentDate: timestamp,
          isSubbmited: false,
          submissionDate: "",
        };

        // Call the API to save content details
        const response = await saveContentDetails(
          address!,
          vanityAddress,
          contentDetails
        );

        if (response) {
          toast.success("Content saved successfully");
          setContent("");
          setMood("");
        }
      } catch (error: any) {
        toast.error("Error uploading to IPFS:", error);
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please select a Mood & Enter content.");
    }
  };

  useEffect(() => {
    const fetchUserContent = async () => {
      if (address && isConnected) {
        const userContent = await getUserContent(address!);
        if (userContent && userContent.data) {
          setSubmissions(userContent.data.contentDetails || []);
        }
      }
    };

    fetchUserContent();
  }, [address, isConnected, submissions, setSubmissions]);

  return (
    <>
      <Link
        to="/"
        className="container m-auto text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>
      <div className="container mx-auto min-h-screen py-10 bg-[#0e0e0e] text-white flex flex-col items-center justify-center px-4">
        {/* Display Loader */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="loader border-8 border-t-8 border-gray-400 border-t-white rounded-full w-20 h-20 animate-spin"></div>
          </div>
        )}

        {/* Wallet and Vanity Address */}
        <div className="flex flex-col sm:flex-col md:flex-row sm:space-x-0 md:space-x-4 mb-8 mt-0 items-center gap-2 w-full sm:w-full md:w-3/4 lg:w-1/2 justify-center">
          <div className="bg-gray-800 p-3 rounded-lg w-full max-w-xs text-center border-2 border-blue-400">
            <p>
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
          </div>
          <div className="text-center w-full max-w-xs">
            <p className="text-blue-400 cursor-pointer">Wallet Address</p>
          </div>
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
            Select Mood
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

        {/* Content Section */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-4">
          <p className="text-md font-semibold mb-4 text-blue-400">Content</p>
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
          {/* <li className="my-3">
            <strong>Message:</strong> The user with Wallet Address "{address}"{" "}
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
            and Vanity Wallet "{vanityAddress}"{" "}
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
            </strong>{" "}
            has submitted a new contribution to the network.
          </li> */}
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
            <Contributions submissions={submissions} />
          ) : (
            <p className="bg-gray-800 p-3 rounded-lg w-full text-center border-2 border-blue-400">
              No contributions yet.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default ContributeContent;
