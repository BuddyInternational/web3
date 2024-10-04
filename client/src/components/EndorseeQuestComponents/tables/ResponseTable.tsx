import React, { useEffect, useMemo, useState } from "react";
import { Submission } from "../../../utils/Types";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const ResponseTable: React.FC<{ ResponseDetails: Submission[] }> = ({
  ResponseDetails,
}) => {
  const [tableData, setTableData] = useState<any[]>([]);

  const fetchresponseData = () => {
    const processedData = ResponseDetails.map((submission) => {
      const walletAddress = submission.answers[18].answer;

      // Check if walletAddress is a string before using slice
      const slicedWalletAddress =
        typeof walletAddress === "string"
          ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
          : walletAddress;

      // Determine if the answer for the name field is an object or a string
      const nameAnswer = submission.answers[3].answer;

      const firstName = typeof nameAnswer === "object" ? nameAnswer.first : "";
      const lastName = typeof nameAnswer === "object" ? nameAnswer.last : "";
      return {
        submissionId: submission.id,
        walletAddress: slicedWalletAddress,
        firstname: firstName,
        lastname: lastName,
        marketplace: submission.answers[12].answer,
      };
    });
    setTableData(processedData);
  };

  useEffect(() => {
    fetchresponseData();
  }, [ResponseDetails]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "submissionId",
        header: "SubmissionId",
        muiTableHeadCellProps: { sx: { color: "#3B82F6" } },
      },
      {
        accessorKey: "walletAddress",
        header: "WalletAddress",
        muiTableHeadCellProps: { sx: { color: "#3B82F6" } },
      },
      {
        accessorKey: "firstname",
        header: "FirstName",
        muiTableHeadCellProps: { sx: { color: "#3B82F6" } },
      },
      {
        accessorKey: "lastname",
        header: "LastName",
        muiTableHeadCellProps: { sx: { color: "#3B82F6" } },
      },
      {
        accessorKey: "marketplace",
        header: "MarketPlace?",
        muiTableHeadCellProps: { sx: { color: "#3B82F6" } },
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    data: tableData,
    columns,
  });

  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};

export default ResponseTable;
