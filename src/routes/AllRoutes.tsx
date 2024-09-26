import { Route, Routes,BrowserRouter as Router} from "react-router-dom";
import Home from "../components/Home";
import Form1 from "../components/forms/EndorseeQuestForm";
import Form2 from "../components/forms/Form2";
import EndorseeQuest from "../components/responseReports/EndorseeQuestReport";

const AllRoutes = () => {
    return (
        <>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jotform1" element={<Form1 />} />
              <Route path="/jotform2" element={<Form2 />} />
              <Route path="/quest/completed/:walletAddress" element={<EndorseeQuest />} />
            </Routes>
          </Router>
        </>
      );
};

export default AllRoutes;
