import React from "react";
import { useState } from "react";
import Input from "../input/Input";
import CustomSelect from "../select/Select";
import Button from "../button/Button";
import { addPartiner } from "@/services/partiner";
import { ToastContainer, toast } from "react-toastify";
import InputMask from "react-input-mask";
import useRegisterPartiner from "@/hooks/useRegisterPartiner";
import { getAddressByCep } from "@/services/cep";
import useDataStorage from "@/hooks/useDataStorage";
import InputLoading from "../loading/InputLoading";
import useOpenModalConfirm from "@/hooks/useOpenModalConfirm";
import NewModal from "../modals/NewModal";
import { validDDDs } from "@/utils/validDDDs";

const CreatePartiner = ({ refreshTable }: { refreshTable: () => void }) => {
  const partiner = useRegisterPartiner();
  const dataScheduling = useDataStorage();
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [email, setEmail] = useState("");
  const [registerPartiner, setRegisterPartiner] = useState({
    accountTypeStringMapFlag: "",
    name: "",
    telephone1: "",
    mobilePhone: "",
    emailAddress: "",
    emailAddress2: "",
    addressPostalCode: "",
    addressName: "",
    addressNumber: "",
    addressComplement: "",
    addressDistrict: "",
    addressCity: "",
    addressState: "",
    addressCountry: "",
    cnpj: "",
    mainContact: "",
    password: "",
    ProgramCode: "073",
    sapCode: "",
  });

  const isValidCNPJ = (cnpj: string) => {
    cnpj = cnpj.replace(/[^\d]+/g, "");
    if (cnpj.length !== 14) return false;

    if (/^(\d)\1+$/.test(cnpj)) return false;

    let t = cnpj.length - 2,
      d = cnpj.substring(t),
      d1 = parseInt(d.charAt(0)),
      d2 = parseInt(d.charAt(1)),
      calc = (x: number) => {
        let n = cnpj.substring(0, x),
          y = x - 7,
          s = 0,
          r = 0;

        for (let i = x; i >= 1; i--) {
          s += +n.charAt(x - i) * y--;
          if (y < 2) y = 9;
        }
        r = 11 - (s % 11);
        return r > 9 ? 0 : r;
      };
    return calc(t) === d1 && calc(t + 1) === d2;
  };

  const isValidPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, "");
    return cleaned.length === 10 || cleaned.length === 11;
  };

  const isValidCEP = (cep: string) => {
    return /^[0-9]{8}$/.test(cep);
  };

  const handleRegisterPartiner = () => {
    const {
      cnpj,
      telephone1,
      mobilePhone,
      addressPostalCode,
      password,
      emailAddress,
      emailAddress2,
    } = registerPartiner;


    const cnpjClean = cnpj.replace(/\D/g, "");
    if (!isValidCNPJ(cnpj)) return toast.error("CNPJ inválido!");

    if (!isValidPhone(telephone1)) return toast.error("Telefone fixo inválido!");
    if (!isValidPhone(mobilePhone)) return toast.error("Telefone celular inválido!");

    const cepClean = addressPostalCode.replace(/\D/g, "");
    if (!isValidCEP(cepClean)) return toast.error("CEP inválido!");

    if (emailAddress && (!emailAddress.includes("@") || !emailAddress.includes(".")))
      return toast.error("E-mail principal inválido!");
    if (emailAddress2 && (!emailAddress2.includes("@") || !emailAddress2.includes(".")))
      return toast.error("E-mail corporativo inválido!");

    if (!validatePassword()) return;

    addPartiner(registerPartiner)
      .then((res) => {
        if (res === "CNPJ já cadastrado!" || res === "E-mail já cadastrado.") {
          toast.error(res);
          return;
        }
        toast.success("Parceiro cadastrado com sucesso!");
        dataScheduling.setRefresh(!dataScheduling.refresh);
        partiner.onClose();
        refreshTable();
      })
      .catch(() => {
        toast.error("Erro ao cadastrar parceiro!");
      });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    const onlyNumbers = name === "sapCode" ? value.replace(/\D/g, "") : value;

    setRegisterPartiner((prev) => ({
      ...prev,
      [name]: onlyNumbers,
    }));
  };

  const handleAddress = () => {
    const cep = registerPartiner.addressPostalCode.replace(/\D/g, "");
    setIsLoadingAddress(true);

    getAddressByCep(cep)
      .then((res) => {
        if (res.erro) {
          toast.error("CEP não encontrado. Verifique e tente novamente.");
          setIsLoadingAddress(false);
          return;
        }

        setRegisterPartiner((prev) => ({
          ...prev,
          addressName: res.logradouro,
          addressDistrict: res.bairro,
          addressCity: res.localidade,
          addressState: res.uf,
          addressCountry: "Brasil",
        }));

        setIsLoadingAddress(false);
      })
      .catch(() => {
        toast.error("Erro ao buscar o CEP. Verifique se está correto.");
        setIsLoadingAddress(false);
      });
  };

  const maskedCNPJ = () => {
    return (
      <InputMask
        id="input-criar-parceiro-cnpj"
        name="cnpj"
        onChange={handleChange}
        onBlur={validateCNPJ}
        mask="99.999.999/9999-99"
        maskChar={null}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="00.000.000/0000-00"
            startIcon
            imageSrc="/education-teacher.png"
          />
        )}
      </InputMask>
    );
  };

  const maskedPhone = () => {
    return (
      <InputMask
        id="input-criar-parceiro-telefone"
        name="telephone1"
        onChange={handleChange}
        onBlur={() => validatePhone(registerPartiner.telephone1, "telefone fixo")}
        mask="(99) 9999-9999"
        maskChar={null}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="(00) 0000-0000"
            startIcon
            imageSrc="/communication-call.png"
          />
        )}
      </InputMask>
    );
  };

  const maskedCep = () => {
    return (
      <InputMask
        id="input-criar-parceiro-cep"
        name="addressPostalCode"
        onChange={handleChange}
        mask="99999-999"
        maskChar={null}
        onBlur={() => { validateCEP(); handleAddress(); }}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            maxLength={160}
            placeholder="00000-000"
            startIcon
            imageSrc="/navigation-maps.png"
          />
        )}
      </InputMask>
    );
  };

  const maskedMobilePhone = () => {
    return (
      <InputMask
        id="input-criar-parceiro-celular"
        name="mobilePhone"
        onChange={handleChange}
        onBlur={() => validatePhone(registerPartiner.mobilePhone, "celular")}
        mask="(99) 99999-9999"
        maskChar={null}
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="(00) 00000-0000"
            startIcon
            imageSrc="/communication-call.png"
          />
        )}
      </InputMask>
    );
  };

  const validateEmail = (e: any) => {
    setEmail(e);
    if (e === "") {
      toast.error("Preencha com um e-mail válido!");
      return;
    }
    if (e.indexOf("@") === -1 || e.indexOf(".") === -1) {
      toast.error("E-mail inválido!");
      return;
    }
  };

  const validatePassword = () => {
    const password = registerPartiner.password;

    if (password.length < 8) {
      toast.error("A senha deve conter no mínimo 8 dígitos!");
      return false;
    }
    if (password.length > 20) {
      toast.error("A senha deve conter no máximo 20 dígitos!");
      return false;
    }
    if (password === "") {
      toast.error("Preencha com uma senha válida!");
      return false;
    }
    if (password.indexOf(" ") !== -1) {
      toast.error("A senha não pode conter espaços!");
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      toast.error("A senha deve conter pelo menos uma letra maiúscula!");
      return false;
    }
    if (!/[a-z]/.test(password)) {
      toast.error("A senha deve conter pelo menos uma letra minúscula!");
      return false;
    }
    if (!/[0-9]/.test(password)) {
      toast.error("A senha deve conter pelo menos um número!");
      return false;
    }
    if (!/[\W_]/.test(password)) {
      toast.error("A senha deve conter pelo menos um caractere especial!");
      return false;
    }
    return true;
  };

  const validateCNPJ = () => {
    const cnpj = registerPartiner.cnpj.replace(/\D/g, "");
    if (!isValidCNPJ(cnpj)) {
      toast.error("Preencha com um CNPJ válido!");
      return false;
    }
    return true;
  };

  const validateCEP = () => {
    const cep = registerPartiner.addressPostalCode.replace(/\D/g, "");
    if (!isValidCEP(cep)) {
      toast.error("Preencha com um CEP válido!");
      return false;
    }
    return true;
  };

  const validatePhone = (phone: string, label: string) => {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length !== 10 && cleaned.length !== 11) {
      toast.error(`Preencha com um ${label} válido!`);
      return false;
    }

    const ddd = cleaned.substring(0, 2);
    if (!validDDDs.includes(ddd)) {
      toast.error(`DDD inválido para o ${label}.`);
      return false;
    }

    return true;
  };

  return (
    <div className="w-full fill-careBlue fade-in">
      <div className="bg-white border-0 md:border md:border-careCyan rounded-lg p-6 mt-4">
        <div className="md:grid md:grid-cols-1">
          <div>
            <span className="text-2xl text-careLightBlue">
              Cadastrar parceiro
            </span>
            <div className="sm:grid grid-cols-1 md:grid md:grid-cols-3 gap-6 mt-5">
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">Nome:</span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">
                      O nome do responsável deve ser único
                    </span>
                  </span>
                </div>

                <Input
                  id="input-criar-parceiro-nome"
                  maxLength={50}
                  name="mainContact"
                  onChange={handleChange}
                  startIcon
                  imageSrc="/user-user.png"
                  placeholder="Nome do parceiro"
                />
              </div>
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">Razão Social:</span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">
                      O nome da empresa deve ser único
                    </span>
                  </span>
                </div>
                <Input
                  id="input-criar-parceiro-razao-social"
                  maxLength={50}
                  name="name"
                  onChange={handleChange}
                  startIcon
                  imageSrc="/health-hospital.png"
                  placeholder="Nome da razão social"
                />
              </div>
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">CNPJ:</span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">
                      O CNPJ deve ser único e válido
                    </span>
                  </span>
                </div>

                {maskedCNPJ()}
              </div>
            </div>
          </div>
        </div>
        <div className="md:grid md:grid-cols-1 gap-8">
          <div className="mt-2">
            <div className="sm:grid grid-caols-1 mb-8 md:mb-0 md:grid grid-cols-3 gap-6">
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">Código SAP:</span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">
                      O código SAP deve ser único
                    </span>
                  </span>
                </div>

                <Input
                  id="input-criar-parceiro-sap"
                  maxLength={20}
                  name="sapCode"
                  onChange={handleChange}
                  value={registerPartiner.sapCode}
                  startIcon
                  imageSrc="/icon-sap.png"
                  inputMode="numeric"
                  placeholder="000000"
                />
              </div>
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">Tipo:</span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">
                      Selecione o tipo de parceiro
                    </span>
                  </span>
                </div>

                <CustomSelect
                  id="select-criar-parceiro-tipo"
                  value={registerPartiner.accountTypeStringMapFlag}
                  startIcon
                  imageSrc="/eyes-icon.png"
                  fullWidth
                  name="accountTypeStringMapFlag"
                  onChange={handleChange}
                  placeholder="Selecione uma opção"
                  options={[
                    {
                      id: "#Clinic",
                      value: "(ECP) Clínicas",
                    },
                    {
                      id: "#POS",
                      value: "PDV (Óticas)",
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-3 w-full h-[1px] my-6 mt-6 mb-6" style={{ backgroundColor: "rgb(132, 189, 223)" }} />
        <div className="md:grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <div className="flex gap-2">
              <span className="text-careBlue">CEP:</span>
              <span className="tooltip text-careDarkBlue">
                <span className="text-careRedButton">*</span>
                <span className="tooltiptext">Digite um CEP válido</span>
              </span>
            </div>
            {maskedCep()}
          </div>

          <div className="md:col-span-1">
            <div className="flex gap-2">
              <span className="text-careBlue">Endereço:</span>
              <span className="tooltip text-careDarkBlue">
                <span className="text-careRedButton">*</span>
              </span>
            </div>
            <Input
              id="input-criar-parceiro-endereco"
              value={registerPartiner.addressName}
              maxLength={160}
              name="addressName"
              onChange={handleChange}
              startIcon
              imageSrc="/navigation-maps.png"
              placeholder="Digite o endereço"
            />
          </div>

          <div className="md:col-span-1">
            <div className="flex gap-2">
              <span className="text-careBlue">Número:</span>
              <span className="tooltip text-careDarkBlue">
                <span className="text-careRedButton">*</span>
                <span className="tooltiptext">Digite um número válido</span>
              </span>
            </div>
            <Input
              id="input-criar-parceiro-numero"
              maxLength={160}
              name="addressNumber"
              onChange={handleChange}
              startIcon
              imageSrc="/navigation-maps.png"
              placeholder="Digite seu número"
            />
          </div>

          <div className="md:col-span-1">
            <div className="flex gap-2">
              <span className="text-careBlue">Complemento:</span>
            </div>
            <Input
              id="input-criar-parceiro-complemento"
              maxLength={160}
              name="addressComplement"
              onChange={handleChange}
              startIcon
              imageSrc="/navigation-maps.png"
              placeholder="Complemento"
            />
          </div>
        </div>

        {isLoadingAddress ? (
          <InputLoading />
        ) : (
          <div className="md:grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Bairro:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                </span>
              </div>
              <Input
                id="input-criar-parceiro-bairro"
                value={registerPartiner.addressDistrict}
                maxLength={160}
                name="addressDistrict"
                onChange={handleChange}
                startIcon
                imageSrc="/navigation-maps.png"
                placeholder="Digite seu bairro"
              />
            </div>

            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Cidade:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                </span>
              </div>
              <Input
                id="input-criar-parceiro-cidade"
                value={registerPartiner.addressCity}
                maxLength={160}
                name="addressCity"
                onChange={handleChange}
                startIcon
                imageSrc="/navigation-maps.png"
                placeholder="Digite sua cidade"
              />
            </div>

            <div>
              <div className="flex gap-2">
                <span className="text-careBlue">Estado:</span>
                <span className="tooltip text-careDarkBlue">
                  <span className="text-careRedButton">*</span>
                </span>
              </div>
              <Input
                id="input-criar-parceiro-estado"
                value={registerPartiner.addressState}
                maxLength={160}
                name="addressState"
                onChange={handleChange}
                startIcon
                imageSrc="/navigation-maps.png"
                placeholder="Digite seu estado"
              />
            </div>
          </div>
        )}

        <div className="col-span-3 w-full h-[1px] my-6 mb-4" style={{ backgroundColor: "rgb(132, 189, 223)" }} />
        <div className="md:grid md:grid-cols-1 gap-8 ">
          <div className="mt-2">
            <div className="sm:grid grid-cols-1 md:grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">Telefone:</span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">Digite um telefone válido</span>
                  </span>
                </div>

                {maskedPhone()}
              </div>
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">
                    Celular/Whatsapp:
                  </span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">Digite um celular válido</span>
                  </span>
                </div>

                {maskedMobilePhone()}
              </div>
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">E-mail:</span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">Digite um e-mail válido</span>
                  </span>
                </div>

                <Input
                  id="input-criar-parceiro-email"
                  maxLength={100}
                  name="emailAddress"
                  onChange={handleChange}
                  startIcon
                  imageSrc="/communication-mail.png"
                  placeholder="endereco-email@email.com.br"
                  onBlur={() => validateEmail(registerPartiner.emailAddress)}
                />
              </div>
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">
                    {" "}
                    E-mail corporativo:
                  </span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">
                      Digite um e-mail de parceiro válido
                    </span>
                  </span>
                </div>
                <Input
                  id="input-criar-parceiro-email2"
                  maxLength={100}
                  name="emailAddress2"
                  onChange={handleChange}
                  startIcon
                  imageSrc="/communication-mail.png"
                  placeholder="endereco-email@email.com.br"
                  onBlur={() => validateEmail(registerPartiner.emailAddress2)}
                />
              </div>
              <div>
                <div className="flex gap-2">
                  <span className="text-careBlue">Senha:</span>
                  <span className="tooltip text-careDarkBlue">
                    <span className="text-careRedButton">*</span>
                    <span className="tooltiptext">
                      Campo obrigatório, deve conter no mínimo 8 dígitos
                    </span>
                  </span>
                </div>
                <Input
                  id="input-criar-parceiro-senha"
                  maxLength={20}
                  name="password"
                  onChange={handleChange}
                  startIcon
                  imageSrc="/house-lock.png"
                  placeholder="Com pelo menos 8 dígitos"
                  onBlur={() => validatePassword()}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 w-full">
          <p className="text-sm text-red-600 text-right ml-1">
            *Campos obrigatórios
          </p>
        </div>
        <div className="flex flex-row md:flex-row justify-center md:justify-center items-center md:items-start gap-4 mt-4">
          <Button
            id="btn-criar-parceiro-voltar"
            onClick={partiner.onClose}
            customClass="bg-careBlue border-careBlue p-4 py-3 px-10 w-full md:w-[200px]"
            label="Voltar"
          />
          <Button
            id="btn-criar-parceiro-adicionar"
            disabled={
              registerPartiner.name === "" ||
              registerPartiner.cnpj === "" ||
              registerPartiner.accountTypeStringMapFlag === "" ||
              registerPartiner.sapCode === "" ||
              registerPartiner.telephone1 === "" ||
              registerPartiner.password === "" ||
              registerPartiner.addressPostalCode === "" ||
              registerPartiner.addressName === "" ||
              registerPartiner.addressNumber === "" ||
              registerPartiner.addressDistrict === "" ||
              registerPartiner.addressCity === "" ||
              registerPartiner.addressState === "" ||
              registerPartiner.addressCountry === "" ||
              registerPartiner.mainContact === "" ||
              registerPartiner.emailAddress === "" ||
              registerPartiner.emailAddress2 === "" ||
              registerPartiner.mobilePhone === "" ||
              registerPartiner.password === ""
            }
            onClick={handleRegisterPartiner}
            customClass="bg-careLightBlue border-careLightBlue p-4 py-3 px-10 w-full md:w-[200px]"
            label="Adicionar"
          />
        </div>
      </div>
    </div>
  );
};

export default CreatePartiner;
