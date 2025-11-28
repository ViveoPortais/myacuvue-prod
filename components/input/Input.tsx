import {
  InputAdornment,
  InputLabel,
  TextField,
  TextFieldProps,
} from "@mui/material";
import dayjs from "dayjs";
import Image from "next/image";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { AiOutlineClose } from "react-icons/ai";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface SpecialInputProps {
  variantStyle?: "default" | "grayBackground" | "searchRounded";
  customClass?: string;
  endIcon?: boolean;
  startIcon?: boolean;
  iconStart?: IconType | string | undefined | null;
  iconColor?: string;
  iconClass?: string;
  maxLength?: number;
  onEnter?: () => void;
  imageSrc?: string;
}

export type Props = TextFieldProps & SpecialInputProps;

const Input = ({
  variantStyle = "default",
  maxLength = 200,
  onEnter,
  iconColor,
  iconStart: Icon,
  iconClass,
  autoComplete,
  className,
  defaultValue,
  disabled,
  size,
  error,
  helperText,
  id,
  label,
  type,
  name,
  style,
  placeholder,
  onChange,
  required,
  value,
  endIcon,
  startIcon,
  imageSrc,
  ...props
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onEnter) {
      onEnter();
    }
  };

  const currentDate = dayjs().format("YYYY-MM-DD");

  const handleMinDate = () => {
    if (type === "date") {
      return currentDate;
    }
    return null;
  };

  const defaultStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#fff",
      borderRadius: "8px",
      border: "1px solid #d1d5db",
      paddingRight: "8px",
      paddingLeft: "8px",
      "&:hover": {
        borderColor: "#a3a3a3",
      },
      "&.Mui-focused": {
        borderColor: "#d1d5db",
        boxShadow: "0 0 0 1px #d1d5db",
      },
    },
    "& input::placeholder": {
      color: "#a3a3a3",
      opacity: 1,
    },
  };

  const grayBackgroundStyle = {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#EDEDED",
      borderRadius: "8px",
      paddingRight: "8px",
      paddingLeft: "8px",
      "&.Mui-disabled": {
        backgroundColor: "#EDEDED",
      },
    },
    "& input::placeholder": {
      color: "#a3a3a3",
      opacity: 1,
    },
  };

  const searchRoundedStyle = {
    "& .MuiOutlinedInput-notchedOutline": {
      border: "1px solid #BFC5CE",
    },
    "& .MuiOutlinedInput-root": {
      backgroundColor: "#FFFFFF",
      borderRadius: "50px",
      paddingRight: "16px",
      paddingLeft: "16px",
      height: "48px",
      "&:hover": {
        borderColor: "#BFC5CE",
      },
      "&.Mui-focused": {
        borderColor: "#BFC5CE",
        boxShadow: "none",
      },
    },
    "& input::placeholder": {
      color: "#8A94A6",
      opacity: 1,
    },
  };

  const appliedStyle =
    variantStyle === "grayBackground"
      ? grayBackgroundStyle
      : variantStyle === "searchRounded"
        ? searchRoundedStyle
        : defaultStyle;

  return (
    <div>
      {label && (
        <InputLabel>
          <div className="text-md font-bold mb-2 uppercase">{label}</div>
        </InputLabel>
      )}

      <TextField
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        disabled={disabled}
        error={error}
        id={id}
        name={name}
        required={required}
        size={size}
        type={showPassword ? "text" : type}
        value={value}
        variant="outlined"
        onChange={onChange}
        fullWidth
        onKeyDown={handleKeyPress}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-70 rounded-lg md:py-1`}
        placeholder={placeholder || ""}
        style={style}
        sx={appliedStyle}
        inputProps={{
          maxLength: maxLength,
        }}
        InputProps={{
          startAdornment: (
            <>
              {startIcon && (
                <InputAdornment position="start">
                  {Icon && (
                    <Icon
                      size="1.5em"
                      className={iconClass}
                      fill={iconColor}
                    />
                  )}
                </InputAdornment>
              )}
              {imageSrc && (
                <InputAdornment position="start">
                  <Image
                    src={imageSrc}
                    width={20}
                    height={20}
                    alt="image icon"
                    className="mr-2 md:w-6 md:h-6"
                  />
                </InputAdornment>
              )}
            </>
          ),
          endAdornment: endIcon && (
            <InputAdornment position="end">
              {!showPassword ? (
                <FaEye
                  onClick={handleShowPassword}
                  className="cursor-pointer"
                />
              ) : (
                <FaEyeSlash
                  onClick={handleShowPassword}
                  className="cursor-pointer"
                />
              )}
            </InputAdornment>
          ),
        }}
        {...props}
      />
      <div>
        {error && (
          <div className="flex items-center gap-2 text-xs font-bold mt-3 w-full bg-red-200 p-2 md:p-5 rounded-md">
            <div className="bg-careRedButton rounded-full p-[5px] h-8 w-8 flex items-center">
              <span>
                <AiOutlineClose size={22} className="text-white" />
              </span>
            </div>

            <span className="text-careTextError text-sm">{helperText}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
