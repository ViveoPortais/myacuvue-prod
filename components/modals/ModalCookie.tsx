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

const ModalCookie = ({
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
    <div className="fixed inset-0 z-50 flex items-end justify-center overflow-x-hidden overflow-y-auto bg-black/50">
      <div className="w-full">
        <div
          className={`w-full ${showModal ? "fade-in-bottom " : "opacity-0"}`}
        >
          <div className="bg-white w-full px-6 py-3">
            <div className="pb-2 flex justify-between items-start">
              <div className="text-xl font-semibold">{title}</div>
              {isCloseIconVisible && (
                <div className="text-lg cursor-pointer">
                  <AiOutlineClose onClick={handleClose} />
                </div>
              )}
            </div>

            <div className="h-96 md:h-[140px] overflow-y-auto">{children}</div>

            <div className="flex flex-col items-center mt-4">
              {!isButtonDisabled && (
                <>
                  <Button
                    customClass="p-4 bg-carePurple font-bold text-white w-[85%] text-md mb-3"
                    label={buttonTextTwo || ""}
                    customColor={textColor}
                  />
                  <Button
                    customClass="p-4 bg-carePurple font-bold text-white w-[85%] text-md"
                    label={buttonText || ""}
                    customColor={textColor}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCookie;
