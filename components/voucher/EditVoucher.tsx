import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import useEditVoucher from "@/hooks/useEditVoucher";
import { deleteVoucher, getVoucherPatient, updateVoucher } from "@/services/voucher";
import { toast } from "react-toastify";
import useDataStorage from "@/hooks/useDataStorage";
import CustomSelect from "../select/Select";
import InputVoucher from "../input/InputVoucher";
import { Checkbox } from "@mui/material";
import MultiSelected from "../select/MultiSelected";
import { listPartiner } from "@/services/partiner";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const EditVoucher = ({ refreshTable }: { refreshTable: () => void }) => {
  const dataStorage = useDataStorage();
  const editVoucher = useEditVoucher();
  const [loading, setLoading] = useState(false);
  const [arrayDemMultiselect, setArrayDemMultiselect] = useState<any[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [validadePorCadastro, setValidadePorCadastro] = useState(false);
  const [naoExpiravel, setNaoExpiravel] = useState(false);
  const [renovavel, setRenovavel] = useState(false);

  const [voucher, setVoucher] = useState({
    id: dataStorage.idEditVoucher,
    Name: "",
    DiscountType: "",
    DiscountValue: 0,
    DeadlineInDays: null,
    IssuanceDate: null,
    DueDate: "",
    QuantityBox: "",
    InvoicedBox: "",
    BonusBox: "",
    ClinicId: "",
    RenewableDays: "",
    Renewable: false,
    ValidityRegistration: false,
    PromotionRuleId: null,
    Note: "",
  });

  // Estado para armazenar o voucher original para comparação
  const [originalVoucher, setOriginalVoucher] = useState<any>(null);

  const [voucherCancel, setVoucherCancel] = useState({
    id: dataStorage.idEditVoucher,
    ProgramCode: "073",
  });

  // Verifica se a vigência já iniciou
  const isVoucherActive = () => {
    if (!voucher.IssuanceDate) return false;
    const issuanceDate = new Date(voucher.IssuanceDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Zera hora para comparar só datas
    return issuanceDate < today; // true se a vigência já passou (antes de hoje)
  };

  // Define quais campos podem ser editados conforme regras
  const canEditField = (fieldName: string) => {
    if (voucher.Renewable) return false; // bloqueia tudo

    if (isVoucherActive()) {
      // Só permite editar nome e SAPs participantes se ativo
      return fieldName === "Name" || fieldName === "ClinicId" || fieldName === "DueDate";
    }

    // Se vigência ainda não começou ou é hoje, pode editar tudo
    return true;
  };

  const handleDeleteVoucher = async () => {
    try {
      const response = await deleteVoucher(voucherCancel.id, voucherCancel.ProgramCode);
      if (response.isValidData) {
        toast.success("Voucher excluído com sucesso!");
        editVoucher.onClose();
        dataStorage.setRefresh(!dataStorage.refresh);
        setVoucherCancel({ id: "", ProgramCode: "073" });
      } else {
        toast.warning(response.additionalMessage || "Voucher não encontrado");
        dataStorage.setRefresh(!dataStorage.refresh);
        editVoucher.onClose();
      }
    } catch (err) {
      toast.error("Erro ao cancelar voucher.");
    }
  };

  // Função que verifica se o voucher atual é igual ao original (sem alterações)
  const isVoucherUnchanged = () => {
    if (!originalVoucher) return false; // ainda não carregou, permite salvar

    return (
      voucher.Name === originalVoucher.Name &&
      voucher.DiscountType === originalVoucher.DiscountType &&
      Number(voucher.DiscountValue) === Number(originalVoucher.DiscountValue) &&
      voucher.DeadlineInDays === originalVoucher.DeadlineInDays &&
      voucher.IssuanceDate === originalVoucher.IssuanceDate &&
      voucher.DueDate === originalVoucher.DueDate &&
      voucher.QuantityBox === originalVoucher.QuantityBox &&
      voucher.InvoicedBox === originalVoucher.InvoicedBox &&
      voucher.BonusBox === originalVoucher.BonusBox &&
      JSON.stringify(selectedPartners) === JSON.stringify(JSON.parse(originalVoucher.ClinicId || "[]")) &&
      voucher.RenewableDays === originalVoucher.RenewableDays &&
      voucher.Renewable === originalVoucher.Renewable &&
      voucher.ValidityRegistration === originalVoucher.ValidityRegistration &&
      voucher.PromotionRuleId === originalVoucher.PromotionRuleId &&
      voucher.Note === originalVoucher.Note
    );
  };

  const handleUpdateVoucher = async () => {
    if (voucher.Renewable) {
      toast.error("Voucher renovável não pode ser editado, apenas excluído.");
      return;
    }

    if (isVoucherUnchanged()) {
      toast.info("Nenhuma alteração foi realizada.");
      return;
    }

    setLoading(true);
    updateVoucher({
      ...voucher,
      ClinicId: JSON.stringify(selectedPartners),
      DueDate: voucher.DueDate === "" ? null : voucher.DueDate,
      IssuanceDate: voucher.IssuanceDate === "" ? null : voucher.IssuanceDate,
      BonusBox: String(voucher.BonusBox),
      ProgramCode:"073",
    })
      .then(() => {
        toast.success("Voucher editado com sucesso!");
        editVoucher.onClose();
      })
      .catch(() => {
        toast.error("Erro ao editar voucher.");
      })
      .finally(() => {
        setLoading(false);
        dataStorage.setRefresh(!dataStorage.refresh);
      });
  };

  useEffect(() => {
    listPartiner().then((response) => {
      const options = response.map((item: any) => ({
        label: item.name,
        value: item.accountId,
      }));
      setArrayDemMultiselect(options);
    });
  }, []);

  useEffect(() => {
    getVoucherPatient(dataStorage.idEditVoucher).then((response) => {
      const clinicArray = (() => {
        try {
          const parsed = JSON.parse(response.clinicId);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      })();

      setSelectedPartners(clinicArray);
      setRenovavel(response.renewable);
      const loadedVoucher = {
        id: dataStorage.idEditVoucher,
        Name: response.name,
        DiscountType: response.discountType,
        DiscountValue: response.discountValue,
        DeadlineInDays: response.deadlineInDays,
        IssuanceDate: response.issuanceDate ? response.issuanceDate.split("T")[0] : null,
        DueDate: response.dueDate ? response.dueDate.split("T")[0] : "",
        QuantityBox: response.quantityBox,
        InvoicedBox: response.invoicedBox,
        BonusBox: response.bonusBox,
        ClinicId: JSON.stringify(clinicArray),
        RenewableDays: response.renewableDays,
        Renewable: response.renewable,
        ValidityRegistration: response.validityRegistration,
        PromotionRuleId: response.promotionRuleId,
        Note: response.note,
      };

      setVoucher(loadedVoucher);
      setOriginalVoucher(loadedVoucher); // Guarda o voucher original para comparar depois
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (!canEditField(name)) {
      toast.warning("Campo não pode ser editado conforme regras.");
      return;
    }

    if (name === "QuantityBox" || name === "InvoicedBox") {
      const newVoucher = {
        ...voucher,
        [name]: value,
      };
      setVoucher(newVoucher);

      const caixas = Number(newVoucher.QuantityBox);
      const faturadas = Number(newVoucher.InvoicedBox);

      if (!isNaN(caixas) && !isNaN(faturadas)) {
        calcularBonificacao(caixas, faturadas);
      }
    } else {
      setVoucher({ ...voucher, [name]: value });
    }
  };

  const calcularBonificacao = (caixas: number, faturadas: number) => {
    if (caixas > 0 && faturadas > 0) {
      const bonificadas = caixas - faturadas;
      const percentual = (bonificadas / caixas) * 100;

      setVoucher((prev: any) => ({
        ...prev,
        Caixas: caixas,
        CaixasFaturadas: faturadas,
        BonusBox: bonificadas > 0 ? bonificadas : 0,
        DiscountValue: percentual > 0 ? percentual : 0,
      }));
    }
  };

  const handleDateChange = (field: string, value: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (value < todayStr) {
      toast.warning("Não é permitido escolher datas anteriores a hoje.");
      setVoucher((prev: any) => ({
        ...prev,
        [field]: "",
      }));
      return;
    }
    setVoucher((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="w-full fade-in">
       <span className=" text-careLightBlue text-2xl font-bold">
         Editar promoção
        </span> 
    
          <div className="sm:grid grid-cols-1 md:grid md:grid-cols-4 gap-6 mt-5">
            <div className="col-span-2">
              <span className="text-careDarkBlue">
                Nome da promoção:
              </span>
              <InputVoucher
            id="input-voucher-nome"
            name="Name"
            value={voucher.Name}
            onChange={handleChange}
            placeholder="Nome da promoção"
            disabled={!canEditField("Name")}
          />
            </div>
            <div>
              <span className="text-careDarkBlue">
                Qtde de caixas:
              </span>
             <InputVoucher
              name="QuantityBox"
              type="number"
              value={voucher.QuantityBox}
              onChange={handleChange}
              placeholder="Qtde de caixas"
              disabled={!canEditField("QuantityBox")}
            />
            </div>
            <div>
              <span className="text-careDarkBlue">
                Caixas faturadas:
              </span>
             <InputVoucher
              name="InvoicedBox"
              type="number"
              value={voucher.InvoicedBox}
              onChange={handleChange}
              placeholder="Caixas faturadas"
              disabled={!canEditField("InvoicedBox")}
              
            />
            </div>
             <div className="col-span-2">
              <span className="text-careDarkBlue">
                Regra da promoção:
              </span>
              <CustomSelect
                  id=""
                  name="PromotionRuleId"
                  fullWidth
                  placeholder="Selecione a regra"
                  options={[
                    {
                      id: "BBA63EED-D4FC-4E09-89DF-D56F09C90FC0",
                      value: "Todos os usuários cadastrados",
                    },
                    {
                      id: "F8651660-6E6E-4761-B855-63CDEB0FA3A5",
                      value: "Usuários que fizeram a adaptação",
                    },
                  ]}
                  onChange={(e) => {
                    setVoucher((prev: any) => ({
                      ...prev,
                      PromotionRuleId: e.target.value,
                    }));
                  }}
                  value={(voucher.PromotionRuleId || "").toUpperCase()}
                  disabled={!canEditField("PromotionRuleId")}
                />
            </div>
            <div>
              <span className="text-careDarkBlue opacity-60">
                Caixas bonificadas:
              </span>
             <InputVoucher
              name="BonusBox"
              value={voucher.BonusBox}
              disabled
              placeholder="Caixas bonificadas"
              onChange={
                (e) => {
                  setVoucher({ ...voucher, BonusBox: e.target.value });
                }
              }
            />
            </div>
            <div>
              <span className="text-careDarkBlue opacity-60">
                % de desconto:
              </span>
             <InputVoucher
                name="DiscountValue"
                value={`${Math.round(Number(voucher.DiscountValue))}%`}
                disabled
                placeholder="% de desconto"
                onChange={
                  (e:any) => {
                    setVoucher({ ...voucher, DiscountValue: e.target.value });
                  }
                }
              />
            </div>
          
       
          </div>
           <div className="sm:grid grid-cols-1 md:grid md:grid-cols-6 gap-6 mt-5 items-center">
           
            <div className="flex items-center mt-6">
            <Checkbox
             sx={{
                  color: "#007cc4",
                  "&.Mui-checked": {
                    color: "#007cc4",
                  },
                }}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<RadioButtonCheckedIcon />}
                id="checkbox-validade-cadastro"
                checked={validadePorCadastro}
                disabled={naoExpiravel || renovavel || voucher.Renewable || isVoucherActive()}
                 
                onChange={(e) => setValidadePorCadastro(e.target.checked)}
              />
              <div>
                 <span className="text-[#618697]">{voucher.PromotionRuleId === "F8651660-6E6E-4761-B855-63CDEB0FA3A5" ? "Validade por Adaptação" : "Validade por Cadastro"}</span>
              </div>
             
            </div>
          {validadePorCadastro && (
                <div>
                  <span className="text-[#618697]">Tempo para utilização:</span>
                  <InputVoucher
                    
                    id="input-voucher-tempo"
                    name="DeadlineInDays"
                    value={voucher.DeadlineInDays}
                    onChange={handleChange}
                    placeholder="Tempo para utilização"
                    disabled={!canEditField("DeadlineInDays")}
                  />
                </div>
              )}
            <div>
              <span className="text-[#618697]">Início Vigência:</span>
                <InputVoucher
                 
                  id="input-voucher-inicio"
                  name="IssuanceDate"
                  type="date"
                  value={voucher.IssuanceDate}
                  onChange={(e) => handleDateChange("IssuanceDate", e.target.value)}
                  placeholder="Início Vigência"
                  disabled={!canEditField("IssuanceDate")}
                />
            </div>
            <div>
              <span className="text-[#618697]">Expiração:</span>
                <InputVoucher
                  id="input-voucher-expiracao"
                  name="DueDate"
                  type="date"
                  value={voucher.DueDate}
                  onChange={(e) => handleDateChange("DueDate", e.target.value)}
                  placeholder="Expiração"
                  disabled={
                    (!canEditField("DueDate") || naoExpiravel) 
                  }
                />
                            
            </div>
            <div className="flex flex-col mt-5">
              <div>
                 <Checkbox
                  sx={{
                  color: "#007cc4",
                  "&.Mui-checked": {
                    color: "#007cc4",
                  },
                }}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<RadioButtonCheckedIcon />}
                id="checkbox-nao-expiravel"
                checked={naoExpiravel}
                name="NaoExpiravel"
                onChange={(e) => setNaoExpiravel(e.target.checked)}
                disabled={validadePorCadastro || renovavel || voucher.Renewable || isVoucherActive()}
                />
              <span className="text-[#618697]">Não Expirável</span>
              </div>
              <div>
                 <Checkbox
                  sx={{
                  color: "#007cc4",
                  "&.Mui-checked": {
                    color: "#007cc4",
                  },
                }}
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<RadioButtonCheckedIcon />}
                    id="checkbox-renovavel"
                    name="Renewable"
                    checked={voucher.Renewable}
                    
                    onChange={(e) => {
                       setRenovavel(e.target.checked);
                      setVoucher((prev: any) => ({
                        ...prev,
                        Renewable: e.target.checked,
                      }));
                    }}
                   disabled
                  />
              <span className="text-[#618697]">Renovável</span>
              </div>
            
            </div>
          {renovavel && (
               <div>
                <CustomSelect
               
                id=""
                name="RenewableDays"
                value={voucher.RenewableDays}
                fullWidth
                placeholder="Selecione"
                options={[
                  {
                    id: "0",
                    value: "Imediatamente",
                  },
                  {
                    id: "30",
                    value: "30 dias",
                  },
                  {
                    id: "60",
                    value: "60 dias",
                  },
                  {
                    id: "90",
                    value: "90 dias",
                  },
                  {
                    id: "120",
                    value: "120 dias",
                  },
                  {
                    id: "180",
                    value: "180 dias",
                  },
                ]}
                onChange={(e) => {
                  setVoucher((prev:any) => ({
                    ...prev,
                    RenewableDays: e.target.value,
                  }));
                }}
                disabled={!canEditField("RenewableDays")}
              />
              </div>
            )}
             
          </div>
          <div className="grid grid-cols-1 md:grid md:grid-cols-2 mt-5">
            <div>
              <span className="text-careDarkBlue">
              SAPs participantes:
            </span>
              <MultiSelected
                name="ClinicId"
                customClass="min-h-[4rem] border-2 rounded-lg"
                options={arrayDemMultiselect}
                value={selectedPartners}
                onChange={(event, newValue) => {
                  setSelectedPartners(newValue);
                  setVoucher((prev:any) => ({
                    ...prev,
                    ClinicId: newValue,
                  }));
                }}
                placeholder="Selecione os SAPs"
                disabled={!canEditField("ClinicId")}
              />
            </div>
            
          </div>      
          <div className="flex flex-col md:flex md:flex-row md:justify-center mt-2 md:mt-20 mb-10 w-full gap-4">
            <div className="flex items-center">
              <span onClick={handleDeleteVoucher} className="underline uppercase text-red-600 cursor-pointer">Excluir promoção</span>
            </div>
            <Button
              id="button-voucher-voltar"
              onClick={editVoucher.onClose}
              customClass="bg-careDarkBlue border-careDarkBlue py-3 px-10 md:w-60"
              label="Cancelar"
              
            />
            <Button
            disabled={loading || voucher.Renewable}
              id="button-voucher-cadastrar"
              isLoading={loading}
              onClick={handleUpdateVoucher}
              customClass="bg-careLightBlue border-careLightBlue py-3 px-10 md:w-600"
              label="Salvar editar"
             
            />
         </div>
      
   
  </div>
  );
};

export default EditVoucher;

