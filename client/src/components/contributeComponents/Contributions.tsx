import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";

interface Submission {
  mood: string;
  content: string;
  generateContentDate: string;
}

interface ContributionsProps {
  submissions: Submission[];
}

const Contributions: React.FC<ContributionsProps> = ({ submissions }) => {

  return (
    <div className="border-2 border-blue-400 rounded-md">
      {submissions.map((submission, index) => (
        <Accordion
          key={index}
          sx={{ backgroundColor: "#1f2937", color: "white" }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
            aria-controls={`panel${index}-content`}
            id={`panel${index}-header`}
          >
            <div className="flex sm:flex-col md:flex-row sm:justify-center md:justify-between w-full gap-2">
              <div className="flex-1 sm:text-center md:text-left">
                <Typography
                  variant="body2"
                  color="inherit"
                  sx={{
                    margin: { sm: "auto", md: "auto" },
                  }}
                >
                  {new Date(submission.generateContentDate).toLocaleString()}
                </Typography>
              </div>
              <div className="flex-1 text-center">
                <Typography
                  variant="body2"
                  color="inherit"
                  sx={{
                    margin: { sm: "auto", md: "auto" },
                  }}
                >
                  {submission.mood}
                </Typography>
              </div>
              <div className="flex-1 sm:text-center md:text-right">
                <Button
                  variant="outlined"
                  color="primary"
                  size="small"
                  sx={{
                    display: { sm: "block", md: "inline-block" },
                    padding: { sm: "4px 8px", md: "4px 8px" },
                    fontSize: { sm: "0.75rem", md: "0.875rem" },
                    margin: { sm: "auto", md: "0px" },
                  }}
                  // onClick={() => {
                  //   return alert("Submit Application");
                  // }}
                >
                  Submit Application
                </Button>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="inherit">
              {submission.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  );
};

export default Contributions;
