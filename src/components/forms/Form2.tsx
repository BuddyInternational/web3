import React, { useEffect, useState } from "react";
import Jotform from "react-jotform";
import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import Skeleton from "@mui/material/Skeleton";

const form2Url = process.env.REACT_APP_JOTFORM2_LINK;

const Form2 = () => {
  const [jotformLoaded, setJotformLoaded] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setJotformLoaded(true);
    }, 2000);
  }, []);
  return (
    <>
      <div className="w-2/3 m-auto">
        <Link to="/" className="text-blue-500 hover:underline mr-4">
          <MdKeyboardBackspace className="text-3xl text-white" />
        </Link>
        {jotformLoaded ? (
          <Jotform src={form2Url || ""} />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={300} />
        )}
      </div>
    </>
  );
};

export default Form2;
