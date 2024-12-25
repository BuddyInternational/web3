import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import React, { useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";

const RewardPhotoProof = () => {
  const { address } = useWeb3ModalAccount();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');


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
    if (selectedFile) {
      console.log("File uploaded:", selectedFile.name);
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

      {/* <div className="container mx-auto my-auto mb-5 bg-[#0e0e0e] text-white flex flex-col items-center justify-center px-4 md:px-10 py-10"> */}
        {/* Page Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-[#1E90FF] via-[#6A5ACD] to-[#48D1CC] bg-clip-text text-transparent text-center">
          Reward Photo Proof
        </h1>
          {/* Content Section */}
          <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 mb-4">
          <p className="text-md font-semibold mb-4 text-blue-400">Content :</p>
          <textarea
            className="w-full h-40 p-4 bg-gray-800 rounded-lg text-white border-2 border-blue-400"
            placeholder="Please Enter Your Content..."
            // value={content}
            // onChange={handleContentChange}
          ></textarea>
        </div>

        {/* Photo Upload Section */}
        <div className="w-full sm:w-full md:w-3/4 lg:w-1/2 bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg border-2 border-blue-400">

          {/* Upload Label */}
          <p
            className="block text-md font-semibold mb-4 text-blue-400"
          >
            Upload Your Photo:
          </p>
          
          {/* File Input */}
          <input
            id="file-upload"
            type="file"
            accept="image/*"
            className="w-full text-sm text-gray-500 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500"
            onChange={handleFileChange}
          />

          {/* Display Selected File Info */}
          {selectedFile && (
            <div className="mt-4 text-center">
              {previewURL && (
                <img
                  src={previewURL}
                  alt="Preview"
                  className="w-full max-h-64 sm:max-h-80 object-contain rounded-lg border border-gray-700"
                />
              )}
            </div>
          )}

            {/* Disclaimers Section */}
        {/* <ol className="w-full sm:w-full md:w-3/4 lg:w-1/2 text-md text-gray-400 list-decimal list-inside my-3">
          <li className="my-3">
          Members can upload photo proof so Gully Buddy International can improve the collaborative movement this area is in preparation as resource and incentive future developer environments. You can earn up to 200 TIM.
          </li>
          <li className="my-5">
          Take a picture of your work be it written on paper and/or directly Gully Buddy International Manager Interface.l for 100 TIM. Upload an additional 3 different pictures related to the content earn a total of 200 TIM.
          </li>
        </ol> */}

          {/* Upload Button */}
          <button
            onClick={handleFileUpload}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 mt-4 rounded-lg"
          >
            Upload Photo
          </button>
        </div>
      </div>
    </>
  );
};

export default RewardPhotoProof;
