import { Route, Routes, BrowserRouter as Router } from "react-router-dom";
import Home from "../components/pages/Home";
import EndorseeQuestForm from "../components/forms/EndorseeQuestForm";
import Form2 from "../components/forms/Form2";
import EndorseeQuest from "../components/pages/EndorseeQuestReport";
import PageNotFound from "../utils/PageNotFound";

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
          {/* Add 404 page */}
          <Route path="*" element={<PageNotFound />}/>
        </Routes>
      </Router>
    </>
  );
};

export default AllRoutes;
