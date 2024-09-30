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
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-blue-500 hover:underline flex items-center mr-4"
        >
          <MdKeyboardBackspace className="text-3xl text-white mr-2" />
        </Link>
        {jotformLoaded ? (
          <Jotform src={form2Url || ""} className="w-full h-full m-4" />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={300} />
        )}
      </div>
    </>
  );
};

export default Form2;
