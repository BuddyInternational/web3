import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "../pages/Home";
import EndorseeQuestForm from "../components/EndorseeQuestComponents/forms/EndorseeQuestForm";
import Form2 from "../components/EndorseeQuestComponents/forms/Form2";
import EndorseeQuest from "../pages/EndorseeQuestReport";
import PageNotFound from "../utils/PageNotFound";
import OrderNFTApparelForm from "../components/homeComponents/card/OrderNFTApparelForm";

const AllRoutes = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/endorsee/quest" element={<EndorseeQuestForm />} />
          <Route path="/jotform2" element={<Form2 />} />
          <Route
            path="/quest/completed/:walletAddress"
            element={<EndorseeQuest />}
          />
          <Route path="/order/NFTApparel" element={<OrderNFTApparelForm />} />
          {/* Add 404 page */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </>
  );
};

export default AllRoutes;
