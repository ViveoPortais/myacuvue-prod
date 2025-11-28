import React from "react";
import { Checkbox, FormControlLabel } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

interface CustomCheckboxProps {
  label: string;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const CustomCheckbox = ({
  label,
  checked,
  onChange,
  disabled = false,
}: CustomCheckboxProps) => {
  return (
    <FormControlLabel
      className="mt-2"
      control={
        <Checkbox
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          icon={
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                border: "2px solid #84BDDF",
                display: "inline-block",
              }}
            />
          }
          checkedIcon={
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                backgroundColor: "#0071BC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon style={{ fontSize: 16, color: "#fff" }} />
            </span>
          }
        />
      }
      label={<span className="text-neutral-500 text-sm">{label}</span>}
    />
  );
};

export default CustomCheckbox;
