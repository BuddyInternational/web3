import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="bg-gray-700 mt-2 flex flex-col md:flex-row justify-between items-center p-4">
      {/* GIF container */}
      <div className="w-full md:w-1/3 lg:w-1/5 flex-shrink-0 p-1 flex justify-center">
        <img
          src="/footer.gif"
          alt="Giphy"
          className=" w-full h-auto max-h-28 object-cover"
        />
      </div>

      {/* Links Container */}
      <div className="flex flex-col md:flex-row items-center text-white mt-4 md:mt-0">
        <div className="flex flex-wrap justify-center md:justify-start">
          <a
            href="/terms"
            className="hover:underline hover:text-blue-500 mx-2 mb-2"
          >
            Terms of Use
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/copyright"
            className="hover:underline hover:text-blue-500 mx-2 mb-2"
          >
            Copyright
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/feedback"
            className="hover:underline hover:text-blue-500 mx-2 mb-2"
          >
            Feedback
          </a>
          <span className="text-gray-400">|</span>
          <a
            href="/support"
            className="hover:underline hover:text-blue-500 mx-2 mb-2"
          >
            Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
