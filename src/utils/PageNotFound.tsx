import React from "react";
import { Link } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { BsArrowDownCircleFill } from "react-icons/bs";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center  bg-gray-800 px-4 py-4 text-center">
      <img
        src="/notFound.png"
        alt="404 Image"
        className="w-3/4 max-w-md object-cover mb-8"
      />
      <h1 className="text-4xl font-bold text-white mb-4">
        Page Not Found!
      </h1>
      <p className="text-lg text-gray-400 mb-6">
        Oops, the page you are looking for is not available.
      </p>
      <BsArrowDownCircleFill className="text-6xl text-gray-400 mb-8 animate-bounce" />
      <Link to="/" className="flex items-center gap-3 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300">
        <IoArrowBack className="text-2xl" /> Back to Home
      </Link>
    </div>
  );
};

export default PageNotFound;
