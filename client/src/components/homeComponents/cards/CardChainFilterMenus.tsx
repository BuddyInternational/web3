import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface CardChainFilterMenusProps {
  uniqueChains: string[];
  selectedChain: string;
  setSelectedChain: (chain: string) => void;
}

const CardChainFilterMenus: React.FC<CardChainFilterMenusProps> = ({
  uniqueChains,
  selectedChain,
  setSelectedChain,
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedChain(event.target.value);
  };

  return (
    <div className="">
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="chain-select-label" sx={{ color: "#5692D9" }}>
          Chain
        </InputLabel>
        <Select
          labelId="chain-select-label"
          id="chain-select"
          value={selectedChain}
          label="Chain"
          displayEmpty
          onChange={handleChange}
          variant="outlined"
          sx={{
            color: "white",
            "& .MuiSelect-icon": {
              color: "white",
            },
          }}
        >
          <MenuItem value="All" sx={{}}>
            <em>All Chain</em>
          </MenuItem>
          {uniqueChains.map((chain, index) => (
            <MenuItem key={index} value={chain} sx={{}}>
              {chain}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CardChainFilterMenus;
