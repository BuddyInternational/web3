import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

interface CardChainFilterMenusProps {
  uniqueChains: string[];
  selectedChain: string;
  setSelectedChain: (chain: string) => void;
  component: string;
}

const CardChainFilterMenus: React.FC<CardChainFilterMenusProps> = ({
  uniqueChains,
  selectedChain,
  setSelectedChain,
  component
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedChain(event.target.value);
  };
  const inputLabelColor = component === "SocketNFT" ? "#000000" : "#5692D9";
  const selectColor = component === "SocketNFT" ? "black" : "white";

  return (
    <div className="">
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <InputLabel id="chain-select-label" sx={{ color: inputLabelColor }}>
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
            color: selectColor,
            "& .MuiSelect-icon": {
              color: selectColor,
            },
          }}
        >
          <MenuItem value="All" sx={{}}>
            <em>All Chain</em>
          </MenuItem>
          {uniqueChains.map((chain, index) => (
            <MenuItem key={index} value={chain} sx={{}}>
              {chain === "Matic" ? "Polygon" :chain}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default CardChainFilterMenus;
