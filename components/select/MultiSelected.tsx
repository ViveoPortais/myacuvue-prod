import * as React from "react";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import { Box, Chip, SelectOption } from "@mui/joy";

type OptionType = {
  value: string;
  label: string;
};

interface MultiSelectedProps {
  options: OptionType[];
  value?: string[];
  onChange: (event: React.SyntheticEvent | null, newValue: string[]) => void;
  placeholder?: string;
  customClass?: string;
  name?: string;
  id?: string;
  disabled?: any;
}

export default function MultiSelected({
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  customClass,
  name,
  id,
  disabled,
}: MultiSelectedProps) {
  return (
    <Select
      disabled={disabled}
      id={id}
      name={name}
      multiple
      value={value}
      onChange={onChange}
      placeholder={placeholder}
       className={customClass}
      renderValue={(selected: SelectOption<string>[]) => (
        <Box
    sx={{
      display: "flex",
      flexWrap: "wrap",
      gap: "0.25rem",
      alignItems: "flex-start",
      minHeight: "2.5rem",
    }}
  >
          {selected.map((option) => (
            <Chip key={option.value} variant="soft" color="primary">
              {option.label ?? option.value}
            </Chip>
          ))}
        </Box>
      )}
      sx={{ minWidth: "15rem" }}
      slotProps={{
        listbox: {
          sx: {
            width: "100%",
          },
        },
      }}
    >
      {options.map((option) => (
        <Option key={option.value} value={option.value} label={option.label}>
          {option.label}
        </Option>
      ))}
    </Select>
  );
}
