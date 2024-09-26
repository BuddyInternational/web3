import React, { useEffect, useState } from "react";
import Jotform from "react-jotform";
import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import Skeleton from "@mui/material/Skeleton";

//get variable
const form1Url = process.env.REACT_APP_JOTFORM1_LINK;

const Form1 = () => {
  const { address } = useWeb3ModalAccount();
  const [jotformLoaded, setJotformLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setJotformLoaded(true);
    }, 2000);
  }, []);

  return (
    <>
      <div className="w-2/3 h-auto m-auto">
        <Link to="/" className="text-blue-500 hover:underline mr-4">
          <MdKeyboardBackspace className="text-3xl text-white" />
        </Link>
        {jotformLoaded ? (
          <Jotform
            src={form1Url || ""}
            defaults={{ walletAddress: address || "" }}
          />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={300} />
        )}
      </div>
    </>
  );
};

export default Form1;
