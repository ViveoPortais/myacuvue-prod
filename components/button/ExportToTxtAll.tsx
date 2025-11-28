import React, { useEffect, useState } from "react";
import Button from "./Button";
import useDataStorage from "@/hooks/useDataStorage";
import { downloadallOrderPurchase } from "@/services/purchase";
import { toast } from "react-toastify";

type ExportToTxtProps = {
  label: string;
  className?: string;
  disabled?: boolean;
  fileName?: string;
  params?: any;
  id?: string;
};

const downloadTxtFile = (content: string[], fileName: string) => {
  const fileConverted = content.join("");
  const blob = new Blob([fileConverted], { type: "text/plain;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const ExportToTxtAll = ({
  label,
  className,
  disabled,
  fileName,
  params,
  id,
}: ExportToTxtProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dataScheduling = useDataStorage();
  const [downloadAll, setDownloadAll] = useState([]);

  const handleDownloadAll = () => {
    downloadallOrderPurchase(dataScheduling.dataFilter)
      .then((res) => {
        setDownloadAll(res.value);
        if (res.value) {
          downloadTxtFile(
            res.value,
            `${fileName ? fileName : "Todos os Pedidos"}.txt`
          );
        } else {
          toast.error("Não foi encontrado nenhum produto");
        }
      })
      .catch((err) => {});
  };

  return (
    <Button
      id={id}
      customClass={`${className}`}
      label={label}
      onClick={() => handleDownloadAll()}
      disabled={disabled || isLoading}
    />
  );
};

export default ExportToTxtAll;
