import { Route, Routes,BrowserRouter as Router} from "react-router-dom";
import Home from "../components/Home";

const AllRoutes = () => {
    return (
        <>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
        </>
      );
};

export default AllRoutes;
