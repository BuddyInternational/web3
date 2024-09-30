import React, { useEffect, useState } from "react";
import Jotform from "react-jotform";
import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Skeleton from "@mui/material/Skeleton";

const form1Url = process.env.REACT_APP_JOTFORM1_LINK;

const EndorseeQuestForm = () => {
  const { address } = useWeb3ModalAccount();
  const [jotformLoaded, setJotformLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setJotformLoaded(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>
      {jotformLoaded ? (
        <Jotform
          src={form1Url || ""}
          defaults={{ walletAddress: address || "" }}
          className="w-full h-full"
        />
      ) : (
        <Skeleton variant="rectangular" width="100%" height={300} />
      )}
    </div>
  );
};

export default EndorseeQuestForm;
