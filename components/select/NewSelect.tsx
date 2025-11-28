import React, { HTMLAttributes } from "react";
import Select, { SelectProps } from "@mui/material/Select";
import { InputLabel, MenuItem } from "@mui/material";
import { MdKeyboardArrowDown } from "react-icons/md"; // Mantendo o ícone da seta
import useClientConfiguration from "@/hooks/useClientConfiguration";
import { IconType } from "react-icons";
import Image from "next/image";

interface ISelectProps {
  placeholder?: string;
  name?: string;
  label?: string;
  customClass?: string;
  disabled?: boolean;
  required?: boolean;
  style?: HTMLAttributes<HTMLInputElement>;
  options?: any[];
  iconStart?: IconType;
  fullWidth?: boolean;
  value?: any;
  startIcon?: boolean;
  iconClass?: string;
  iconColor?: string;
  imageSrc?: string;
}

export type Props<T> = SelectProps<T> & ISelectProps;

const NewSelect = <T extends unknown>({
  className,
  label,
  iconStart: Icon,
  iconClass,
  iconColor,
  placeholder,
  customClass,
  disabled,
  required,
  style,
  options,
  value,
  fullWidth,
  startIcon,
  imageSrc,
  ...props
}: Props<T>) => {
  const { colors } = useClientConfiguration();

  return (
    <div>
      <InputLabel>
        <div className="text-md font-bold mb-2 uppercase">{label}</div>
      </InputLabel>
      <Select
        startAdornment={
          <>
            {startIcon && Icon && (
              <Icon
                size="2em"
                className={`${iconClass} ml-1 mr-3`}
                fill={iconColor}
              />
            )}
            {imageSrc && (
              <Image
                src={imageSrc}
                width={20}
                height={20}
                alt="image icon"
                className="mr-3 md:w-6 md:h-6"
              />
            )}
          </>
        }
        displayEmpty
        placeholder={placeholder ? placeholder : "escreva aqui..."}
        disabled={disabled}
        required={required}
        style={style}
        fullWidth={fullWidth}
        IconComponent={MdKeyboardArrowDown}
        sx={{
          "& fieldset": { border: "2px solid #9AA2AC" },
          backgroundColor: "#fff",
          "& .MuiSelect-icon": {
            color: "#007cc4",
            fontSize: "2rem",
          },
        }}
        className={`${customClass} w-full disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-gray-200 rounded-lg md:py-[1px] text-careBlue`}
        variant="outlined"
        value={value || ""}
        defaultValue={"" as T}
        {...props}
      >
        <MenuItem value="" disabled>
          {placeholder ? placeholder : ""}
        </MenuItem>

        {options?.map((option) => (
          <MenuItem key={option.id} value={option.id} className="text-careBlue">
            {option.value}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default NewSelect;
