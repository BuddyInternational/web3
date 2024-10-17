import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import React, { useState } from "react";
import { useVanityContext } from "../context/VanityContext";
import Contributions from "../components/contributeComponents/Contributions";

const ContributeContent: React.FC = () => {
  const { address } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const [content, setContent] = useState<string>("");

  // Handler for textarea content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Handler for submit button
  const handleSubmit = () => {
  };

  return (
    <div className="container mx-auto min-h-screen mb-2 bg-[#0e0e0e] text-white flex flex-col items-center justify-center px-4">
      {/* Wallet and Vanity Address */}
      <div className="flex flex-col sm:flex-col md:flex-row sm:space-x-0 md:space-x-4 mb-8 mt-0 items-center gap-2 w-full sm:w-full md:w-3/4 lg:w-1/2 justify-center">
        <div className="bg-gray-800 p-3 rounded-lg w-full max-w-xs text-center border-2 border-blue-400">
          <p>{address?.slice(0, 6)}...{address?.slice(-4)}</p>
        </div>
        <div className="text-center w-full max-w-xs">
          <p className="text-blue-400 cursor-pointer">Wallet Address</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg w-full max-w-xs text-center border-2 border-blue-400">
          <p>{vanityAddress?.slice(0, 6)}...{vanityAddress?.slice(-4)}</p>
        </div>
        <div className="text-center w-full max-w-xs">
          <p className="text-blue-400 cursor-pointer">Vanity Address</p>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-8">
        <p className="text-md font-semibold mb-4 text-blue-400">Content</p>
        <textarea
          className="w-full h-40 p-4 bg-gray-800 rounded-lg text-white border-2 border-blue-400"
          placeholder="Please Enter Your Content..."
          value={content}
          onChange={handleContentChange}
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className="bg-blue-600 hover:bg-blue-500 text-white hover:text-blue-950 font-bold py-2 px-8 sm:px-12 md:px-16 lg:px-24 rounded-lg mb-8"
      >
        Submit
      </button>

      {/* Your Contributions */}
      <div className="w-full sm:w-full md:w-3/4 lg:w-1/2">
        <p className="text-md font-semibold mb-4 text-blue-400">Your Contributions</p>
        <Contributions />
      </div>
    </div>
  );
};

export default ContributeContent;