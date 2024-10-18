import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import React, { useState } from "react";
import { useVanityContext } from "../context/VanityContext";
import Contributions from "../components/contributeComponents/Contributions";

// Define mood options
const moodOptions = [
  { label: "Happy  😊", value: "😊" },
  { label: "Sad  😢", value: "😢" },
  { label: "Angry  😠", value: "😠" },
  { label: "Excited  🎉", value: "🎉" },
  { label: "Thoughtful  🤔", value: "🤔" },
  { label: "Surprised  😲", value: "😲" },
  { label: "Relaxed  😌", value: "😌" },
  { label: "Nervous  😬", value: "😬" },
  { label: "Curious  🤨", value: "🤨" },
  { label: "Confident  😎", value: "😎" },
  { label: "Grateful  🙏", value: "🙏" },
  { label: "Inspired  ✨", value: "✨" },
  { label: "Confused  🤯", value: "🤯" },
];

const ContributeContent: React.FC = () => {
  const { address } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const [content, setContent] = useState<string>("");
  const [mood, setMood] = useState<string>(""); 
  const [submissions, setSubmissions] = useState<{ mood: string; content: string ;timestamp:string}[]>([]);

  // Handler for textarea content
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Handler for mood selection
  const handleMoodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMood(e.target.value);
  };

 // Handler for submit button
 const handleSubmit = () => {
  // Add new submission to the state
  if (mood && content) {
    const timestamp = new Date().toISOString();
    setSubmissions([...submissions, { mood, content,timestamp }]);
    setContent(""); 
    setMood(""); 
  }
  else {
    alert("Please select a mood and enter content.");
  }
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


      {/* Mood Dropdown */}
      <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-4">
        <label htmlFor="mood" className="text-md font-semibold mb-2 text-blue-400 block">Select Mood</label>
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
      <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 text-md text-gray-400 ">
        <p className="mb-2">1) If used, rewarded.</p>
        <p className="mb-2">2) If used, fees apply.</p>
        <p className="mb-4">3) On-chain message passing is required.</p>
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
        {/* Displaying submissions in accordion */}
        {submissions.length > 0 ? (
          <Contributions submissions={submissions} />
        ) : (
          <p className="bg-gray-800 p-3 rounded-lg w-full text-center border-2 border-blue-400">No contributions yet.</p>
        )}
      </div>
    </div>
  );
};

export default ContributeContent;