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
      <div className="flex flex-col gap-5 mx-6">
        {/* Footer content  */}
        <p className="text-gray-300 text-sm">
          This does not serve as investment advice, nor does it represent an
          invitation or endorsement to participate in any cryptocurrency
          transactions. Investing in crypto assets involves the risk of losing
          all or part of your investment, along with the possibility of
          considerable price fluctuations, which may not be suitable for
          individual investors. Historical financial results do not assure
          future outcomes. Only invest what you can afford to lose. For further
          information on the associated risks, please refer to the provided
          link.
        </p>

        {/* Links Container */}
        <div className="flex flex-col md:flex-row items-center justify-end text-white mt-4 md:mt-0">
          <div className="flex flex-wrap justify-center md:justify-start">
            <a
              href="/privacy-policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500 mx-2 mb-2"
            >
              Terms of Use
            </a>
            <span className="text-gray-400">|</span>
            <a
             href="/privacy-policy.pdf"
             target="_blank"
             rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500 mx-2 mb-2"
            >
              Copyright
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="/privacy-policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500 mx-2 mb-2"
            >
              Feedback
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="/privacy-policy.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline hover:text-blue-500 mx-2 mb-2"
            >
              Support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
