import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../button/Button";

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  subtitlle?: string;
  children?: React.ReactNode;
  customClass?: string;
  buttonText?: string;
  buttonTextTwo?: string;
  textColor?: string;
  isDisabledButtonTwo?: boolean;
  onClose: () => void;
  isButtonDisabled?: boolean;
  isCloseIconVisible?: boolean;
  onClickConfirm?: () => void;
  onClickCancel?: () => void;
  id?: string;
  isConfirmDisabled?: boolean;
  isLoading?: boolean;
}

const NewModal = ({
  isOpen,
  title,
  subtitlle,
  children,
  customClass,
  isDisabledButtonTwo,
  onClose,
  onClickConfirm,
  onClickCancel,
  buttonText,
  buttonTextTwo,
  textColor,
  isButtonDisabled,
  isCloseIconVisible = true,
  id,
  isConfirmDisabled,
  isLoading,
}: ModalProps) => {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-blue-950/70">
      <div className={`${customClass ? customClass : "w-700 mx-auto h-475"}`}>
        <div
          className={`translate duration-300 h-full 
          ${showModal ? "translate-y-0" : "translate-y-full"}
           ${showModal ? "opacity-100" : "opacity-0"}`}
        >
          <div className="translate border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {isCloseIconVisible && (
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-xl text-gray-500 hover:text-black"
              >
                <AiOutlineClose />
              </button>
            )}
            <div className="p-14 xl:px-20 xl:py-10">
              <div
                className={`relative ${
                  customClass?.includes("edit-header")
                    ? "flex justify-end items-start px-6 pt-4"
                    : "px-0 xl:px-20 pb-5 flex flex-col justify-center items-center"
                } ${
                  customClass?.includes("no-border") ||
                  customClass?.includes("modal-mobile")
                    ? ""
                    : "border-b border-careBlue"
                }`}
              >
                <div className="mt-3 text-3xl text-careLightBlue">{title}</div>
                <div className="mt-3 text-3xl text-careLightBlue">
                  {subtitlle}
                </div>
              </div>
              {children}

              <div
                className={`mt-3 ${
                  customClass?.includes("row-buttons")
                    ? "flex flex-row justify-center gap-4"
                    : "flex flex-col gap-2 items-center"
                }`}
              >
                {!isButtonDisabled && (
                  <>
                    {!isDisabledButtonTwo && (
                      <Button
                        id={id}
                        customClass="p-4 border bg-careDarkBlue border-careDarkBlue font-bold text-white w-[85%] md:w-[200px] text-md"
                        label={buttonTextTwo || ""}
                        customColor={textColor}
                        onClick={onClickCancel}
                      />
                    )}
                    <Button
                      id={id}
                      customClass="p-4 bg-careLightBlue border border-careLightBlue font-bold text-white w-[85%] md:w-[200px] text-md"
                      label={isLoading ? "Confirmando..." : buttonText || ""}
                      customColor={textColor}
                      onClick={onClickConfirm}
                      disabled={isConfirmDisabled}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewModal;
