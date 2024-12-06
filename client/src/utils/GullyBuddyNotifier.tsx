import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import axios from "axios";
import { ethers } from "ethers";

// const domain: string | undefined = process.env.REACT_APP_ETHEREUM_DOMAIN;
const domain: string | undefined = process.env.REACT_APP_MATIC_DOMAIN;

// const notificationDomains: Record<string, string | undefined> = {
//   "1": process.env.REACT_APP_ETHEREUM_DOMAIN, // Ethereum Mainnet
//   "137": process.env.REACT_APP_MATIC_DOMAIN ,  // Polygon Mainnet
//   "42161": process.env.REACT_APP_ARBITRUM_DOMAIN, // Arbitrum Mainnet
//   "8453": process.env.REACT_APP_BASE_DOMAIN, // Base Mainnet
// };

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
  const notifyGullyBuddy = async (sender: string, content: string,feesAmount: number) => {
    console.log(
      `Notifying Buddyinternational.eth Sender: ${sender}, Content: ${content}`
    );

    console.log("fees Amount-----------",feesAmount);

    // const network = await ethersProvider.getNetwork();
    // const chainId = network.chainId.toString();

    // console.log("network=============",network);
    // console.log("chainId=============",chainId);

    // const domainOrAddress = notificationDomains[chainId];

    // if (!domainOrAddress) {
    //   console.error(
    //     `No domain configured for chainId ${chainId}. Ensure the domain are set correctly.`
    //   );
    //   return false;
    // }

    // console.log("domainOrAddress!", domainOrAddress!);
    console.log("domain!", domain!);

    const gullyBuddyAddress = await resolveENSName(domain!);
    console.log("ENS Name :", gullyBuddyAddress);

    if (gullyBuddyAddress) {
      console.log(
        `Resolved address for Buddyinternational.eth: ${gullyBuddyAddress}`
      );

      // Step 1: Send the notification message
      const notificationTx = await sendNotificationTransaction(
        gullyBuddyAddress,
        content,
      );
      if (!notificationTx) {
        console.error("Failed to send notification message.");
        return false;
      }

      // Step 2: Send the equivalent of 10 USD in ETH
      const paymentTx = await sendPaymentTransaction(gullyBuddyAddress, feesAmount);
      if (!paymentTx) {
        console.error("Failed to send payment.");
        return false;
      }

      console.log("Notification and payment completed successfully.");
      return notificationTx;
    } else {
      console.error("Failed to resolve Buddyinternational.eth");
      return false;
    }
  };

  // Resolve Domain name
  const resolveENSName = async (ensName: string) => {
    try {
      const ensAddress = await ethersProvider.resolveName(ensName);
      console.log("ENS Domain address----------", ensAddress);
      return ensAddress;
    } catch (error) {
      console.error(`Error resolving ENS name ${ensName}:`, error);
      return null;
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
    } catch (error) {
      console.error("Error sending notification transaction:", error);
      return false;
    }
  };

  // send Payment Transaction to send fees to domain for onchain message.
  const sendPaymentTransaction = async (
    toAddress: string,
    amountInUSD: number
  ) => {
    try {
      const signer = await ethersProvider.getSigner();

      // Fetch conversion rate from USD to ETH
      const options = {
        method: "GET",
        url: "https://api.fxratesapi.com/latest",
        params: {
          base: "USD",
          currencies: "ETH",
          resolution: "1m",
          amount: 1,
          places: 6,
          format: "json",
        },
      };

      const response = await axios.request(options);
      const usdToEthRate = response.data.rates.ETH;

      if (!usdToEthRate) {
        console.error("Failed to retrieve USD to ETH conversion rate.");
        return false;
      }

      // Calculate the amount in ETH
      const amountInEth = ethers.parseUnits(
        (amountInUSD * usdToEthRate).toFixed(18),
        "ether"
      );

      const paymentTx = await signer.sendTransaction({
        to: toAddress,
        value: amountInEth,
      });

      await paymentTx.wait();
      console.log(
        "Payment transaction sent to Buddyinternational.eth:",
        paymentTx
      );

      return paymentTx;
    } catch (error) {
      console.error("Error sending payment transaction:", error);
      return false;
    }
  };

  return { notifyGullyBuddy };
};
