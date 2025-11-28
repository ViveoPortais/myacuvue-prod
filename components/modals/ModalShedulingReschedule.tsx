import React, { useEffect, useState, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Button from "../button/Button";

interface ModalProps {
  isOpen?: boolean;
  title?: string;
  children?: React.ReactNode;
  customClass?: string;
  buttonText?: string;
  buttonTextTwo?: string;
  textColor?: string;
  onClose: () => void;
  isButtonDisabled?: boolean;
  isCloseIconVisible?: boolean;
}

const ModalShedulingReschedule = ({
  isOpen,
  title,
  children,
  customClass,
  onClose,
  buttonText,
  buttonTextTwo,
  textColor,
  isButtonDisabled,
  isCloseIconVisible = true,
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
            <div className="md:py-5 md:px-10 p-5">
              <div className="pb-2 flex justify-between items-center">
                <div className="mt-2 text-lg text-careBlue font-bold">
                  {title}
                </div>
                {isCloseIconVisible && (
                  <div className="ml-4  cursor-pointer">
                    <AiOutlineClose
                      size={28}
                      className="text-careBlue"
                      onClick={handleClose}
                    />
                  </div>
                )}
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalShedulingReschedule;
