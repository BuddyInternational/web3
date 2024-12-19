import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import axios from "axios";
import { ethers } from "ethers";

// const domain: string | undefined = process.env.REACT_APP_ETHEREUM_DOMAIN;
// const domain: string | undefined = process.env.REACT_APP_MATIC_DOMAIN;

const Polygon_domain_address = process.env.REACT_APP_POLYGON_DOMAIN_ADDRESS!;

const notificationDomains: Record<string, string | undefined> = {
  "1": process.env.REACT_APP_ETHEREUM_DOMAIN, // Ethereum Mainnet
  "137": process.env.REACT_APP_MATIC_DOMAIN, // Polygon Mainnet
  // "42161": process.env.REACT_APP_ARBITRUM_DOMAIN, // Arbitrum Mainnet
  // "8453": process.env.REACT_APP_BASE_DOMAIN, // Base Mainnet
};

// Custom Hook to manage notification
export const useGullyBuddyNotifier = () => {
  const { walletProvider } = useWeb3ModalProvider();

  // Ensure walletProvider is defined before using it
  if (!walletProvider) {
    console.log("Wallet provider is not initialized.");
    return {
      notifyGullyBuddy: () => Promise.reject("Provider not initialized"),
    };
  }
  const ethersProvider = new ethers.BrowserProvider(
    walletProvider as ethers.Eip1193Provider
  );

  // Notify GullyBuddy
  const notifyGullyBuddy = async (
    sender: string,
    content: string,
    feesAmount: number
  ) => {
    console.log(
      `Notifying Buddyinternational.eth Sender: ${sender}, Content: ${content}`
    );
    console.log("Fees Amount:", feesAmount);

    try {
      // Get the connected chain ID
      const network = await ethersProvider.getNetwork();
      console.log("Network in use:", network);
      const chainId = network.chainId.toString();
      console.log("Connected chain ID:", chainId);

      // Select the domain based on the chain ID
      const domainOrAddress = notificationDomains[chainId];

      if (!domainOrAddress) {
        const errorMessage = `No domain configured for chainId ${chainId}. Ensure domains are set correctly in the environment variables.`;
        console.error(
          `No domain configured for chainId ${chainId}. Ensure domains are set correctly in the environment variables.`
        );
        throw new Error(errorMessage);
        // return false;
      }

      console.log("Selected domain or ENS address:", domainOrAddress);

      let gullyBuddyAddress: string | null = "";
      // Resolve the ENS name to an address
      if (chainId === "1") {
        gullyBuddyAddress = await resolveENSName(domainOrAddress);
        console.log("Resolved ENS Address:", gullyBuddyAddress);
      } else if (chainId === "137") {
        // gullyBuddyAddress = "0x82FAA8FAc390247A3FBde349BD37068567505cbD";
        gullyBuddyAddress = Polygon_domain_address;
        console.log("gullyBuddyAddress==========", gullyBuddyAddress);
      } else {
        const errorMessage = `No domain configured for chainId ${chainId}. Ensure domains are set correctly in the environment variables.`;
        console.error(
          `No domain configured for chainId ${chainId}. Ensure domains are set correctly in the environment variables.`
        );
        throw new Error(errorMessage);
      }

      if (gullyBuddyAddress) {
        console.log(`Resolved address for domain: ${gullyBuddyAddress}`);

        // Send notification
        const notificationTx = await sendNotificationTransaction(
          gullyBuddyAddress,
          content
        );
        if (!notificationTx) {
          console.error("Failed to send notification message.");
          throw new Error("Failed to send notification message.");
          // return false;
        }

        // Send payment
        const paymentTx = await sendPaymentTransaction(
          gullyBuddyAddress,
          feesAmount,
          chainId
        );
        if (!paymentTx) {
          console.error("Failed to send payment.");
          throw new Error("Failed to send payment.");
          // return false;
        }

        console.log("Notification and payment completed successfully.");
        // return notificationTx;
        return {
          notificationTxHash: notificationTx.hash,
          paymentTxHash: paymentTx.hash,
          chainId: Number(chainId),
        };
      } else {
        console.error("Failed to resolve ENS name.");
        throw new Error("Failed to resolve ENS name.");
        // return false;
      }
    } catch (error) {
      console.error("Error in notifyGullyBuddy:", error);
      throw error;
      // return false;
    }
  };

  // Resolve Domain name
  const resolveENSName = async (ensName: string) => {
    try {
      const ensAddress = await ethersProvider.resolveName(ensName);
      console.log("ENS Domain address----------", ensAddress);
      return ensAddress;
    } catch (error: any) {
      console.error(`Error resolving ENS name ${ensName}:`, error);
      console.log(`Error resolving ENS name ${ensName}:`, error);
      throw new Error(`Error resolving ENS name ${ensName}: ${error.message}`);
      // return null;
    }
  };

  //  send notification to domain
  const sendNotificationTransaction = async (
    toAddress: string,
    messageContent: string
  ) => {
    try {
      const signer = await ethersProvider.getSigner();
      const encodedMessage = ethers.hexlify(ethers.toUtf8Bytes(messageContent));

      const tx = await signer.sendTransaction({
        to: toAddress,
        value: 0,
        data: encodedMessage,
      });

      await tx.wait();
      console.log(
        "Notification transaction sent to Buddyinternational.eth:",
        tx
      );
      return tx;
    } catch (error: any) {
      console.error("Error sending notification transaction:", error);
      throw new Error(
        "Error sending notification transaction: " + error.message
      );
      // return false;
    }
  };

  // // send Payment Transaction to send fees to domain for onchain message.
  const sendPaymentTransaction = async (
    toAddress: string,
    amountInUSD: number,
    chainId: string
  ) => {
    try {
      let nativeCurrencySymbol: string;

      // Dynamically assign native currency symbol based on chainId
      if (chainId === "1") {
        nativeCurrencySymbol = "Ethereum"; // For ETH
      } else if (chainId === "137") {
        nativeCurrencySymbol = "Polygon"; // For MATIC
      } else {
        throw new Error(
          "Unsupported chain. Please use 'ethereum' or 'polygon'."
        );
      }

      // Fetch the conversion rate from Mobula API
      // const mobulaApiKey = 'YOUR_MOBULA_API_KEY'; // Replace with your Mobula API key
      const mobulaUrl = `https://api.mobula.io/api/1/market/data?asset=${nativeCurrencySymbol}`;

      const response = await axios.get(mobulaUrl, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: mobulaApiKey,
        },
      });

      console.log("Price response:", response.data.data.price);

      const priceInUSD = response.data.data.price;

      if (!priceInUSD) {
        console.error(
          `Failed to retrieve ${nativeCurrencySymbol} price in USD.`
        );
        return false;
      }

      console.log(`${nativeCurrencySymbol} price in USD:`, priceInUSD);

      // Calculate the amount in native currency (ETH or MATIC)
      const amountInNativeCurrency = ethers.parseUnits(
        (amountInUSD / priceInUSD).toFixed(18), // Convert USD to the native currency amount
        "ether" // Assuming 18 decimals
      );

      console.log(
        "Amount in native currency:",
        amountInNativeCurrency.toString()
      );

      // Fetch signer and balance
      const signer = await ethersProvider.getSigner();
      const signerBalance = await ethersProvider.getBalance(signer.address);
      console.log("Signer balance:", signerBalance.toString());

      if (signerBalance < amountInNativeCurrency) {
        throw new Error("Insufficient balance to send transaction.");
      }
      // Sending the transaction
      // const signer = await ethersProvider.getSigner();
      const paymentTx = await signer.sendTransaction({
        to: toAddress,
        // value: ethers.parseUnits("0.8355614973262031","ether"), // Send the calculated amount
        value: amountInNativeCurrency, // Send the calculated amount
      });

      await paymentTx.wait();
      console.log("Payment transaction sent:", paymentTx);
      return paymentTx;
    } catch (error: any) {
      console.error("Error sending payment transaction:", error);
      throw new Error("Error sending payment transaction: " + error.message);
    }
  };

  return { notifyGullyBuddy };
};
