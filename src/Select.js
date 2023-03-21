import * as React from "react";
import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useState, useEffect } from "react";

export default function Tags(props) {
  const { traits, applyFilter, cName } = props;
  const [selectedOptions, setSelectedOptions] = useState([]);

  const options = [];
  traits.forEach((category) => {
    const groupName = category.name;
    const groupOptions = category.traits.map((option) => ({
      label: option[0],
      count: option[1],
      group: groupName,
    }));
    options.push(...groupOptions);
  });

  const handleSelectedOptions = (event, value) => {
    const isOptionSelected = selectedOptions.some(
      (item) => item.label == value.label
    );
    if (isOptionSelected) {
      return;
    } else {
      setSelectedOptions(value);
      applyFilter(value);
    }
  };

  useEffect(() => {
    setSelectedOptions([]);
    applyFilter();
  }, [cName]);

  const isOptionEqualToValue = (option, value) =>
    option.label === value.label &&
    option.count === value.count &&
    option.group === value.group;

  return (
    <Autocomplete
      blurOnSelect
      PaperComponent={({ children }) => (
        <Box
          sx={{
            border: "1px solid #3D3EC2",
            boxShadow: "0 0 10px 0 #3D3EC2",
            color: "#F2B843",
            backgroundColor: "#1a2027",
            "& .MuiAutocomplete-groupLabel": {
              fontSize: "1rem",
            },
          }}
        >
          {children}
        </Box>
      )}
      sx={{
        paddingTop: "0.5rem",
        paddingBottom: "0.8rem",
        "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
          color: "#F2B843",
        },
        "& .MuiAutocomplete-clearIndicator .MuiSvgIcon-root": {
          color: "#F2B843",
        },
        "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
          borderColor: "#3D3EC2",
          boxShadow: "0 0 10px 0 #3D3EC2",
        },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "#3D3EC2",
            boxShadow: "0 0 5px 0 3D3EC2",
          },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
          color: "3D3EC2",
        },
        "& .MuiInputLabel-outlined.Mui-focused": {
          color: "#BCBFC3",
        },
        "& .MuiOutlinedInput-input": {
          color: "#BCBFC3",
        },
        "& label.Mui-focused": {
          color: "3D3EC2",
        },

        "& .MuiAutocomplete-option:hover": {
          backgroundColor: "#1e1e1e",
          transition: "background-color 0.3s ease",
          boxShadow: "0 0 5px 0 3D3EC2",
        },
        "& .MuiAutocomplete-option:hover *": {
          color: "#3D3EC2",
          transition: "color 0.3s ease",
        },
      }}
      multiple
      isOptionEqualToValue={isOptionEqualToValue}
      id="tags-outlined"
      options={options}
      groupBy={(option) => option.group}
      getOptionLabel={(option) => option.label}
      renderOption={(props, option) => {
        const isOptionSelected = selectedOptions.some(
          (item) => item.label == option.label
        );
        return (
          <li
            {...props}
            style={{
              backgroundColor: isOptionSelected ? "#f2b843" : "#262626",
              color: isOptionSelected ? "black" : "#f8f8ff",
              fontSize: "1rem",
            }}
          >
            {option.label} ({option.count})
          </li>
        );
      }}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            sx={{
              color: "#1e1e1e",
              backgroundColor: "#f2b843",
              borderColor: "#f2b843",
              fontSize: "0.9rem",
              fontWeight: "700",
              "& .MuiChip-deleteIcon": {
                color: "#3D3EC2", // replace with the desired color
              },
            }}
            variant="outlined"
            label={`${option.label} (${option.count})`}
            {...getTagProps({ index })}
          />
        ))
      }
      value={selectedOptions}
      onChange={handleSelectedOptions}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Filter By Attributes"
          placeholder={
            selectedOptions.length === 0 ? "Filter By Attributes" : null
          }
        />
      )}
    />
  );
}
