import {
  getAddition,
  getAxle,
  getCodeNumber,
  getCylinder,
  getDegree,
  getListRescueVoucherPatients,
} from "@/services/voucher";
import CustomSelect from "../select/Select";
import React, { use, useEffect, useState } from "react";
import useDataStorage from "@/hooks/useDataStorage";
import { info } from "console";
import { BsQuestionCircle } from "react-icons/bs";

interface ClientData {
  name: string;
  cpf: string;
  email: string;
  vouchers: Voucher[];
}

interface Voucher {
  discountType: string;
  deadlineInDays: number;
  discountValue: number;
  status: string;
}

interface SearchModalProps {
  clientData: ClientData | null;
  totalQuantity: number;
}

const Selected = ({ clientData, totalQuantity }: SearchModalProps) => {
  const [productOptions, setProductOptions] = useState([]);
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [cylinderOptions, setCylinderOptions] = useState([]);
  const [axiesOptions, setAxiesOptions] = useState<any[]>([]);
  const [additionOptions, setAdditionOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCylinder, setSelectedCylinder] = useState("");
  const [selectedAxies, setSelectedAxies] = useState("");
  const [selectedAddition, setSelectedAddition] = useState("");
  const [selectedCodeNumber, setSelectedCodeNumber] = useState("");
  const [optionsQuatity, setOptionsQuatity] = useState("");
  const [axiesObject, setAxiesObject] = useState<any[]>([]);
  const dataStorage = useDataStorage();

  const quantityValue =
    totalQuantity >= 4 ? 1 : 4 / Math.pow(2, totalQuantity - 1);

  useEffect(() => {
    dataStorage.setAxiesId(axiesObject);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiesObject]);

  useEffect(() => {
    if (selectedAxies && optionsQuatity) {
      setAxiesObject([
        ...dataStorage.AxiesId,
        {
          productId: selectedAxies,
          amount: optionsQuatity,
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionsQuatity, selectedAxies]);

  useEffect(() => {
    getCodeNumber()
      .then((response) => {
        const codeNumberOptions = response.value.map((item: any) => ({
          value: item.value,
          id: item.label,
        }));
        setProductOptions(codeNumberOptions);
      })
      .catch((error) => {});
  }, [
    setSelectedCodeNumber,
    setSelectedProduct,
    setSelectedCylinder,
    setSelectedAxies,
    setSelectedAddition,
    setOptionsQuatity,
  ]);

  useEffect(() => {
    if (selectedCodeNumber) {
      getDegree(selectedCodeNumber)
        .then((response) => {
          const degreeOptions = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));

          setDegreeOptions(degreeOptions);
        })
        .catch((error) => {});
    }
  }, [selectedCodeNumber]);

  useEffect(() => {
    if (selectedCodeNumber && selectedProduct) {
      getCylinder(selectedCodeNumber, selectedProduct)
        .then((response) => {
          const cylinderOptions = response.value.map((item: any) => ({
            value: item.value,
            id: item.label,
          }));

          setCylinderOptions(cylinderOptions);
        })
        .catch((error) => {});
    }
  }, [selectedCodeNumber, selectedProduct]);

  useEffect(() => {
    if (selectedCodeNumber && selectedProduct && selectedCylinder) {
      getAxle(selectedCodeNumber, selectedProduct, selectedCylinder)
        .then((response) => {
          const axiesOptions = response.value.map((item: any) => ({
            value: item.label,
            id: item.value === "X" ? item.info : item.value,
          }));
          setAxiesOptions(axiesOptions);
        })
        .catch((error) => {});
    }
  }, [selectedCodeNumber, selectedProduct, selectedCylinder]);

  useEffect(() => {
    if (
      selectedCodeNumber &&
      selectedProduct &&
      selectedCylinder &&
      axiesOptions
    ) {
      getAddition(
        selectedCodeNumber,
        selectedProduct,
        selectedCylinder,
        axiesOptions.find((item: any) => item.id === selectedAxies)?.value
      )
        .then((response) => {
          const additionOptions = response.value.map((item: any) => ({
            value: item.label,
            id: item.value === "X" ? item.info : item.value,
          }));

          setAdditionOptions(additionOptions);
        })
        .catch((error) => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCodeNumber, selectedProduct, selectedCylinder, selectedAxies]);

  return (
    <div className="w-full">
      <div className="bg-careGrey rounded-xl mt-5 p-5 fade-in">
        <div className="flex flex-col md:flex md:flex-row mt-3 gap-2 w-full">
          <div className="xl:w-72 2xl:w-80 w-80 text-careDarkBlue font-bold">
            <div className="flex items-center gap-1">
              <span>Produto Vendido</span>
              <span className="hidden md:block tooltip text-careDarkBlue cursor-pointer">
                <BsQuestionCircle size={16} />
                <span className="tooltiptext">
                  <span className="md:text-sm xl:text-xs 2xl:text-base">
                    <span className="text-careDarkBlue mr-1">
                      {" "}
                      Campo obrigatório
                    </span>
                  </span>
                </span>
              </span>
            </div>

            <CustomSelect
              id="input-tipo-de-produto"
              options={productOptions}
              value={selectedCodeNumber}
              onChange={(e) => setSelectedCodeNumber(e.target.value)}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>

          <div className="xl:w-20 2xl:w-40 w-80 text-careDarkBlue font-bold">
            <div className="flex items-center gap-1">
              <span>Dioptria</span>
              <span className="hidden md:block tooltip text-careDarkBlue cursor-pointer">
                <BsQuestionCircle size={16} />
                <span className="tooltiptext">
                  <span className="md:text-sm xl:text-xs 2xl:text-base">
                    <span className="text-careDarkBlue mr-1">
                      {" "}
                      Campo obrigatório
                    </span>
                  </span>
                </span>
              </span>
            </div>
            <CustomSelect
              id="input-dioptria"
              options={degreeOptions}
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>
          <div className="xl:w-20 2xl:w-40 w-80 text-careDarkBlue font-bold">
            <div className="flex items-center gap-1">
              <span>Cilíndrico</span>
              <span className="hidden md:block tooltip text-careDarkBlue cursor-pointer">
                <BsQuestionCircle size={16} />
                <span className="tooltiptext">
                  <span className="md:text-sm xl:text-xs 2xl:text-base">
                    <span className="text-careDarkBlue mr-1">
                      {" "}
                      Campo obrigatório
                    </span>
                  </span>
                </span>
              </span>
            </div>

            <CustomSelect
              id="input-cilindrico"
              options={cylinderOptions}
              value={selectedCylinder}
              onChange={(e) => setSelectedCylinder(e.target.value)}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>
          <div className="xl:w-20 2xl:w-40 w-80 text-careDarkBlue font-bold">
            <div className="flex items-center gap-1">
              <span>Eixo</span>
              <span className="hidden md:block tooltip text-careDarkBlue cursor-pointer">
                <BsQuestionCircle size={16} />
                <span className="tooltiptext">
                  <span className="md:text-sm xl:text-xs 2xl:text-base">
                    <span className="text-careDarkBlue mr-1">
                      {" "}
                      Campo obrigatório
                    </span>
                  </span>
                </span>
              </span>
            </div>
            <CustomSelect
              id="input-eixo"
              options={axiesOptions}
              value={selectedAxies}
              onChange={(e) => {
                setSelectedAxies(e.target.value);
              }}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>
          <div className="xl:w-20 2xl:w-40 w-80 text-careDarkBlue font-bold">
            <div className="flex items-center gap-1">
              <span>Adiçao</span>
              <span className="hidden md:block tooltip text-careDarkBlue cursor-pointer">
                <BsQuestionCircle size={16} />
                <span className="tooltiptext">
                  <span className="md:text-sm xl:text-xs 2xl:text-base">
                    <span className="text-careDarkBlue mr-1">
                      {" "}
                      Campo obrigatório
                    </span>
                  </span>
                </span>
              </span>
            </div>
            <CustomSelect
              id="input-adicao"
              options={additionOptions}
              value={selectedAddition}
              onChange={(e) => {
                dataStorage.setIdSelected(e.target.value);
                setSelectedAddition(e.target.value);
              }}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>
          <div className="md:w-40 w-80 text-careDarkBlue font-bold">
            <div className="flex items-center gap-1">
              <span>Quantidade</span>
              <span className="hidden md:block tooltip text-careDarkBlue cursor-pointer">
                <BsQuestionCircle size={16} />
                <span className="tooltiptext">
                  <span className="md:text-sm xl:text-xs 2xl:text-base">
                    <span className="text-careDarkBlue mr-1">
                      {" "}
                      Campo obrigatório
                    </span>
                  </span>
                </span>
              </span>
            </div>
            <CustomSelect
              id="input-quantidade"
              options={[
                {
                  value: quantityValue.toString(),
                  id: quantityValue.toString(),
                },
              ]}
              value={optionsQuatity}
              onChange={(e) => {
                setOptionsQuatity(e.target.value);
              }}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Selected;
