import Input from "@/components/input/Input";
import Image from "next/image";
import { useRouter } from "next/router";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import Button from "@/components/button/Button";
import CardExpanded from "@/components/card/CardExpanded";
import { useEffect, useRef, useState } from "react";
import InputMask from "react-input-mask";
import { ToastContainer, toast } from "react-toastify";
import { registerUser, strongPassword } from "@/services/login";
import { registerAdm } from "@/services/login";
import dayjs from "dayjs";
import Modal from "@/components/modals/Modal";
import ReCAPTCHA from "react-google-recaptcha";
import validarCPF from "@/helpers/ValidateCPF";
import { Checkbox } from "@mui/material";
import useLogin from "@/hooks/useLogin";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

export default function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isValidEmail, setIsValidEmail] = useState(false);
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProgramRegulationModal, setShowProgramRegulationModal] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [isSecondCheckboxChecked, setIsSecondCheckboxChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [verifyCaptcha, setVerifyCaptcha] = useState(false);
  const [cpfIsValid, setCpfIsValid] = useState(false);
  const auth = useLogin();
  const clickLockRef = useRef(false);

  const [registerAccount, setRegisterAccount] = useState({
    User: {
      Email: "",
      Password: "",
    },
    name: "",
    confirmedPassword: "",
    birthdate: "",
    mobilephone: "",
    cpf: "",
    programCode: "073",
    isAdmin: false,
  });

  const [registerAccountAdmin, setRegisterAccountAdmin] = useState({
    emailAddress: "",
    mobilephone: "",
    userName: "",
    password: "",
    isAdmin: true,
    birthDate: "",
    cpf: "",
    programCode: "073",
  });

  // const checkCPF = () => {
  //   if (validarCPF(registerAccount.cpf && registerAccountAdmin.cpf) === false) {
  //     toast.error("CPF inválido");
  //     return setCpfIsValid(true);
  //   }
  // };

  const checkCPF = () => {
    const isValid = validarCPF(registerAccount.cpf && registerAccountAdmin.cpf);
    if (!isValid) {
      toast.error("CPF inválido");
    }
    setCpfIsValid(isValid);
  };

  const onChange = (value: any) => {
    setVerifyCaptcha(true);
  };

  const handleSignup = () => {
    setLoading(true);

    if (registerAccount.isAdmin) {
      registerAdm(registerAccountAdmin)
        .then(() => {
          toast.success("Cadastro administrador realizado com sucesso");
          localStorage.setItem("mobilephone", registerAccount.mobilephone);
          auth.setMobilePhoneRegister(registerAccount.mobilephone);
          auth.setEmailRegister(registerAccountAdmin.emailAddress);
          auth.setCpfRegister(registerAccountAdmin.cpf);
          router.push("/confirmation");
        })
        .catch((err) => {
          toast.error("Erro ao realizar cadastro");
          clickLockRef.current = false;
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      registerUser(registerAccount)
        .then((res) => {
          if (!res.isValidData) {
            toast.error(res.value);
            setLoading(false);
            clickLockRef.current = false;
            return;
          }
          toast.success("Cadastro realizado com sucesso");
          localStorage.setItem("mobilephone", registerAccount.mobilephone);
          auth.setMobilePhoneRegister(registerAccount.mobilephone);
          auth.setEmailRegister(registerAccount.User.Email);
          auth.setCpfRegister(registerAccount.cpf);
          router.push("/confirmation");
        })
        .catch((err) => {
          toast.error("Erro ao realizar cadastro");
          clickLockRef.current = false;
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const passwordStrong = () => {
    if (clickLockRef.current) return;
    clickLockRef.current = true;
    setLoading(true);

    strongPassword(
      registerAccount.User.Password || registerAccountAdmin.password
    )
      .then((res) => {
        if (!res.isValid) {
          res.policiesResult?.forEach((policy: any) => {
            if (!policy.isValid) {
              toast.error(policy.message);
            }
          });
          setLoading(false);
          clickLockRef.current = false;
          return;
        }

        handleSignup();
      })
      .catch(() => {
        toast.error("Erro ao verificar a senha");
        setLoading(false);
        clickLockRef.current = false;
      });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name === "Email") {
      const isAdmin = value.includes(".myacuvue_brasil@its.jnj.com");
      setRegisterAccount((prevState) => ({
        ...prevState,
        isAdmin: isAdmin,
        User: { ...prevState.User, Email: value },
      }));
      setRegisterAccountAdmin((prevState) => ({
        ...prevState,
        emailAddress: value,
        userName: value,
      }));
    } else if (name === "Password") {
      setRegisterAccount((prevState) => ({
        ...prevState,
        User: { ...prevState.User, Password: value },
      }));
      setRegisterAccountAdmin((prevState) => ({
        ...prevState,
        password: value,
      }));
    } else if (name === "birthdate") {
      const formattedDate = dayjs(value, "DD-MM-YYYY").format("YYYY-MM-DD");

      setRegisterAccount((prevState) => ({
        ...prevState,
        birthdate: formattedDate,
      }));
      setRegisterAccountAdmin((prevState) => ({
        ...prevState,
        birthDate: formattedDate,
      }));
    } else if (name === "name") {
      const validatedValue = validateName(value);
      setInputValue(validatedValue);
      setRegisterAccount((prevState) => ({
        ...prevState,
        name: validatedValue,
      }));
      setRegisterAccountAdmin((prevState) => ({
        ...prevState,
        name: validatedValue,
      }));
    } else {
      setRegisterAccount((prevState) => ({ ...prevState, [name]: value }));
      setRegisterAccountAdmin((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const validateName = (inputValue: string) => {
    const filteredValue = inputValue.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, "");
    const truncatedValue = filteredValue.slice(0, 50);
    return truncatedValue;
  };

  const checkIsUnderage = (birthdateString: string) => {
    const birthdate = dayjs(birthdateString);
    const today = dayjs();
    const age = today.diff(birthdate, "year");
    return age >= 18;
  };

  const CompletedIsCpf = (cpf: string) => {
    const cpfNumbers = cpf.replace(/[^\d]/g, "");
    return cpfNumbers.length === 11;
  };

  const isValidMobilephone = (mobilephone: string) => {
    const cleanedMobilephone = mobilephone.replace(/\D/g, "");

    if (cleanedMobilephone.length !== 11) {
      return false;
    }
    if (cleanedMobilephone[2] !== "9") {
      return false;
    }
    if (/^(\d)\1+$/.test(cleanedMobilephone)) {
      return false;
    }
    return true;
  };

  const completedForm = () => {
    const { User } = registerAccount;
    const { Email, Password } = User;
    const { name, birthdate, mobilephone, cpf, confirmedPassword } =
      registerAccount;
    return (
      name !== "" &&
      showValidationMessage === false &&
      checkIsUnderage(birthdate) &&
      isValidMobilephone(mobilephone) &&
      cpf !== "" &&
      isCheckboxChecked &&
      isSecondCheckboxChecked
    );
  };

  const handleCheckboxChange = (e: any) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const handleSecondCheckbox = (e: any) => {
    setIsSecondCheckboxChecked(e.target.checked);
  };

  const handleEmailChange = (e: any) => {
    const inputEmail = e.target.value;
    setEmail(inputEmail);
    setIsValidEmail(inputEmail.includes("@") && inputEmail.includes("."));
  };

  useEffect(() => {
    if (email === "") {
      setShowValidationMessage(false);
    } else {
      setShowValidationMessage(!isValidEmail);
    }
  }, [email, isValidEmail]);

  const maskedPhoneNumber = () => {
    return (
      <InputMask
        id="fill_form_step4_telefone"
        mask="(99) 99999-9999"
        maskPlaceholder=""
        alwaysShowMask={false}
        name="mobilephone"
        onChange={handleChange}
        disabled={loading}
        className="h-12 md:h-16 xl:h-14 2xl:h-16"
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="Telefone"
            startIcon
            iconClass="scale-x-[-1]"
            imageSrc="/communication-call.png"
          />
        )}
      </InputMask>
    );
  };

  const maskedCpf = () => {
    return (
      <InputMask
        id="fill_form_step5_cpf"
        name="cpf"
        mask="999.999.999-99"
        maskPlaceholder=""
        alwaysShowMask={false}
        onChange={handleChange}
        onBlur={checkCPF}
        disabled={loading}
        className="h-12 md:h-16 xl:h-14 2xl:h-16"
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            disabled={loading}
            placeholder="CPF"
            startIcon
            imageSrc="/education-teacher.png"
          />
        )}
      </InputMask>
    );
  };

  const maskedBirthDate = () => {
    return (
      <InputMask
        id="fill_form_step3_nascimento"
        name="birthdate"
        mask="99/99/9999"
        maskPlaceholder=""
        alwaysShowMask={false}
        onChange={handleChange}
        disabled={loading}
        className="h-12 md:h-16 xl:h-14 2xl:h-16"
      >
        {(inputProps: any) => (
          <Input
            {...inputProps}
            placeholder="Data de nascimento"
            startIcon
            imageSrc="/calendar-data.png"
          />
        )}
      </InputMask>
    );
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAcceptTerm = () => {
    handleCloseModal();
    setIsSecondCheckboxChecked(true);
  };

  const handleRescueTerm = () => {
    handleCloseModal();
    setIsSecondCheckboxChecked(false);
  };

  return (
    <div className="h-[135vh] md:h-screen bg-careDarkBlue ">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />

      <div className="hidden xl:block">
        <div className="fixed z-40 w-60 h-[7%] right-0 bottom-[40%] bg-[#007cc4]"></div>
        <div className="fixed z-40 w-60 h-[7%] right-0 bottom-[30%] bg-[#007cc4]"></div>
        <div className="fixed z-40 w-60 h-[7%] right-0 bottom-[20%] bg-[#007cc4]"></div>
      </div>
      <div className="z-40 block absolute top-3 left-[80%] md:top-5 md:left-[90%]">
        <span className="text-white  text-sm md:text-base">
          Powered by{" "}
          <span className="text-white font-bold text-sm md:text-lg">Viveo</span>
        </span>
      </div>
      <Image
        src="/LogoMyAcuvue.png"
        className="z-40 block absolute top-8 left-5 md:top-5 md:left-7"
        alt="acuvue letter"
        width={220}
        height={50}
      />
      <div className="block md:hidden">
        <Image
          width={1000}
          height={1000}
          alt="background-mobile"
          src="/bg-login-mobile.png"
          className="absolute"
          quality={100}
        />
      </div>
      <div className="hidden xl:block">
        <Image
          fill
          alt="background"
          src="/svg/new-visioncare.svg"
          className="object-left-bottom object-cover"
          quality={100}
        />
      </div>
      <CardExpanded>
        <div className="xl:flex xl:flex-col text-careLightBlue">
          <span className="md:text-5xl xl:text-3xl 2xl:text-[35px] text-2xl">
            Criar conta no Programa{" "}
            <span className="md:text-5xl xl:text-3xl 2xl:text-[35px]  text-2xl">
              <strong>My</strong>ACUVUE
              <span className="text-sm relative bottom-5">®</span>
            </span>
          </span>
        </div>
        <div className="my-3">
          <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-lg">
            Preencha com atenção os campos abaixo.Certifique-se de inserir
            corretamente seu e-mail e telefone. O código da próxima etapa será
            enviado por esses meios.
          </span>
        </div>
        <div className="fill-careBlue w-full">
          <Input
            name="name"
            fullWidth
            placeholder="Nome"
            startIcon
            imageSrc="/user-user.png"
            onChange={handleChange}
            disabled={loading}
            maxLength={50}
            value={inputValue}
            className="h-12 md:h-16 xl:h-14 2xl:h-16"
            id="fill_form_step1_nome-completo"
          />
          <div className="md:grid md:grid-cols-2 gap-8">
            <div className="md:col-col-2">
              <Input
                id="fill_form_step2_email"
                name="Email"
                placeholder="E-mail"
                required
                startIcon
                maxLength={100}
                imageSrc="/communication-mail.png"
                disabled={loading}
                onChange={(e: any) => {
                  handleEmailChange(e);
                  handleChange(e);
                }}
                className="h-12 md:h-16 xl:h-14 2xl:h-16"
                onBlur={() => {
                  setShowValidationMessage(!isValidEmail);
                }}
              />
              {showValidationMessage && (
                <div className="mt-2">
                  <span className="text-red-500 text-sm ">Email inválido</span>
                </div>
              )}
            </div>
            {maskedBirthDate()}
          </div>
          <div className="md:grid md:grid-cols-2 gap-8 my-2">
            {maskedPhoneNumber()}
            {maskedCpf()}
          </div>
          <div className="md:grid md:grid-cols-2 gap-8  fill-careBlue">
            <Input
              id="fill_form_step6_senha"
              name="Password"
              placeholder="Senha"
              startIcon
              imageSrc="/house-lock.png"
              endIcon
              maxLength={20}
              type="password"
              onChange={handleChange}
              disabled={loading}
              className="h-12 md:h-16 xl:h-14 2xl:h-16"
            />
            <Input
              id="fill_form_step7_confirmar-senha"
              name="confirmedPassword"
              placeholder="Confirmar senha"
              startIcon
              imageSrc="/house-lock.png"
              endIcon
              maxLength={20}
              type="password"
              onChange={handleChange}
              disabled={loading}
              className="h-12 md:h-16 xl:h-14 2xl:h-16"
            />
          </div>
        </div>
        <div className="flex flex-col md:grid md:grid-cols-1 md:gap-x-10 md:ml-4 mt-2">
          <div className="text-[12px] md:text-[14px] text-careDarkBlue flex items-center gap-1">
            <span>•</span>{" "}
            <span>
              A senha deve conter até{" "}
              <span className="font-bold">12 caracteres</span>{" "}
            </span>
          </div>
          <div className="text-[12px] md:text-[14px] text-careDarkBlue flex items-center gap-1">
            <span>•</span>
            <span>
              Pelo menos um{" "}
              <span className="font-bold">caractere especial,</span> um{" "}
              <span className="font-bold">número</span> e uma{" "}
              <span className="font-bold">letra maiúscula</span> (Exemplo:
              Acuvue@12345).
            </span>
          </div>
        </div>
        <div className="md:grid md:grid-cols-1 mt-2">
          <div className="md:flex md:flex-col text-careDarkBlue">
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
                checked={isCheckboxChecked}
                onChange={handleCheckboxChange}
                id="checkbox-registrar"
                className="h-6 w-6 md:ml-2"
              />
              <span className="md:text-md text-[12px] font-semibold ml-1">
                Li e entendi o
                <span
                  onClick={() => setShowProgramRegulationModal(true)}
                  className="text-careLightBlue underline cursor-pointer hover:opacity-60 ml-1"
                >
                  Regulamento do Programa de Benefícios MyACUVUE
                  <span style={{ verticalAlign: "super", fontSize: "0.6em" }}>
                    ®
                  </span>
                  .
                </span>
              </span>
            </div>
            <div className="w-full">
              <Checkbox
                icon={<RadioButtonUncheckedIcon />}
                checkedIcon={<RadioButtonCheckedIcon />}
                checked={isSecondCheckboxChecked}
                onChange={handleSecondCheckbox}
                sx={{
                  color: "#007cc4",
                  "&.Mui-checked": {
                    color: "#007cc4",
                  },
                }}
                id="checkbox-registrar-2"
                className="h-6 w-6 md:ml-2"
              />
              <span className="md:text-md text-[12px] font-semibold ml-1">
                Li e entendi a
                <span
                  onClick={handleOpenModal}
                  className="text-careLightBlue underline hover:opacity-60 cursor-pointer ml-1"
                >
                  Política de Privacidade da Johnson & Johnson.
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="mt-1 md:mt-2">
          <ReCAPTCHA
            sitekey="6LfYB54pAAAAANncwo4gIYJPaAT5zZczt2KbqHkn"
            onChange={onChange}
            theme="light"
            type="image"
          />
        </div>
        <div className="flex flex-col xl:mt-4 2xl:mt-2 items-center justify-center">
          <Button
            id="fill_form_step1_finalizar-cadastro"
            customClass="bg-careLightBlue border-careLightBlue py-2 h-12 w-full xl:w-96 2xl:w-[26rem] mt-1"
            label="Finalizar cadastro"
            onClick={passwordStrong}
            isLoading={loading}
            disabled={
              loading ||
              !completedForm() ||
              !CompletedIsCpf(registerAccount.cpf) ||
              !verifyCaptcha ||
              !cpfIsValid
            }
          />
          <Button
            id="voltar-button-registrar"
            customClass="bg-careBlue border-careBlue py-2 h-12 w-full xl:w-96 2xl:w-[26rem] mt-1 "
            label="Voltar"
            onClick={() => router.push("/")}
            disabled={loading}
          />
        </div>
      </CardExpanded>
      <div>
        {showModal && (
          <Modal
            customClass="w-[60%] h-[80%]"
            isOpen={showModal}
            onClose={handleCloseModal}
            isButtonDisabled={true}
            isCloseIconVisible={false}
          >
            <div className="flex items-center justify-center h-full">
              <div className="w-full h-[63vh]">
                <iframe
                  src="/DOC2-AvisoePoliticadeprivacidadeparaaplicação_site_cookiesessenciais.pdf"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                id="click_privacidade_recusar"
                onClick={handleRescueTerm}
                className="bg-careBlue hover:opacity-70 text-white font-bold py-2 px-4 rounded w-48 "
              >
                Recusar
              </button>
              <button
                id="click_privacidade_aceitar"
                onClick={handleAcceptTerm}
                className="bg-careLightBlue hover:opacity-70 text-white font-bold py-2 px-4 rounded w-48 "
              >
                Aceitar
              </button>
            </div>
          </Modal>
        )}
      </div>

      {showProgramRegulationModal && (
        <Modal
          customClass="w-[60%] h-[80%]"
          isOpen={showProgramRegulationModal}
          onClose={handleCloseModal}
          isButtonDisabled={true}
          isCloseIconVisible={false}
        >
          <div className="flex items-center justify-center h-full">
            <div className="w-full h-[63vh]">
              <iframe src="/regulamento.pdf" className="w-full h-full"></iframe>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={() => {
                setIsCheckboxChecked(false);
                setShowProgramRegulationModal(false);
              }}
              className="bg-careBlue hover:opacity-70 text-white font-bold py-2 px-4 rounded w-48 "
              id="click_regulamento_recusar"
            >
              Recusar
            </button>
            <button
              onClick={() => {
                setIsCheckboxChecked(true);
                setShowProgramRegulationModal(false);
              }}
              className="bg-careLightBlue hover:opacity-70 text-white font-bold py-2 px-4 rounded w-48 "
              id="click_regulamento_aceitar"
            >
              Aceitar
            </button>
          </div>
        </Modal>
      )}
      <div className="hidden z-40 md:flex justify-between absolute bottom-5 left-10 right-48">
        <div className="text-white flex flex-col">
          <span>Copyright © 2024 | Todos </span>
          <span className="text-white">os direitos reservados à Viveo </span>
        </div>
        <div className="flex space-x-7 mt-10">
          <a
            href="DOC1-Politicadeprivacidadeparaaplicação_site_cookiesessenciais.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm underline"
          >
            Política de Privacidade
          </a>
          <a
            href="AVISOLEGALMYACUVUE.pdf"
            className="text-white text-sm underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aviso Legal
          </a>
          <a
            href="/REGULAMENTOAOCONSUMIDOR-MyACUVUE.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm underline"
          >
            Regulamento
          </a>
        </div>
      </div>
      <div className="z-40 md:hidden justify-between absolute -bottom-[225px] left-5">
        <div className="text-white text-[12px] flex flex-col">
          <span>Copyright © 2024 | Todos </span>
          <span className="text-white">os direitos reservados à Viveo </span>
        </div>
      </div>
      <div className="z-40 md:hidden justify-between absolute -bottom-[253px] bg-white w-full"></div>
      <div className="z-40 md:hidden justify-between absolute -bottom-[295px] bg-careLightBlue w-full p-5">
        <div className="flex space-x-5">
          <a
            href="DOC1-Politicadeprivacidadeparaaplicação_site_cookiesessenciais.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm underline"
          >
            Política de Privacidade
          </a>
          <a
            href="/AVISOLEGALMYACUVUE.pdf"
            className="text-white text-sm underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Aviso Legal
          </a>
          <a
            href="/REGULAMENTOAOCONSUMIDOR-MyACUVUE.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white text-sm underline"
          >
            Regulamento
          </a>
        </div>
      </div>
    </div>
  );
}
