import useClientColors from "@/hooks/useClientConfiguration";
import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  small?: boolean;
  leftIcon?: IconType; // Novo prop para o ícone da esquerda
  rightIcon?: IconType; // Novo prop para o ícone da direita
  type?: "button" | "submit" | "reset" | undefined;
  customClass?: string;
  customColor?: string;
  isLoading?: boolean;
  disableHover?: boolean;
  id?: any;
}

const Button = ({
  label,
  onClick,
  disabled,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  type,
  customClass,
  customColor,
  isLoading,
  disableHover,
  id,
}: ButtonProps) => {
  return (
    <button
      id={id}
      onClick={onClick}
      disabled={disabled}
      className={`relative disabled:opacity-50 border-2 z-0 text-sm xl:text-sm 2xl:text-lg disabled:cursor-not-allowed rounded-lg transition ${
        disableHover ? "" : "hover:opacity-80"
      } ${customClass}`}
      type={type}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading ? (
          <div className="animate-spin rounded-full h-6 w-6 opacity-70 border-b-2 border-white"></div>
        ) : (
          <>
            {LeftIcon && <LeftIcon size={24} />} {/* Ícone à esquerda */}
            <div className={`uppercase text-sm ${customColor}`}>{label}</div>
            {RightIcon && <RightIcon size={24} />} {/* Ícone à direita */}
          </>
        )}
      </div>
    </button>
  );
};

export default Button;
