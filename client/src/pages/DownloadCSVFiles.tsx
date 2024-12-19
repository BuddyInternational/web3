import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";
import { Box, Typography, IconButton } from "@mui/material";
import { MdKeyboardBackspace } from "react-icons/md";
import { Link as RouterLink } from "react-router-dom";
import { FaFileDownload } from "react-icons/fa";
import {
  downloadScreenWriteContent,
  downloadStoryLineContent,
  downloadUserContent,
} from "../utils/DownloadCSV";
import { getUserContent } from "../api/userContentAPI";
import { useWeb3ModalAccount } from "@web3modal/ethers/react";
import { useVanityContext } from "../context/VanityContext";
import { getStoryLineContent } from "../api/storyLineContentAPI";
import { getScreenWriteContent } from "../api/screenWriteContentAPI";
import { toast } from "react-toastify";
import axios from "axios";
import { saveAs } from "file-saver";
import { VanityData } from "../utils/Types";
import { useLoader } from "../context/LoaderContext";
import Loader from "../utils/Loader";

// Custom styled components
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

const DownloadCSV = () => {
  const { address, isConnected } = useWeb3ModalAccount();
  const { vanityAddress } = useVanityContext();
  const [userContent, setUserContent] = React.useState([]);
  const [storyLineContent, setStoryLineContent] = React.useState([]);
  const [screenWriteContent, setScreenWriteContent] = React.useState([]);
  const { isLoading, setIsLoading } = useLoader();

  // Function to convert data to CSV format
  const convertToCSV = (array: VanityData[]) => {
    const headers = Object.keys(array[0]).join(",") + "\n";
    const rows = array.map((obj) => Object.values(obj).join(",")).join("\n");
    return headers + rows;
  };

  // Function to fetch data from the backend
  const downloadVanityData = async () => {
    if (vanityAddress === "0x0000000000000000000000000000000000000000") {
      toast.error("Please connect your wallet to Download Vanity Data.");
      return;
    }
    try {
      const response = await axios.get(
        `${server_api_base_url}/api/vanity/downloadVanityAddress`
      );

      console.log("response=================", response);

      const responseCountLog = await axios.post(
        `${server_api_base_url}/proxyVanityDataDownload`,
        { vanityAddress },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Check if response.data exists and is an array
      if (response.data.data && Array.isArray(response.data.data)) {
        // Filter data to exclude fields like _id and vanityPrivateKey
        const filteredData = response.data.data.map(
          (item: {
            walletAddress: string;
            vanityDetails: {
              vanityAddress: string;
              vanityPrivateKey: string;
            }[];
            createdAt: string;
          }) => {
            const { walletAddress, vanityDetails, createdAt } = item;
            const vanityAddresses = vanityDetails.map(
              (detail) => detail.vanityAddress
            );
            return { walletAddress, vanityAddresses, createdAt };
          }
        );

        // Convert to CSV format
        const csv = convertToCSV(filteredData);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        saveAs(blob, "data.csv");

        // alert("The CSV file has been downloaded successfully.");  // Success message
        toast.success("The CSV file has been downloaded successfully.");
      } else {
        console.log("No data found");
        return;
      }
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  // Fetch user Content from Database
  const fetchUserContent = async () => {
    if (address && isConnected) {
      const userContent = await getUserContent(vanityAddress!);
      if (userContent && userContent.data) {
        setUserContent(userContent.data.contentDetails || []);
      }
    }
  };

  // Fetch story Line Content from Database
  const fetchStoryLineContent = async () => {
    if (address && isConnected) {
      const storyLineContent = await getStoryLineContent(vanityAddress!);
      if (storyLineContent && storyLineContent.data) {
        setStoryLineContent(storyLineContent.data.contentDetails || []);
      }
    }
  };

  // Fetch screen Write Content from Database
  const fetchScreenWriteContent = async () => {
    if (address && isConnected) {
      const screenWriteContent = await getScreenWriteContent(vanityAddress!);
      if (screenWriteContent && screenWriteContent.data) {
        setScreenWriteContent(screenWriteContent.data.contentDetails || []);
      }
    }
  };

  React.useEffect(() => {
    fetchUserContent();
    fetchStoryLineContent();
    fetchScreenWriteContent();
  }, [address, isConnected]);

  // Table data
  const rows = [
    {
      id: 1,
      name: "Vanity Data",
      func: async () => {
        setIsLoading(true);
        try {
          await downloadVanityData();
        } finally {
          setIsLoading(false);
        }
      },
    },
    {
      id: 2,
      name: "User Content",
      func: async() => {
        setIsLoading(true);
        try {
          await downloadUserContent(userContent, vanityAddress);
        } finally {
          setIsLoading(false);
        }
      },
    },
    {
      id: 3,
      name: "Storyline Content",
      func: async() => {
        setIsLoading(true);
        try{
          await downloadStoryLineContent(storyLineContent, vanityAddress);
        }
        finally{
          setIsLoading(false);
        }
      },
    },
    {
      id: 4,
      name: "Screen Write Content",
      func: async() => {
        setIsLoading(true);
        try{
          await downloadScreenWriteContent(screenWriteContent, vanityAddress);
        }
        finally{
          setIsLoading(false);
        }
      },
    },
  ];
  return (
    <>
      {isLoading && <Loader />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 2,
          paddingBottom: 4,
        }}
      >
        {/* Back Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            maxWidth: 800,
            marginBottom: 2,
            paddingLeft: 2,
          }}
        >
          <IconButton
            component={RouterLink}
            to="/"
            sx={{
              color: "#3b82f6",
              fontSize: "1.5rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <MdKeyboardBackspace className="text-3xl text-white mr-2" />
          </IconButton>
        </Box>

        {/* Heading */}
        <Typography
          variant="h4"
          component="h2"
          align="center"
          gutterBottom
          color="#3b82f6"
          sx={{ fontWeight: "bold", marginTop: 2 }}
        >
          Download Content CSV Files
        </Typography>

        {/* Table */}
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 800, margin: "auto", marginTop: 4 }}
        >
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Content Type</StyledTableCell>
                <StyledTableCell align="center">Download Link</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell>{row.id}</StyledTableCell>
                  <StyledTableCell>{row.name}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Link
                      download
                      underline="hover"
                      color="primary"
                      onClick={row.func ? row.func : () => {}}
                      sx={{
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 0.5,
                        cursor: "pointer",
                      }}
                    >
                      Download
                      <FaFileDownload />
                    </Link>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default DownloadCSV;
