import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "../pages/Home";
import EndorseeQuestForm from "../components/EndorseeQuestComponents/forms/EndorseeQuestForm";
import Form2 from "../components/EndorseeQuestComponents/forms/Form2";
import Sponsorship from "../components/EndorseeQuestComponents/forms/Sponsorship";
import EndorseeQuest from "../pages/EndorseeQuestReport";
// import PageNotFound from "../utils/PageNotFound";
import OrderNFTApparelForm from "../components/homeComponents/card/OrderNFTApparelForm";
import NotFound from "../utils/NotFound";
import Shop from "../pages/Shop";
import ContributeContent from "../pages/ContributeContent";
import SocketNFTDetails from "../pages/SocketNFTDetails";
import CreateStoryLines from "../pages/CreateStoryLines";
import { AnimatePresence } from "framer-motion";
import ScreenWrite from "../pages/ScreenWrite";
import DownloadCSV from "../pages/DownloadCSVFiles";
import GetStartedForm from "../components/EndorseeQuestComponents/forms/GetStartedForm";

const AllRoutes = () => {
  return (
    <>
    <AnimatePresence mode="wait">
      {/* <Router> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/endorsee/quest" element={<EndorseeQuestForm />} />
          <Route path="/jotform2" element={<Form2 />} />
          <Route path="/sponsorship" element={<Sponsorship />} />
          <Route
            path="/quest/completed/:walletAddress"
            element={<EndorseeQuest />}
          />
          <Route
            path="/getStarted"
            element={<GetStartedForm />}
          />
          <Route
            path="/content/:walletAddress"
            element={<ContributeContent />}
          />
          <Route
            path="/storylinescontent/:walletAddress"
            element={<CreateStoryLines />}
          />
          <Route
            path="/screenwrite/:walletAddress"
            element={<ScreenWrite />}
          />
          <Route path="/order/NFTApparel" element={<OrderNFTApparelForm />} />
          <Route path="/nft/socketNFT/:vanityAddress" element={<SocketNFTDetails />} />
          <Route path="/nft/shop" element={<Shop />} />
          <Route path="/downloadCSV" element={<DownloadCSV />} />
          {/* Add 404 page */}
          {/* <Route path="*" element={<PageNotFound />} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      {/* </Router> */}
      </AnimatePresence>
    </>
  );
};

export default AllRoutes;
