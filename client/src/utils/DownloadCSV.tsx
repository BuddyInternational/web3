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
