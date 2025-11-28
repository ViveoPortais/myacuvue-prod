import React from "react";
import Button from "../button/Button";
import Image from "next/image";

interface ContentCardBannerProps {
    isCustomBg?: boolean;
    bgColor?: string;
    textColor?: string;
    buttonColor?: string;
    buttonBorderColor?: string;
    title: string;
    subtitle?: string | React.ReactNode;
    subtitleTwo?: string;
    textemail?: string;
    textphone?: string;
    buttonText: string;
    svgIcon: string;
    hasIcon?: boolean;
    hideButton?: boolean;
    onButtonClick?: () => void;
    id?: string;
    margemTop?: boolean;
}


const ContentCardBanner = ({
    isCustomBg,
    bgColor,
    textColor,
    buttonColor,
    buttonBorderColor,
    title,
    subtitle,
    subtitleTwo,
    textemail,
    textphone,
    buttonText,
    hasIcon,
    svgIcon,
    hideButton,
    id,
    margemTop,
    onButtonClick,
}: ContentCardBannerProps) => {
    const sendEmail = () => {
        window.open(
            "mailto:programamyacuvue@suporteaopaciente.com.br?subject=Subject&body=Body%20goes%20here"
        );
    };

    const calling = () => {
        window.open("tel:0800 400 5001");
    };

    return (
        <div
            className={`w-full rounded-3xl lg:h-48 2xl:h-48 ${isCustomBg
                ? "bg-[url('/')] bg-contain bg-no-repeat bg-careDarkBlue scale-x-[-1]"
                : `${bgColor}`
                } `}
        >
            <div className={`${isCustomBg && "scale-x-[-1]"} flex flex-col h-full px-4 py-6 lg:px-8`}>
                <div className="text-white md:w-full  2xl:ml-5 mt-5 md:mt-8 xl:mt-16 text-3xl flex flex-col">
                    <span className="w-full max-w-lg">{title}</span>
                    <span className="text-sm mt-6 ml-1 opacity-95 w-44 sm:w-auto">{subtitle}</span>
                    <span className="text-base font-medium mt-3 ml-1 opacity-95">
                        {subtitleTwo}
                    </span>
                    <span
                        onClick={sendEmail}
                        className="text-sm font-bold ml-1 opacity-95 cursor-pointer hover:text-careDarkBlue"
                    >
                        {textemail}
                    </span>
                    <span
                        onClick={calling}
                        className="text-2xl md:text-3xl lg:text-3xl xl:text-xl xl:mt-0 2xl:mt-3 2xl:text-3xl font-bold ml-1 opacity-95 hover:text-careDarkBlue cursor-pointer"
                    >
                        {textphone}
                    </span>
                </div>
                <div
                    className={`ml-3 2xl:ml-5 my-5 flex ${hideButton ? "justify-end" : "justify-between"
                        } items-end h-full`}
                >
                    {!hideButton && (
                        <Button
                            customClass={`px-14 py-2 ${margemTop ? "mt-4" : "mt-0"} ${buttonColor || "bg-careDarkBlue"
                                } border-1 ${buttonBorderColor || "border-careBlue"} font-bold`}
                            label={buttonText}
                            customColor={textColor}
                            onClick={onButtonClick}
                            id={id}
                        />
                    )}
                    {hasIcon && (
                        <Image
                            src={svgIcon}
                            width={58}
                            height={38}
                            alt="card-svg"
                            className="object-contain mr-8 md:w-auto lg:w-10 xl:w-14 2xl:w-auto ml-5"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContentCardBanner;
