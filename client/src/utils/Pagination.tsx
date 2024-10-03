import React from "react";

const Pagination: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: any;
}> = ({ currentPage, totalPages, onPageChange }) => {
  // Handle page click
  const handlePageClick = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  // Add pageNumber
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center mt-4">
      <ul className="flex gap-2">
        <button
          className="px-3 py-2 rounded-md text-sm cursor-pointer focus:outline-none disabled:opacity-50"
          onClick={() => handlePageClick(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {pageNumbers.map((pageNumber) => (
          <li
            key={pageNumber}
            className={`px-3 py-2 rounded text-sm cursor-pointer hover:bg-gray-200 text-center ${
              currentPage === pageNumber ? "bg-[#5773FF]" : ""
            }`}
            onClick={() => handlePageClick(pageNumber)}
          >
            {pageNumber}
          </li>
        ))}
        <button
          className="px-3 py-2 rounded-md text-sm cursor-pointer focus:outline-none disabled:opacity-50"
          onClick={() => handlePageClick(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </ul>
    </div>
  );
};

export default Pagination;
