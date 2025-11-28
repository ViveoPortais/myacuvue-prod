import {
  getAddition,
  getAxle,
  getCodeNumber,
  getCylinder,
  getDegree,
  getListRescueVoucherPatients,
} from "@/services/voucher";
import CustomSelect from "../select/Select";
import React, { useEffect, useState } from "react";
import useDataStorage from "@/hooks/useDataStorage";

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
}

const SelectedReimbursement = ({ clientData }: SearchModalProps) => {
  const [productOptions, setProductOptions] = useState([]);
  const [degreeOptions, setDegreeOptions] = useState([]);
  const [cylinderOptions, setCylinderOptions] = useState([]);
  const [selectedAddition, setSelectedAddition] = useState("");
  const [axiesOptions, setAxiesOptions] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedCylinder, setSelectedCylinder] = useState("");
  const [selectedAxies, setSelectedAxies] = useState("");
  const [selectedCodeNumber, setSelectedCodeNumber] = useState("");
  const [optionsQuatity, setOptionsQuatity] = useState("");
  const [axiesObject, setAxiesObject] = useState<any[]>([]);
  const [additionOptions, setAdditionOptions] = useState([]);
  const dataStorage = useDataStorage();

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
    setAxiesObject,
    setAdditionOptions,
    setAxiesOptions,
    setCylinderOptions,
    setDegreeOptions,
    setProductOptions,
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

  const options = [];
  for (let i = 1; i <= 100; i++) {
    options.push({ value: i.toString(), id: i.toString() });
  }

  return (
    <div className="w-full">
      <div className="bg-careGrey rounded-xl mt-5 p-5 fade-in">
        <div className="flex flex-col md:flex md:flex-row mt-3 gap-2 w-full">
          <div className="xl:w-72 2xl:w-80 w-80 text-careDarkBlue font-bold">
            <span>Produto Vendido</span>
            <CustomSelect
              id="product-sold"
              options={productOptions}
              value={selectedCodeNumber}
              onChange={(e) => setSelectedCodeNumber(e.target.value)}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>

          <div className="xl:w-32 2xl:w-40 w-80 text-careDarkBlue font-bold">
            <span>Dioptria</span>
            <CustomSelect
              id="dioptria"
              options={degreeOptions}
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>
          <div className="xl:w-32 2xl:w-40 w-80 text-careDarkBlue font-bold">
            <span>Cilíndrico</span>
            <CustomSelect
              id="cylinder"
              options={cylinderOptions}
              value={selectedCylinder}
              onChange={(e) => setSelectedCylinder(e.target.value)}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>
          <div className="xl:w-32 2xl:w-40 w-80 text-careDarkBlue font-bold">
            <span>Eixo</span>
            <CustomSelect
              id="eixo"
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
          <div className="xl:w-32 2xl:w-40 w-80 text-careDarkBlue font-bold">
            <span>Adiçao</span>
            <CustomSelect
              id="adicao"
              options={additionOptions}
              value={selectedAddition}
              onChange={(e) => {
                setSelectedAddition(e.target.value);
              }}
              startIcon
              fullWidth
              name=""
              placeholder="Selecione o tipo de produto"
            />
          </div>
          <div className="md:w-40 w-80 text-careDarkBlue font-bold">
            <span>Quantidade</span>
            <CustomSelect
              id="quantidade"
              options={options}
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

export default SelectedReimbursement;
