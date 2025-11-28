import React from "react";
import Button from "../button/Button";
import Image from "next/image";
import { useRouter } from "next/router";

interface ContentCardProps {
  isCustomBg?: boolean;
  bgColor?: string;
  textColor?: string;
  buttonColor?: string;
  buttonBorderColor?: string;
  title: string;
  titleTwo?: string;
  subtitle?: string;
  textemail?: string;
  textphone?: string;
  buttonText: string;
  svgIcon: string;
  hasIcon?: boolean;
  hideButton?: boolean;
  cardLink?: string;
  id?: string;
  showTrademark?: boolean;
  onButtonClick?: () => void;
  children?: React.ReactNode;
}

const ContentCardPacient = ({
  isCustomBg,
  bgColor,
  textColor,
  buttonColor,
  buttonBorderColor,
  title,
  titleTwo,
  subtitle,
  textemail,
  textphone,
  buttonText,
  hasIcon,
  svgIcon,
  hideButton,
  cardLink,
  showTrademark,
  id,
  onButtonClick,
  children,
}: ContentCardProps) => {
  const router = useRouter();

  const isHttpLink = (link: string) => {
    return link.startsWith("https://") || link.startsWith("https://");
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
      return;
    }

    if (cardLink && isHttpLink(cardLink)) {
      window.open(cardLink, "_blank");
    } else if (cardLink) {
      router.push(cardLink);
    }
  };

  return (
    <div
      className={`w-full rounded-xl lg:h-60 2xl:h-60 border-2 border-[#84BDDF] ${isCustomBg
        ? "bg-[url('/')] bg-contain bg-no-repeat scale-x-[-1]"
        : `${bgColor}`
        } `}
    >
      <div className={`${isCustomBg && "scale-x-[-1]"} flex flex-col h-full`}>
        <div className="text-white md:w-full ml-3 mt-5 md:mt-8 xl:mt-5 text-2xl flex flex-col">
          <div className="flex gap-5 items-center">
            {children ? (
              <div className="w-[38px] h-[38px] flex items-center justify-center">
                {children}
              </div>
            ) : (
              <Image
                src={svgIcon}
                width={58}
                height={38}
                alt="card-svg"
                className="object-contain md:w-auto lg:w-10 xl:w-14 2xl:w-auto"
              />
            )}

            <div className="flex flex-col ">
              <span className="text-careLightBlue font-bold">{title}</span>
              <span className="text-careLightBlue font-bold">{titleTwo}</span>
            </div>
          </div>

          <div className="mt-5 ml-3 mr-3 text-careDarkBlue text-xs break-words overflow-hidden">
            <span className={`block ${subtitle === "0800 400 5001" ? "text-xl font-bold" : "opacity-95"} break-words break-all w-full`}>
              {subtitle}
              {showTrademark && (
                <>
                  <span style={{ verticalAlign: "super", fontSize: "0.75em" }}>®</span>.
                </>
              )}
            </span>
          </div>

          <span className="text-sm font-bold ml-1 opacity-95">{textemail}</span>
        </div>
        <div
          className={`ml-3 my-5 flex ${hideButton ? "justify-end" : "justify-between"
            } items-end h-full`}
        >
          {!hideButton && (
            <Button
              customClass={`px-7 py-2 ${buttonColor || "bg-careDarkBlue"
                } border-1 ${buttonBorderColor || "border-careDarkBlue"
                } font-bold`}
              label={buttonText}
              customColor={textColor}
              onClick={handleButtonClick}
              id={id}
            />
          )}
          {/* {hasIcon && (
            <Image
              src={svgIcon}
              width={58}
              height={38}
              alt="card-svg"
              className="object-contain mr-8 md:w-auto lg:w-10 xl:w-14 2xl:w-auto ml-5"
            />
          )} */}
        </div>
      </div>
    </div >
  );
};

export default ContentCardPacient;
