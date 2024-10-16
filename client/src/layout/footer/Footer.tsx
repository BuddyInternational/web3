import React from "react";
import SupportMenu from "./SupportMenu";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#00000044] text-white py-8">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between">
        {/* GIF Container */}
        <div className="flex-shrink-0 w-full md:w-1/4 lg:w-1/5 mb-6 md:mb-0 flex justify-center">
          <img
            src="/footer.gif"
            alt="Footer Animation"
            className="rounded-xl shadow-xl w-full h-auto max-h-32 object-cover cursor-pointer transition-transform duration-300 transform hover:scale-110"
          />
        </div>

        {/* Footer Text Content */}
        <div className="text-center md:text-left flex-1 md:px-8">
          <p className="text-sm leading-relaxed opacity-90">
            {/* <span className="font-semibold text-lg">Important:</span>  */}
            This does not serve as investment advice, nor does it represent an
            invitation or endorsement to participate in any cryptocurrency
            transactions. Investing in crypto assets involves the risk of losing
            all or part of your investment. Only invest what you can afford to
            lose. For more information, please refer to the provided link.
          </p>
        </div>

        {/* Links Container */}
        <div className="flex flex-col gap-2 md:gap-4 items-center text-white mt-8 md:mt-0">
          <a
            href="/privacy-policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-colors duration-300 hover:text-yellow-400"
          >
            Terms of Use
          </a>
          <a
            href="/privacy-policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-colors duration-300 hover:text-yellow-400"
          >
            Copyright
          </a>
          <a
            href="/privacy-policy.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold transition-colors duration-300 hover:text-yellow-400"
          >
            Feedback
          </a>
          <SupportMenu />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
