import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import React, { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";

const RewardPhotoProof = () => {
  const { address } = useWeb3ModalAccount();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  // Handle File Upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewURL(URL.createObjectURL(file));
    }
  };

  // Handle File Submit
  const handleFileUpload = () => {
    if (selectedFile && title && description) {
      alert("This feature coming soon");
      console.log("File uploaded contents:", selectedFile.name,title,description);
    } else {
      console.error("No file selected");
    }
  };

  return (
    <>
      {/* Back Button */}
      <Link
        to={`/content/${address}`}
        className="container mx-auto text-blue-500 hover:underline flex items-center mb-4 px-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>

      {/* Main Section */}
      <div className="container mx-auto min-h-screen py-10 bg-[#0e0e0e] text-white flex flex-col items-center relative px-4">
        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#1E90FF] via-[#6A5ACD] to-[#48D1CC] bg-clip-text text-transparent text-center">
          Reward Photo Proof
        </h1>

        {/* Title Section */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-4">
          <p className="text-md font-semibold mb-4 text-blue-400">Title :</p>
          <input
            type="text"
            id="place"
            className="w-full p-3 bg-gray-800 rounded-lg text-white border-2 border-blue-400"
            placeholder="Enter a Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        {/* Description Section */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-4">
          <p className="text-md font-semibold mb-4 text-blue-400">
            Description :
          </p>
          <textarea
            className="w-full h-40 p-4 bg-gray-800 rounded-lg text-white border-2 border-blue-400"
            placeholder="Please Enter Your Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Photo Upload Section */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-1">
          <p className="text-md font-semibold mb-4 text-blue-400">
            Upload Your Photo:
          </p>
        </div>
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border-2 border-blue-400 mb-4">
          {/* File Input */}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="w-full text-white text-sm mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            onChange={handleFileChange}
          />

          {/* Display Selected File Info */}
          {selectedFile && (
            <div className="mt-4 text-center">
              {previewURL && (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="max-h-38 sm:max-h-40 object-contain rounded-lg border border-gray-700"
                />
              )}
            </div>
          )}
        </div>

        {/* Disclaimers Section */}
        <ol className="w-full sm:w-full md:w-3/4 lg:w-1/2 text-md text-gray-400 list-decimal list-inside my-3">
          <li className="my-3">
            Members can upload photo proof so Gully Buddy International can
            improve the collaborative movement this area is in preparation as
            resource and incentive future developer environments. You can earn
            up to 200 TIM.
          </li>
          <li className="my-5">
            Take a picture of your work be it written on paper and/or directly
            Gully Buddy International Manager Interface.l for 100 TIM. Upload an
            additional 3 different pictures related to the content earn a total
            of 200 TIM.
          </li>
        </ol>

        {/* Upload Button */}
        <button
          onClick={handleFileUpload}
          className="bg-blue-600 hover:bg-blue-500 text-white hover:text-blue-950 font-bold py-2 px-8 sm:px-12 md:px-16 lg:px-24 rounded-lg mb-8"
        >
          Upload Photo
        </button>
      </div>
    </>
  );
};

export default RewardPhotoProof;
