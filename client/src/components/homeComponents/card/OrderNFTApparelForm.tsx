import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import CommonJotform from "../../../utils/CommonJotform";

const form3Url = process.env.REACT_APP_JOTFORM3_LINK;

const OrderNFTApparelForm = () => {
  const { address } = useWeb3ModalAccount();

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>
      <CommonJotform formUrl={form3Url!} defaults={{ walletAddress: address || "" }}/>

    </div>
  );
};

export default OrderNFTApparelForm;
