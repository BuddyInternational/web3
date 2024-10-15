import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link } from "react-router-dom";

const Shop = () => {
  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <Link
        to="/"
        className="text-blue-500 hover:underline flex items-center mb-4"
      >
        <MdKeyboardBackspace className="text-3xl text-white mr-2" />
      </Link>
      <div className="flex text-white text-center text-xl gap-2 flex-col">
        <h1 className="text-3xl font-bold mb-4">This feature is coming soon</h1>
      </div>
    </div>
  );
};

export default Shop;
