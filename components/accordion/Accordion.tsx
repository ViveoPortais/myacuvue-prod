"use client";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { TfiArrowCircleDown } from "react-icons/tfi";
import useDataStorage from "@/hooks/useDataStorage";
import Button from "../button/Button";
import { GoPlus } from "react-icons/go";
import NewSelect from "../select/NewSelect";
import useValidateEcpVoucher from "@/hooks/useValidateEcpVoucher";
import { Checkbox } from "@mui/material";
import { addPurchase } from "@/services/purchase";
import { toast } from "react-toastify";
import React, { useEffect, useState } from "react";
import {
  getAddition,
  getAdditionTwo,
  getAxle,
  getCodeNumber,
  getCodeNumberFields,
  getCylinder,
  getDegree,
} from "@/services/voucher";
import NewModal from "../modals/NewModal";
import useOpenModalConfirm from "@/hooks/useOpenModalConfirm";
import useOpenModalCancel from "@/hooks/useOpenModalCancel";
import { RxDash } from "react-icons/rx";

export default function AccordionUsage() {
  const openModalEdit = useOpenModalConfirm();
  const openModalCancel = useOpenModalCancel();
  const dataStorage = useDataStorage();
  const useValideEcp = useValidateEcpVoucher();
  const [valorDaDivisaoDeQuantidade, setValorDaDivisaoDeQuantidade] =
    useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [productOptions, setProductOptions] = useState<
    { value: string; id: string }[]
  >([]);
  const [fieldsVisibility, setFieldsVisibility] = useState<{
    [index: number]: {
      degree: boolean;
      cylinder: boolean;
      axle: boolean;
      addition: boolean;
    };
  }>({});
  type OptionType = { value: string; id: string };

  const [blocksData, setBlocksData] = useState<
    {
      selectedCodeNumber: string;
      selectedProduct: string;
      selectedCylinder: string;
      selectedAxies: string;
      selectedAddition: string;
      optionsQuatity: string;
      degreeOptions: OptionType[];
      cylinderOptions: OptionType[];
      axiesOptions: OptionType[];
      additionOptions: OptionType[];
    }[]
  >([
    {
      selectedCodeNumber: "",
      selectedProduct: "",
      selectedCylinder: "",
      selectedAxies: "",
      selectedAddition: "",
      optionsQuatity: "",
      degreeOptions: [],
      cylinderOptions: [],
      axiesOptions: [],
      additionOptions: [],
    },
  ]);

  const getProductIdForBlock = (block: any, fields: any) => {
    if (!block) return null;

    const candidates: string[] = [];

    if (fields.degree && block.selectedProduct)
      candidates.push(block.selectedProduct);
    if (fields.cylinder && block.selectedCylinder)
      candidates.push(block.selectedCylinder);
    if (fields.axle && block.selectedAxies)
      candidates.push(block.selectedAxies);
    if (fields.addition && block.selectedAddition)
      candidates.push(block.selectedAddition);

    return candidates.length > 0 ? candidates[candidates.length - 1] : null;
  };

  const buildProductsToStore = (blocks: any[], fieldsVisibilityObj: any) => {
    return blocks
      .map((block, index) => {
        const fields = fieldsVisibilityObj[index] || {};
        const productId = getProductIdForBlock(block, fields);
        if (!productId) return null;
        return {
          productId,
          amount: block.optionsQuatity || 1,
        };
      })
      .filter(Boolean);
  };

  useEffect(() => {
    const totalQuantityBox = Number(dataStorage.quantityBox);
    const numBlocks = blocksData.length;
    const dividedQuantity = totalQuantityBox / numBlocks;

    setBlocksData((prevBlocks) =>
      prevBlocks.map((block) => ({
        ...block,
        optionsQuatity: dividedQuantity.toString(),
      }))
    );

    setValorDaDivisaoDeQuantidade(dividedQuantity.toString());
  }, [dataStorage.quantityBox, blocksData.length]);

  const handleBlockChange = (index: any, field: any, value: any) => {
    setBlocksData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const updateBlockField = (index: any, field: any, value: any) => {
    setBlocksData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddBlock = () => {
    if (blocksData.length >= 2) return;

    const newBlock = {
      selectedCodeNumber: "",
      selectedProduct: "",
      selectedCylinder: "",
      selectedAxies: "",
      selectedAddition: "",
      optionsQuatity: "",
      degreeOptions: [],
      cylinderOptions: [],
      axiesOptions: [],
      additionOptions: [],
    };

    setBlocksData((prev) => [...prev, newBlock]);
  };

  useEffect(() => {
    const productsToStore = buildProductsToStore(blocksData, fieldsVisibility);
    dataStorage.setAxiesId(productsToStore);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(blocksData), JSON.stringify(fieldsVisibility)]);

  const fetchProductOptions = () => {
    // Use the first block's selectedAxies as reference, or adjust logic as needed
    const referenceId =
      blocksData[0]?.selectedAxies || blocksData[0]?.selectedAddition || "";
    getCodeNumber({ referenceId })
      .then((response) => {
        const codeNumberOptions = response.value.map((item: any) => ({
          value: item.value,
          id: item.label,
        }));
        setProductOptions(codeNumberOptions);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchProductOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksData[0]?.selectedAxies, blocksData[0]?.selectedAddition]);

  useEffect(() => {
    blocksData.forEach((block, index) => {
      if (!block.selectedCodeNumber) return;

      getCodeNumberFields({ codeNumber: block.selectedCodeNumber })
        .then((response) => {
          if (response.isValidData && response.value) {
            setFieldsVisibility((prev) => ({
              ...prev,
              [index]: {
                degree: response.value.degree,
                cylinder: response.value.cylinder,
                axle: response.value.axle,
                addition: response.value.addition,
              },
            }));
          }
        })
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksData.map((b) => b.selectedCodeNumber).join("|")]);

  useEffect(() => {
    blocksData.forEach((block, index) => {
      if (!block.selectedCodeNumber) return;
      if (!fieldsVisibility[index]?.degree) return; // só busca se degree estiver ativo

      getDegree(block.selectedCodeNumber)
        .then((response) => {
          const options = response.value.map((item: any) => ({
            value: item.label,
            id: item.value,
          }));
          updateBlockField(index, "degreeOptions", options);
        })
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocksData.map((b) => b.selectedCodeNumber).join("|"), fieldsVisibility]);

  useEffect(() => {
    if (!blocksData || blocksData.length === 0) return;
    if (!blocksData[0].selectedCodeNumber) return;
    blocksData.forEach((block, index) => {
      if (!block.selectedCodeNumber || !block.selectedProduct) return;

      const labelDegree = block.degreeOptions.find(
        (item: any) => item.id === block.selectedProduct
      )?.value;
      getAdditionTwo(block.selectedCodeNumber, labelDegree)
        .then((response) => {
          const options = response.value.map((item: any) => ({
            value: item.label,
            id: item.value,
          }));
          updateBlockField(index, "additionOptions", options);
        })
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blocksData
      .map((b) => `${b.selectedCodeNumber}-${b.selectedProduct}`)
      .join("|"),
  ]);

  useEffect(() => {
    if (!blocksData || blocksData.length === 0) return;
    if (!blocksData[0].selectedCodeNumber) return;
    blocksData.forEach((block, index) => {
      if (!block.selectedCodeNumber || !block.selectedProduct) return;

      const labelDegree = block.degreeOptions.find(
        (item: any) => item.id === block.selectedProduct
      )?.value;
      getCylinder(block.selectedCodeNumber, labelDegree)
        .then((response) => {
          const options = response.value.map((item: any) => ({
            value: item.label,
            id: item.value,
          }));
          updateBlockField(index, "cylinderOptions", options);
        })
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blocksData
      .map((b) => `${b.selectedCodeNumber}-${b.selectedProduct}`)
      .join("|"),
  ]);

  useEffect(() => {
    if (!blocksData || blocksData.length === 0) return;
    if (
      !blocksData[0].selectedCodeNumber ||
      !blocksData[0].selectedProduct ||
      !blocksData[0].selectedCylinder
    )
      return;
    blocksData.forEach((block, index) => {
      if (
        !block.selectedCodeNumber ||
        !block.selectedProduct ||
        !block.selectedCylinder
      )
        return;
      const labelDegree = block.degreeOptions.find(
        (item: any) => item.id === block.selectedProduct
      )?.value;
      const labelCylinder = block.cylinderOptions.find(
        (item: any) => item.id === block.selectedCylinder
      )?.value;
      getAxle(block.selectedCodeNumber, labelDegree, labelCylinder)
        .then((response) => {
          const options = response.value.map((item: any) => ({
            value: item.label,
            id: item.value === "X" ? item.info : item.value,
          }));
          updateBlockField(index, "axiesOptions", options);
        })
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blocksData
      .map(
        (b) =>
          `${b.selectedCodeNumber}-${b.selectedProduct}-${b.selectedCylinder}`
      )
      .join("|"),
  ]);

  useEffect(() => {
    if (!blocksData || blocksData.length === 0) return;
    if (
      !blocksData[0].selectedCodeNumber ||
      !blocksData[0].selectedProduct ||
      !blocksData[0].selectedCylinder ||
      !blocksData[0].selectedAxies
    )
      return;
    blocksData.forEach((block: any, index: any) => {
      const axleValue = block.axiesOptions.find(
        (item: any) => item.id === block.selectedAxies
      )?.value;
      if (
        !block.selectedCodeNumber ||
        !block.selectedProduct ||
        !block.selectedCylinder ||
        !block.selectedAxies ||
        !axleValue
      )
        return;
      const labelDegree = block.degreeOptions.find(
        (item: any) => item.id === block.selectedProduct
      )?.value;
      const labelCylinder = block.cylinderOptions.find(
        (item: any) => item.id === block.selectedCylinder
      )?.value;
      const labelAxle = block.axiesOptions.find(
        (item: any) => item.id === block.selectedAxies
      )?.value;
      getAddition(
        block.selectedCodeNumber,
        labelDegree,
        labelCylinder,
        labelAxle
      )
        .then((response) => {
          const options = response.value.map((item: any) => ({
            value: item.label,
            id: item.value === "X" ? item.info : item.value,
          }));
          updateBlockField(index, "additionOptions", options);
        })
        .catch(() => {});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    blocksData
      .map(
        (b) =>
          `${b.selectedCodeNumber}-${b.selectedProduct}-${b.selectedCylinder}-${b.selectedAxies}`
      )
      .join("|"),
  ]);

  const handleSendProduct = () => {
    setIsLoading(true);

    const adddescountVoucher = {
      voucherId: dataStorage.idVoucher,
      programCode: "073",
      items: dataStorage.AxiesId,
      IsGeneratePurchase: isChecked,
    };

    addPurchase(adddescountVoucher as any)
      .then((response) => {
        if (response.isValidData) {
          toast.success("Voucher e Produto resgatado enviado com sucesso!");
          dataStorage.setAxiesId([]);
          handleClearAddproduct();
          openModalCancel.onClose();
        } else if (
          response.additionalMessage ===
          "purchase order with only one product, please do not divide the quantity"
        ) {
          toast.error(
            "Pedido de compra com apenas um produto, não divida a quantidade"
          );
        } else {
          toast.error("Erro ao enviar voucher e produto resgatado!");
        }
      })
      .catch(() => {
        toast.error("Erro ao enviar voucher e produto resgatado!");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleClearButtonClick = () => {
    useValideEcp.onClose();
    dataStorage.setIdProduct("");
    dataStorage.setPromotionName("");
    dataStorage.setPorcentPromotion("");
    dataStorage.setIdVoucher("");
    dataStorage.setCpf("");
    dataStorage.setAxiesId([]);
    setProductOptions([]);
    openModalCancel.onClose();
    setIsChecked(false);
    setBlocksData([
      {
        selectedCodeNumber: "",
        selectedProduct: "",
        selectedCylinder: "",
        selectedAxies: "",
        selectedAddition: "",
        optionsQuatity: "",
        degreeOptions: [],
        cylinderOptions: [],
        axiesOptions: [],
        additionOptions: [],
      },
    ]);
  };

  const handleClearAddproduct = () => {
    setProductOptions([]);
    useValideEcp.onClose();
    openModalEdit.onClose();
    setIsChecked(false);
    setBlocksData([
      {
        selectedCodeNumber: "",
        selectedProduct: "",
        selectedCylinder: "",
        selectedAxies: "",
        selectedAddition: "",
        optionsQuatity: "",
        degreeOptions: [],
        cylinderOptions: [],
        axiesOptions: [],
        additionOptions: [],
      },
    ]);
  };

  const handleClearAddproductTwo = () => {
    dataStorage.setAxiesId([]);
    setProductOptions([]);

    setBlocksData((prevBlocksData) => [
      {
        selectedCodeNumber: "",
        selectedProduct: "",
        selectedCylinder: "",
        selectedAxies: "",
        selectedAddition: "",
        // Mantém a quantidade atual do primeiro bloco, se existir
        optionsQuatity: prevBlocksData[0]?.optionsQuatity || "",
        degreeOptions: [],
        cylinderOptions: [],
        axiesOptions: [],
        additionOptions: [],
      },
    ]);

    setFieldsVisibility({
      0: {
        degree: false,
        cylinder: false,
        axle: false,
        addition: false,
      },
    });

    fetchProductOptions();
  };

  return (
    <div>
      <Accordion className="border-2 border-[#EAF6FD] rounded-xl shadow-none">
        <AccordionSummary
          expandIcon={
            <TfiArrowCircleDown size={40} className="text-careLightBlue" />
          }
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography
            className="px-5 flex flex-col md:flex md:flex-row md:items-center gap-2 w-full"
            component="span"
          >
            <span className="text-careBlue font-bold text-sm">Promoção:</span>
            <div className="p-4 rounded-xl bg-[#EAF6FD] flex flex-col md:flex md:flex-row md:items-center gap-2">
              <span className="text-sm text-careBlue">
                ID:{dataStorage.idProduct}
              </span>
              <span className="text-3xl text-careLightBlue font-bold">
                {Math.round(Number(dataStorage.porcentPromotion))}%
              </span>
              <span className="text-sm text-careLightBlue font-bold">
                {dataStorage.promotionName}
              </span>
            </div>
          </Typography>
        </AccordionSummary>
        <AccordionDetails className="md:px-9 flex flex-col gap-2">
          {blocksData.map((block, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border-2 border-[#EAF6FD] flex flex-col gap-5 fade-in"
            >
              <div className="md:flex md:flex-row md:items-center flex flex-col gap-5">
                <div className="flex flex-col md:w-96">
                  <span className="text-careBlue font-bold md:text-base text-sm">
                    Produto:
                  </span>
                  <NewSelect
                    options={productOptions}
                    value={block.selectedCodeNumber}
                    onChange={(e) =>
                      handleBlockChange(
                        index,
                        "selectedCodeNumber",
                        e.target.value
                      )
                    }
                    placeholder="Selecione o produto"
                  />
                </div>
                <div className="flex flex-col md:w-52">
                  <span className="text-careBlue font-bold md:text-base text-sm">
                    Quantidade:
                  </span>
                  <NewSelect
                    placeholder="Informe a quantidade"
                    options={[
                      {
                        value: block.optionsQuatity?.toString() || "",
                        id: block.optionsQuatity?.toString() || "",
                      },
                    ]}
                    value={block.optionsQuatity}
                    onChange={(e) =>
                      handleBlockChange(index, "optionsQuatity", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="md:flex md:flex-row md:items-center flex flex-col gap-5">
                {fieldsVisibility[index]?.degree && (
                  <div className="flex flex-col md:w-48">
                    <div className="flex items-center gap-1">
                      <span className="text-careBlue text-sm">Dioptria</span>
                      {/* Tooltip */}
                    </div>
                    <NewSelect
                      options={block.degreeOptions || []}
                      value={block.selectedProduct}
                      onChange={(e) =>
                        handleBlockChange(
                          index,
                          "selectedProduct",
                          e.target.value
                        )
                      }
                      placeholder="Selecione o grau esférico"
                    />
                  </div>
                )}

                {fieldsVisibility[index]?.cylinder && (
                  <div className="flex flex-col md:w-48">
                    <div className="flex items-center gap-1">
                      <span className="text-careBlue text-sm">Cilíndrico</span>
                      {/* Tooltip */}
                    </div>
                    <NewSelect
                      options={block.cylinderOptions || []}
                      value={block.selectedCylinder}
                      onChange={(e) =>
                        handleBlockChange(
                          index,
                          "selectedCylinder",
                          e.target.value
                        )
                      }
                      placeholder="Selecione o cilindro"
                    />
                  </div>
                )}

                {fieldsVisibility[index]?.axle && (
                  <div className="flex flex-col md:w-48">
                    <div className="flex items-center gap-1">
                      <span className="text-careBlue text-sm">Eixo</span>
                      {/* Tooltip */}
                    </div>
                    <NewSelect
                      options={block.axiesOptions || []}
                      value={block.selectedAxies}
                      onChange={(e) =>
                        handleBlockChange(
                          index,
                          "selectedAxies",
                          e.target.value
                        )
                      }
                      placeholder="Selecione o eixo"
                    />
                  </div>
                )}

                {fieldsVisibility[index]?.addition && (
                  <div className="flex flex-col md:w-48">
                    <div className="flex items-center gap-1">
                      <span className="text-careBlue text-sm">Adição</span>
                      {/* Tooltip */}
                    </div>
                    <NewSelect
                      options={block.additionOptions || []}
                      value={block.selectedAddition}
                      onChange={(e) =>
                        handleBlockChange(
                          index,
                          "selectedAddition",
                          e.target.value
                        )
                      }
                      placeholder="Selecione o adição"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div className="flex flex-col md:flex-row md:items-center gap-5 mt-5">
            <Button
              leftIcon={GoPlus}
              label="Adicionar"
              customClass="bg-careLightBlue border-careLightBlue h-12 w-full md:w-40"
              onClick={handleAddBlock}
              disabled={blocksData.length >= 2}
            />
            <Button
              leftIcon={RxDash}
              label="Limpar"
              customClass="bg-careLightBlue border-careLightBlue h-12 w-full md:w-40"
              onClick={handleClearAddproductTwo}
            />
          </div>
        </AccordionDetails>
      </Accordion>
      <div className="flex justify-center gap-5 items-center mt-10">
        <div className="flex items-center gap-1">
          <Checkbox
            id="checkbox-pedido-de-compra"
            className="p-0"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
          />
          <span className="text-sm text-careBlue">Gerar pedido de compra</span>
        </div>
        <Button
          label="Cancelar"
          customClass="bg-careDarkBlue border-careDarkBlue h-12 w-full md:w-40"
          onClick={openModalCancel.onOpen}
        />
        <Button
          label="Salvar"
          customClass="bg-careLightBlue border-careLightBlue h-12 w-full md:w-40"
          onClick={openModalEdit.onOpen}
          disabled={dataStorage.quantityBox === null || isLoading}
        />
      </div>

      {openModalEdit.isOpen && (
        <NewModal
          id="modal-confirmar-pedido-de-compra"
          isOpen={true}
          title="Deseja CONFIRMAR o Pedido"
          subtitlle="de Compra"
          isCloseIconVisible={false}
          onClose={() => {}}
          buttonText="Confirmar"
          buttonTextTwo="Cancelar"
          onClickConfirm={handleSendProduct}
          onClickCancel={() => {
            openModalEdit.onClose();
          }}
          isConfirmDisabled={isLoading}
          isLoading={isLoading}
        >
          <div className="flex flex-col items-center my-8">
            <span className="text-careDarkBlue">
              Atenção! Certifique de que a solicitação foi gerada no SAP
            </span>

            <span className="text-careDarkBlue font-bold mt-5">
              Deseja confirmar esta ação?
            </span>
          </div>
        </NewModal>
      )}

      {openModalCancel.isOpen && (
        <NewModal
          id="modal-cancelar-pedido-de-compra"
          isOpen={true}
          title="Deseja CANCELAR o Pedido"
          subtitlle="de Compra"
          isCloseIconVisible={false}
          onClose={() => {}}
          buttonText="Confirmar"
          buttonTextTwo="Cancelar"
          onClickConfirm={handleClearButtonClick}
          onClickCancel={() => {
            openModalCancel.onClose();
          }}
        >
          <div className="flex flex-col items-center my-8">
            <span className="text-careDarkBlue">
              Atenção! Após CANCELAMENTO do parceiro terá de abrir
            </span>
            <span className="text-careDarkBlue">uma nova solicitação</span>

            <span className="text-careDarkBlue font-bold mt-5">
              Deseja confirmar esta ação?
            </span>
          </div>
        </NewModal>
      )}
    </div>
  );
}
