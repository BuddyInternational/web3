import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { BsHandIndexThumbFill } from "react-icons/bs";

interface CardMedianTokenFilterMenusProps {
  uniqueMedianTokenNumbers: number[];
  selectedMedianToken: number | null;
  setSelectedMedianToken: (value: number | null) => void;
  component: string;
}

const CardMedianTokenFilterMenus: React.FC<CardMedianTokenFilterMenusProps> = ({
  uniqueMedianTokenNumbers,
  selectedMedianToken,
  setSelectedMedianToken,
  component,
}) => {
  const handleChange = (event: SelectChangeEvent<string | number>) => {
    const value = event.target.value;

    // If the value is an empty string (All Median Tokens), set it to null
    if (value === -1) {
      setSelectedMedianToken(-1);
    } else {
      // Ensure that the value is a number
      setSelectedMedianToken(Number(value));
    }
  };

  const inputLabelColor = component === "SocketNFT" ? "#000000" : "#5692D9";
  const selectColor = component === "SocketNFT" ? "black" : "white";

  return (
    <div className="">
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel
          id="median-token-select-label"
          sx={{ color: inputLabelColor }}
        >
          Median Tokens
        </InputLabel>
        <Select
          labelId="median-token-select-label"
          id="median-token-select"
          value={selectedMedianToken ?? ""}
          label="Median Tokens"
          onChange={handleChange}
          variant="outlined"
          displayEmpty
          sx={{
            color: selectColor,
            "& .MuiSelect-icon": {
              color: selectColor,
            },
          }}
        >
          <MenuItem value={-1} sx={{}}>
            <em>All Median Tokens</em>
          </MenuItem>
          {uniqueMedianTokenNumbers.map((value: any, index) => (
            <MenuItem key={index} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CardMedianTokenFilterMenus;
