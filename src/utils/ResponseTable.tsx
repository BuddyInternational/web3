import React, { useEffect, useMemo, useState } from "react";
import { Submission } from "./Types";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";

const ResponseTable: React.FC<{ ResponseDetails: Submission[] }> = ({
  ResponseDetails,
}) => {
  const [tableData, setTableData] = useState<any[]>([]);

  const fetchresponseData = () => {
    const processedData = ResponseDetails.map((submission) => ({
      submissionId: submission.id,
      walletAddress: submission.answers[15].answer,
      firstname: submission.answers[3].answer?.first,
      lastname: submission.answers[3].answer?.last,
      marketplace: submission.answers[12].answer,
    }));
    setTableData(processedData);
  };
  useEffect(() => {
    fetchresponseData();
  }, [ResponseDetails]);

  const columns = useMemo(
    () => [
      {
        accessorKey: "submissionId", //simple recommended way to define a column
        header: "SubmissionId",
        muiTableHeadCellProps: { sx: { color: "green" } }, //custom props
      },
      {
        accessorKey: "walletAddress",
        header: "WalletAddress",
        muiTableHeadCellProps: { sx: { color: "green" } },
      },
      {
        accessorKey: "firstname",
        header: "FirstName",
        muiTableHeadCellProps: { sx: { color: "green" } },
      },
      {
        accessorKey: "lastname",
        header: "LastName",
        muiTableHeadCellProps: { sx: { color: "green" } },
      },
      {
        accessorKey: "marketplace",
        header: "MarketPlace?",
        muiTableHeadCellProps: { sx: { color: "green" } },
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
