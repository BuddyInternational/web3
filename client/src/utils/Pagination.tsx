import React from "react";

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageClick = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <ul className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
        <button
          className="px-3 py-2 rounded-md text-sm cursor-pointer focus:outline-none disabled:opacity-50"
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`px-3 py-2 rounded text-sm cursor-pointer hover:bg-gray-200 ${
              currentPage === pageNumber ? "bg-blue-500 text-white" : ""
            }`}
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </li>
        ))}
        <button
          className="px-3 py-2 rounded-md text-sm cursor-pointer focus:outline-none disabled:opacity-50"
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </ul>
    </div>
  );
};

export default Pagination;
