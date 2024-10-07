
import { Link } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import Skeleton from "@mui/material/Skeleton";
import CommonJotform from "../../../utils/CommonJotform";

const form2Url = process.env.REACT_APP_JOTFORM2_LINK;

const Form2 = () => {
  
  return (
    <>
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-blue-500 hover:underline flex items-center mr-4"
        >
          <MdKeyboardBackspace className="text-3xl text-white mr-2" />
        </Link>
        <CommonJotform formUrl={form2Url!} defaults={''}/>
        {/* <div className="flex flex-col space-y-4 my-4">
        {jotformLoaded ? (
          <Jotform src={form2Url || ""} className="w-full h-auto border border-gray-300 rounded-lg shadow-md" />
        ) : (
          <Skeleton variant="rectangular" width="100%" height={300} />
        )}
        </div> */}
      </div>
    </>
  );
};

export default Form2;
