import React, { useEffect, useState } from "react";
import Button from "../button/Button";
import useRegisterVoucher from "@/hooks/useRegisterVoucher";
import { toast } from "react-toastify";
import useRegisterModal from "@/hooks/useRegisterModal";
import useDataStorage from "@/hooks/useDataStorage";
import { addVoucher } from "@/services/voucher";
import InputVoucher from "../input/InputVoucher";
import CustomSelect from "../select/Select";
import { Checkbox } from "@mui/material";
import MultiSelected from "../select/MultiSelected";
import { listPartiner } from "@/services/partiner";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";

const RegisterVoucher = ({ refreshTable }: { refreshTable: () => void }) => {
  const dataStorage = useDataStorage();
  const registerVoucher = useRegisterVoucher();
  const [arrayDemMultiselect, setArrayDemMultiselect] = useState<any[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [validadePorCadastro, setValidadePorCadastro] = useState(false);
  const [tempoParaUtilizacao, setTempoParaUtilizacao] = useState("");
  const [naoExpiravel, setNaoExpiravel] = useState(false);
  const [renovavel, setRenovavel] = useState(false);
  const [loading, setLoading] = useState(false);

  const [voucher, setVoucher] = useState({
    Name: "",
    DiscountType: "",
    DiscountValue: 0,
    DeadlineInDays: null,
    IssuanceDate: "",
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

  useEffect(() => {
    listPartiner().then((response) => {
      const options = response.map((item: any) => ({
        label: item.name,
        value: item.accountId,
      }));
      setArrayDemMultiselect(options);
    });
  }, []);

  const formatDateTime = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toISOString();
  };

  const handleVoucher = async () => {
    setLoading(true);

    const formattedIssuanceDate = formatDateTime(voucher.IssuanceDate);
    const formattedDueDate = formatDateTime(voucher.DueDate);

    addVoucher({
      Name: voucher.Name,
      DiscountType: voucher.Name,
      DiscountValue: voucher.DiscountValue,
      DeadlineInDays: voucher.DeadlineInDays,
      IssuanceDate: formattedIssuanceDate || null,
      DueDate: formattedDueDate || null,
      QuantityBox: voucher.QuantityBox,
      InvoicedBox: voucher.InvoicedBox,
      BonusBox: String(voucher.BonusBox),
      ClinicId:
        selectedPartners.length > 0 ? JSON.stringify(selectedPartners) : null,
      RenewableDays: voucher.RenewableDays,
      Renewable: voucher.Renewable,
      ValidityRegistration: voucher.ValidityRegistration,
      PromotionRuleId: voucher.PromotionRuleId,
      Note: voucher.Note,
      ProgramCode: "073",
    })
      .then(() => {
        toast.success("Voucher cadastrado com sucesso!");
        dataStorage.setRefresh(!dataStorage.refresh);
        registerVoucher.onClose();
        refreshTable();
      })
      .catch(() => {
        setLoading(false);
        toast.error("Erro ao cadastrar voucher!");
      });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "QuantityBox" || name === "InvoicedBox") {
      const newVoucher = {
        ...voucher,
        [name]: value,
      };
      setVoucher(newVoucher);

      const caixas = Number(newVoucher.QuantityBox);
      const faturadas = Number(newVoucher.InvoicedBox);

      // Chama a função passando faturadas como undefined se estiver vazio ou zero
      calcularBonificacao(caixas, faturadas || undefined);
    } else {
      setVoucher({ ...voucher, [name]: value });
    }
  };

  const calcularBonificacao = (caixas: number, faturadas?: number) => {
    if (caixas > 0 && (faturadas === undefined || faturadas === 0)) {
      // Só Qtde de caixas preenchida - regra de brinde
      setVoucher((prev: any) => ({
        ...prev,
        BonusBox: caixas,
        DiscountValue: 100,
      }));
    } else if (caixas > 0 && faturadas !== undefined && faturadas > 0) {
      // Qtde de caixas e Caixas faturadas preenchidas - regra normal
      const bonificadas = caixas - faturadas;
      const percentual = bonificadas > 0 ? (bonificadas / caixas) * 100 : 0;

      setVoucher((prev: any) => ({
        ...prev,
        BonusBox: bonificadas > 0 ? bonificadas : 0,
        DiscountValue: percentual > 0 ? percentual : 0,
      }));
    } else {
      // Se não preencher ou valores inválidos, zera bonificadas e desconto
      setVoucher((prev: any) => ({
        ...prev,
        BonusBox: 0,
        DiscountValue: 0,
      }));
    }
  };

  useEffect(() => {
    if (tempoParaUtilizacao !== "" && voucher.IssuanceDate) {
      const inicio = new Date(voucher.IssuanceDate);
      inicio.setDate(inicio.getDate() + Number(tempoParaUtilizacao));
      const yyyy = inicio.getFullYear();
      const mm = String(inicio.getMonth() + 1).padStart(2, "0");
      const dd = String(inicio.getDate()).padStart(2, "0");
      const dataExpiracao = `${yyyy}-${mm}-${dd}`;
      setVoucher((prev) => ({
        ...prev,
        DueDate: dataExpiracao,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tempoParaUtilizacao, voucher.IssuanceDate]);

  return (
    <div className="w-full fade-in">
      <span className=" text-careDarkBlue">
        Aqui você pode criar novas campanhas de vouchers e gerenciar campanhas
        existentes.
      </span>
      <div className="border border-careLightBlue rounded-lg w-full p-5 mt-5">
        <div className="sm:grid grid-cols-1 md:grid md:grid-cols-7 gap-6 mt-5">
          <div className="col-span-3">
            <span className="text-careDarkBlue font-bold">
              Nome da promoção:
            </span>
            <InputVoucher
              id="input-voucher-nome"
              name="Name"
              value={voucher.Name}
              onChange={handleChange}
              placeholder="Nome da promoção"
            />
          </div>
          <div>
            <span className="text-careDarkBlue font-bold">Qtde de caixas:</span>
            <InputVoucher
              id="input-voucher-qtde-caixas"
              name="QuantityBox"
              type="number"
              value={voucher.QuantityBox}
              onChange={(e: any) => {
                const value = Number(e.target.value);
                if (value >= 0 || e.target.value === "") {
                  handleChange(e);
                }
              }}
              placeholder="Qtde de caixas"
            />
          </div>
          <div>
            <span className="text-careDarkBlue font-bold">
              Caixas faturadas:
            </span>
            <InputVoucher
              id="input-voucher-caixas-faturadas"
              name="InvoicedBox"
              type="number"
              value={voucher.InvoicedBox}
              onChange={(e: any) => {
                const value = Number(e.target.value);
                if (value >= 0 || e.target.value === "") {
                  handleChange(e);
                }
              }}
              placeholder="Caixas faturadas"
            />
          </div>
          <div>
            <span className="text-careDarkBlue opacity-60 font-bold">
              Caixas bonificadas:
            </span>
            <InputVoucher
              name="BonusBox"
              value={voucher.BonusBox}
              disabled
              placeholder="Caixas bonificadas"
              onChange={(e) => {
                setVoucher({ ...voucher, BonusBox: e.target.value });
              }}
            />
          </div>
          <div>
            <span className="text-careDarkBlue opacity-60 font-bold">
              % de desconto:
            </span>
            <InputVoucher
              id="input-voucher-desconto"
              name="DiscountValue"
              value={`${Math.round(Number(voucher.DiscountValue))}%`}
              disabled
              placeholder="% de desconto"
              onChange={(e: any) => {
                setVoucher({ ...voucher, DiscountValue: e.target.value });
              }}
            />
          </div>
        </div>
        <div className="sm:grid grid-cols-1 md:grid md:grid-cols-7 gap-6 mt-5 items-center">
          <div className="col-span-2">
            <span className="text-careDarkBlue font-bold">
              Regra da promoção:
            </span>
            <CustomSelect
              id="select-regra"
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
                  value: "Usuário que realizaram adaptação",
                },
              ]}
              onChange={(e) => {
                setVoucher((prev: any) => ({
                  ...prev,
                  PromotionRuleId: e.target.value,
                }));
              }}
              value={voucher.PromotionRuleId}
            />
          </div>
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
              disabled={naoExpiravel || renovavel}
              onChange={(e) => setValidadePorCadastro(e.target.checked)}
            />
            <div className="w-40">
              <span className="text-[#618697] font-bold">
                {voucher.PromotionRuleId ===
                "F8651660-6E6E-4761-B855-63CDEB0FA3A5"
                  ? "Validade por Adaptação"
                  : "Validade por Cadastro"}
              </span>
            </div>
          </div>
          {validadePorCadastro && (
            <div>
              <span className="text-[#618697] font-bold">
                Tempo para utilização:
              </span>
              <InputVoucher
                id="input-voucher-tempo"
                name="TempoParaUtilizacao"
                type="number"
                value={tempoParaUtilizacao}
                onChange={(e) => {
                  const val = e.target.value;
                  // permite só números e vazio
                  const num = val === "" ? "" : Number(val);
                  setTempoParaUtilizacao(num as any);
                }}
                placeholder="Tempo para utilização"
                maxLength={3}
              />
            </div>
          )}
          <div>
            <span className="text-[#618697] font-bold">Início Vigência:</span>
            <InputVoucher
              id="input-voucher-inicio"
              name="IssuanceDate"
              type="date"
              value={voucher.IssuanceDate}
              onChange={(e) => {
                setVoucher((prev: any) => ({
                  ...prev,
                  IssuanceDate: e.target.value,
                }));
              }}
              placeholder="Início Vigência"
            />
          </div>
          <div>
            <span className="text-[#618697] font-bold">Expiração:</span>
            <InputVoucher
              id="input-voucher-expiracao"
              name="DueDate"
              type="date"
              onChange={(e) => {
                setVoucher((prev) => ({
                  ...prev,
                  DueDate: e.target.value,
                }));
              }}
              value={voucher.DueDate}
              placeholder="Expiração"
              disabled={naoExpiravel || validadePorCadastro}
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
                disabled={validadePorCadastro}
                name="NaoExpiravel"
                onChange={(e) => {
                  const checked = e.target.checked;
                  setNaoExpiravel(checked);
                  setVoucher((prev) => ({
                    ...prev,
                    DueDate: checked ? "" : prev.DueDate,
                  }));
                }}
              />
              <span className="text-[#618697] font-bold">Não Expirável</span>
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
                disabled={validadePorCadastro}
                onChange={(e) => {
                  setRenovavel(e.target.checked);
                  setVoucher((prev: any) => ({
                    ...prev,
                    Renewable: e.target.checked,
                  }));
                }}
                value={voucher.Renewable}
              />
              <span className="text-[#618697] font-bold">Renovável</span>
            </div>
          </div>
          {renovavel && (
            <div>
              <CustomSelect
                id="select-renovavel"
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
                    id: "150",
                    value: "150 dias",
                  },
                  {
                    id: "180",
                    value: "180 dias",
                  },
                ]}
                onChange={(e) => {
                  setVoucher((prev: any) => ({
                    ...prev,
                    RenewableDays: e.target.value,
                  }));
                }}
              />
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid md:grid-cols-2 mt-5">
          <div>
            <span className="text-careDarkBlue font-bold">
              SAPs participantes:
            </span>
            <MultiSelected
              id="select-sap"
              name="ClinicId"
              customClass="min-h-[4rem] border-2 rounded-lg"
              options={arrayDemMultiselect}
              value={selectedPartners}
              onChange={(event, newValue) => {
                setSelectedPartners(newValue);
                setVoucher((prev) => ({
                  ...prev,
                  SapSelecionados: newValue,
                }));
              }}
              placeholder="Selecione os SAPs"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex md:flex-row md:justify-center mt-2 md:mt-20 mb-10 w-full gap-4">
          <Button
            id="button-voucher-voltar"
            onClick={registerVoucher.onClose}
            customClass="bg-careDarkBlue border-careDarkBlue py-3 px-10 w-60"
            label="Voltar"
          />
          <Button
            id="button-voucher-cadastrar"
            isLoading={loading}
            onClick={handleVoucher}
            customClass="bg-careLightBlue border-careLightBlue py-3 px-10 w-60"
            label="Adicionar"
            disabled={
              !voucher.Name ||
              !voucher.QuantityBox ||
              !voucher.InvoicedBox ||
              !voucher.PromotionRuleId ||
              !voucher.IssuanceDate ||
              (!naoExpiravel && !voucher.DueDate)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterVoucher;
