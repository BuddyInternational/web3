import axios from 'axios';
import React from 'react';
import { saveAs } from "file-saver";
import { toast } from 'react-toastify';
import { VanityData } from './Types';

// Server API Base URL
const server_api_base_url: any = process.env.REACT_APP_SERVER_API_BASE_URL;

const convertToCSV = (data: any[]) => {
    if (!data || data.length === 0) return "";
    const headers = Object.keys(data[0]);

    const rows = data.map((row) =>
      headers
        .map((header) =>
          JSON.stringify(row[header], (key, value) =>
            value === null ? "" : value
          )
        )
        .join(",")
    );
    return [headers.join(","), ...rows].join("\n");
  };

//   // Function to convert data to CSV format
//   const convertToVanityCSV = (array: VanityData[]) => {
//     const headers = Object.keys(array[0]).join(",") + "\n";
//     const rows = array.map((obj) => Object.values(obj).join(",")).join("\n");
//     return headers + rows;
//   };

//    // Function to fetch data from the backend
//    const downloadVanityData = async () => {
//     setShowModal(false);

//     if (vanityAddress === "0x0000000000000000000000000000000000000000") {
//       toast.error("Please connect your wallet to Download Vanity Data.");
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `${server_api_base_url}/api/vanity/downloadVanityAddress`
//       );

//       const responseCountLog = await axios.post(
//         `${server_api_base_url}/proxyVanityDataDownload`,
//         { vanityAddress },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       // Check if response.data exists and is an array
//       if (response.data.data && Array.isArray(response.data.data)) {
//         // // Filter data to exclude fields like _id and vanityPrivateKey
//         // const filteredData = response.data.data.map(
//         //   (item: {
//         //     walletAddress: string;
//         //     vanityAddress: string;
//         //     createdAt: string;
//         //   }) => {
//         //     const { walletAddress, vanityAddress, createdAt } = item;
//         //     return { walletAddress, vanityAddress, createdAt };
//         //   }
//         // );

//         // Filter data to exclude fields like _id and vanityPrivateKey
//         const filteredData = response.data.data.map(
//           (item: {
//             walletAddress: string;
//             vanityDetails: {
//               vanityAddress: string;
//               vanityPrivateKey: string;
//             }[];
//             createdAt: string;
//           }) => {
//             const { walletAddress, vanityDetails, createdAt } = item;
//             const vanityAddresses = vanityDetails.map(
//               (detail) => detail.vanityAddress
//             );
//             return { walletAddress, vanityAddresses, createdAt };
//           }
//         );

//         // Convert to CSV format
//         const csv = convertToVanityCSV(filteredData);
//         const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//         saveAs(blob, "data.csv");

//         // alert("The CSV file has been downloaded successfully.");  // Success message
//         toast.success("The CSV file has been downloaded successfully.");
//       } else {
//         console.log("No data found");
//         return;
//       }
//     } catch (error) {
//       console.error("Error fetching data", error);
//     }
//   };


  // Function to download the CSV file
  export const downloadUserContent = async (data: any[],vanityAddress: string) => {
    // setIsLoading(true);
    try {
      const responseUserContentCountLog = await axios.post(
        `${server_api_base_url}/proxyUserContentDownload`,
        { vanityAddress },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const filteredData = data.map(({ _id, ...rest }) => rest);
      const csvData = convertToCSV(filteredData);

      // Create a Blob from the CSV data
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

      saveAs(blob, "user_submissions.csv");
      toast.success("The CSV file has been downloaded successfully.");
    } catch (error: any) {
      toast.error("Failed to Download Screen Write CSV File!");
    //   setIsLoading(false);
    } finally {
    //   setIsLoading(false);
    }
  };

   // Function to download the CSV file
   export const downloadStoryLineContent = async (data: any[],vanityAddress: string) => {
    // setIsLoading(true);
    try{
    const responseStoryLineContentCountLog = await axios.post(
      `${server_api_base_url}/proxyStoryLineContentDownload`,
      { vanityAddress },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
    console.log("responseStoryLineContentCountLog----------",responseStoryLineContentCountLog)
    const filteredData = data.map(({ _id, ...rest }) => rest);
    const csvData = convertToCSV(filteredData);

    // Create a Blob from the CSV data
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });

    saveAs(blob, "storyLine_submissions.csv");
    toast.success("The CSV file has been downloaded successfully.");
  }
  catch(error:any){
    toast.error("Failed to Download Screen Write CSV File!");
    // setIsLoading(false);
  }
  finally{
    // setIsLoading(false);
  }
  };

  // Function to download the CSV file
  export const downloadScreenWriteContent = async (data: any[],vanityAddress: string) => {
    // setIsLoading(true);
    try{
      const responseScreenWriteContentCountLog = await axios.post(
        `${server_api_base_url}/proxyScreenWriteContentDownload`,
        { vanityAddress },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(
        "responseScreenWriteContentCountLog----------",
        responseScreenWriteContentCountLog
      );
      const filteredData = data.map(({ _id, ...rest }) => rest);
      const csvData = convertToCSV(filteredData);
  
      // Create a Blob from the CSV data
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  
      saveAs(blob, "screenWrite_submissions.csv");
      toast.success("The CSV file has been downloaded successfully.");
    }
    catch(error:any){
      toast.error("Failed to Download Screen Write CSV File!");
    //   setIsLoading(false);
    }
    finally{
    //   setIsLoading(false);
    }
  };
