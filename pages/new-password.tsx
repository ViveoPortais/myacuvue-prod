import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Card from "@/components/card/Card";
import { toast } from "react-toastify";
import useLogin from "@/hooks/useLogin";
import { newPassword, resetPassword } from "@/services/login";
import { IoAlert, IoAlertCircle } from "react-icons/io5";

const NewPassword = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [counter, setCounter] = useState(90);
  const [messageResendToken, setMessageResendToken] = useState("");
  const auth = useLogin();

  const [userPassword, setUserPassword] = useState(() => {
    if (auth.role === "Partner ECP VisionCare") {
      return {
        email: auth.name,
        password: "",
        Token: "",
        ProgramCode: "073",
        confirmPassword: "",
        TamplateNameEmail: "#REGISTERACCOUNTTOKEN",
        TamplateNameSms: "",
      };
    }
    if (auth.role === "Partner POS VisionCare") {
      return {
        email: auth.name,
        password: "",
        Token: "",
        ProgramCode: "073",
        confirmPassword: "",
        TamplateNameEmail: "#REGISTERACCOUNTTOKEN",
        TamplateNameSms: "",
      };
    }
    return {
      email: auth.loginNewPassword,
      password: "",
      Token: "",
      ProgramCode: "073",
      confirmPassword: "",
      TamplateNameEmail: "#ForgotPasswordToken",
      TamplateNameSms: "TOKEN_RESET_SENHA_VISION_CARE_SMS",
    };
  });

  const [forgetPassword, setForgetPassword] = useState(() => {
    if (auth.role === "Partner ECP VisionCare") {
      return {
        userEmail: auth.name,
        templateName: "#ForgotPasswordToken",
        programCode: "073",
      };
    }
    if (auth.role === "Partner POS VisionCare") {
      return {
        userEmail: auth.name,
        templateName: "#ForgotPasswordToken",
        programCode: "073",
      };
    }
    return {
      userEmail: auth.loginNewPassword,
      templateName: "#ForgotPasswordToken",
      programCode: "073",
    };
  });

  const handleResendCode = async () => {
    await resetUserPassword();
    setMessageResendToken(messageResendToken);
    setCounter(90);
    setTimeout(() => setMessageResendToken(""), 7000);
  };

  const handlePassword = async () => {
    // Faz uma cópia do objeto
    const removeConfirmPassword: Partial<typeof userPassword> = {
      ...userPassword,
    };

    // Remove o campo `confirmPassword`
    delete removeConfirmPassword.confirmPassword;

    // Faz a chamada da função com o objeto atualizado
    newPassword(removeConfirmPassword as any)
      .then((res) => {
        toast.success("Senha alterada com sucesso!");
        auth.onLogout();
        router.push("/");
      })
      .catch((err) => {
        toast.error(err.response.data.value);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserPassword((prevState) => ({ ...prevState, [name]: value }));

    if (name === "password") {
      validatePassword();
    } else if (name === "confirmPassword") {
      if (value !== userPassword.password) {
        setErrorPassword(true);
        setMensagem("As senhas não coincidem");
      } else {
        setErrorPassword(false);
        setMensagem("");
      }
    }
  };

  const validatePassword = () => {
    if (userPassword.password.length < 8) {
      setErrorPassword(true);
      setMensagem("A senha deve ter no mínimo 8 caracteres");
    } else if (userPassword.password.length > 20) {
      setErrorPassword(true);
      setMensagem("A senha deve ter no máximo 20 caracteres");
    } else if (!userPassword.password.match(/[0-9]/g)) {
      setErrorPassword(true);
      setMensagem("A senha deve conter ao menos um número");
    } else if (!userPassword.password.match(/[A-Z]/g)) {
      setErrorPassword(true);
      setMensagem("A senha deve conter ao menos uma letra maiúscula");
    } else if (!userPassword.password.match(/[a-z]/g)) {
      setErrorPassword(true);
      setMensagem("A senha deve conter ao menos uma letra minúscula");
    } else if (!userPassword.password.match(/[!@#$%^&*(),.?":{}|<>]/g)) {
      setErrorPassword(true);
      setMensagem("A senha deve conter ao menos um caractere especial");
    } else {
      setErrorPassword(false);
      setMensagem("");
    }
  };

  useEffect(() => {
    if (userPassword.password !== "") {
      validatePassword();
    }

    const timer = setInterval(() => {
      setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPassword.password]);

  const resetUserPassword = () => {
    resetPassword(forgetPassword)
      .then((res) => {
        if (res.isValidData === false) {
          setMessageResendToken(res.value);
          return;
        }

        auth.setLoginNewPassword(forgetPassword.userEmail);
        setMessageResendToken(res.value);
      })
      .catch((err) => {
        toast.error("Erro ao enviar email e sms!");
      });
  };

  return (
    <div className="h-screen bg-careDarkBlue">
      <div className="xl:block md:hidden">
        <div className="fixed z-40 w-60 h-[6%] right-0 bottom-[33%] xl:bottom-[41%] bg-[#007cc4]"></div>
        <div className="fixed z-40 w-60 h-[6%] right-0 bottom-[26%] xl:bottom-[33%] bg-[#007cc4]"></div>
        <div className="fixed z-40 w-60 h-[6%] right-0 bottom-[19%] xl:bottom-[25%] bg-[#007cc4]"></div>
      </div>
      <div className="z-40 block absolute top-3 left-[80%] md:top-5 md:left-[90%]">
        <span className="text-white  text-sm md:text-base">
          Powered by{" "}
          <span className="text-white font-bold text-sm md:text-lg">Viveo</span>
        </span>
      </div>
      <Image
        src="/LogoMyAcuvue.png"
        className="z-40 block absolute top-10 left-5 md:top-5 md:left-7"
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
      <div className="hidden xl:block 2xl:hidden">
        <Image
          fill
          alt="background"
          src="/svg/new-visioncare.svg"
          className="object-left-bottom object-cover"
          quality={100}
        />
      </div>
      <div className="hidden 2xl:block">
        <Image
          fill
          alt="background"
          src="/svg/new-visioncare.svg"
          className="object-left-bottom object-cover"
          quality={100}
        />
      </div>
      <Card>
        <div className="flex flex-col justify-start text-careLightBlue text-4xl 2xl:text-5xl xl:text-3xl mb-5">
          <span>Redefinição de senha</span>
        </div>
        <div className="xl:my-1 2xl:my-5 z-40 flex flex-col ">
          <span className="text-careBlue text-base opacity-70 xl:text-sm 2xl:text-xl">
            Insira o código que enviamos para o seu
          </span>
          <span className="text-careBlue text-base opacity-70 xl:text-sm 2xl:text-xl">
            e-mail ou sms e redefina a sua senha:
          </span>
        </div>
        <div className="w-full flex flex-col gap-2 xl:gap-2 justify-end md:my-2 md:mb-0">
          <Input
            name="Token"
            onChange={handleChange}
            className="fill-careDarkBlue h-12 md:h-16 xl:h-14 2xl:h-16"
            startIcon
            imageSrc="/icon-sap.png"
            fullWidth
            placeholder="Inserir código recebido por e-mail ou sms"
            type="email"
            autoComplete="off"
            id="token-input-nova-senha"
            maxLength={6}
          />

          <Input
            className="fill-careDarkBlue h-12 md:h-16 xl:h-14 2xl:h-16"
            startIcon
            imageSrc="/house-lock.png"
            fullWidth
            placeholder="Nova senha"
            endIcon
            type="password"
            autoComplete="off"
            name="password"
            onChange={handleChange}
            id="password-input-nova-senha"
            error={errorPassword}
            helperText={mensagem}
          />

          <Input
            className="fill-careDarkBlue h-12 md:h-16 xl:h-14 2xl:h-16"
            startIcon
            imageSrc="/house-lock.png"
            fullWidth
            placeholder="Confirmar senha"
            endIcon
            type="password"
            autoComplete="off"
            name="confirmPassword"
            onChange={handleChange}
            id="confirmar-senha-password-input-nova-senha"
            error={errorPassword}
            helperText={mensagem}
          />
        </div>
        <div className="flex flex-col items-start mt-4">
          <div className="flex items-center gap-2 text-sm font-bold">
            <div className="bg-careLightBlue rounded-full p-1 h-7 w-7 flex items-center justify-center">
              <IoAlert size={24} className="text-white" />
            </div>
            <span className="text-careTextError">
              {messageResendToken ? (
                <span className="text-careBlue">{messageResendToken}</span>
              ) : counter > 0 ? (
                <>
                  Aguarde{" "}
                  <span className="text-careBlue">{counter} segundos</span>{" "}
                  antes de solicitar outro código.
                </>
              ) : (
                <span className="text-careBlue">
                  Seu tempo para utilização do código expirou.
                </span>
              )}
            </span>
          </div>
          <button
            onClick={handleResendCode}
            className={`mt-2 text-sm underline ${
              counter > 0
                ? "text-gray-500 cursor-not-allowed"
                : "text-careLightBlue cursor-pointer"
            }`}
            disabled={counter > 0}
          >
            Reenviar código
          </button>
        </div>
        <div className="w-full flex flex-col mt-8 gap-2 xl:gap-4 justify-end">
          <Button
            customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-3 2xl:py-5"
            label="ENVIAR"
            onClick={handlePassword}
            isLoading={loading}
            disabled={
              loading ||
              userPassword.password === "" ||
              userPassword.Token === "" ||
              userPassword.confirmPassword === "" ||
              errorPassword
            }
            id="click_redefinicao_enviar"
          />
          <Button
            customClass="bg-careBlue border-careBlue py-2 xl:py-3 2xl:py-5"
            label="VOLTAR"
            onClick={() => router.push("/")}
            id="click_redefinicao_voltar"
          />
        </div>
      </Card>
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
      <div className="z-40 md:hidden justify-between absolute bottom-20 left-5">
        <div className="text-white text-[12px] flex flex-col">
          <span>Copyright © 2024 | Todos </span>
          <span className="text-white">os direitos reservados à Viveo </span>
        </div>
      </div>
      <div className="z-40 md:hidden justify-between absolute bottom-10 bg-white w-full">
        ~~
      </div>
      <div className="z-40 md:hidden justify-between absolute bottom-0 bg-careLightBlue w-full p-5">
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
    </div>
  );
};

export default NewPassword;
