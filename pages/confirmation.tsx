import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Head from "next/head";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/router";
import { BsChatSquareDots } from "react-icons/bs";
import { useEffect, useState } from "react";
import {
  confirmationRegisterSmsToken,
  resendToken,
  resetPassword,
} from "@/services/login";
import { toast } from "react-toastify";
import { AiOutlineClose } from "react-icons/ai";
import { IoAlert, IoAlertCircle } from "react-icons/io5";
import { set } from "date-fns";
import useLogin from "@/hooks/useLogin";

const Confirmation = () => {
  const router = useRouter();
  const [token, setToken] = useState(false);
  const [mensagemErroToken, setMensagemErroToken] = useState("");
  const [counter, setCounter] = useState(90);
  const [message, setMessage] = useState("");
  const auth = useLogin();

  const [registerSmsToken, setRegisterSmsToken] = useState({
    TamplateNameSms: "TOKEN_CADASTRO",
    TamplateNameEmail: "TOKEN_CADASTRO",
    token: "",
    mobilePhone: "",
    programCode: "073",
  });

  const [forgetPassword, setForgetPassword] = useState({
    mobilephone: auth.mobilePhoneRegister,
    cpf: auth.cpfRegister,
    programCode: "073",
  });

  useEffect(() => {
    const mobilephone = localStorage.getItem("mobilephone");

    if (mobilephone) {
      setRegisterSmsToken({ ...registerSmsToken, mobilePhone: mobilephone });
    }

    const timer = setInterval(() => {
      setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleResendCode = () => {
    resendToken(forgetPassword as any).then(() => {
      setMessage("Código reenviado com sucesso!");
      setCounter(90);
      setTimeout(() => setMessage(""), 7000);
    });
  };

  const handleSmsToken = () => {
    confirmationRegisterSmsToken(registerSmsToken)
      .then((res) => {
        if (res.isValidaData === false) {
          setToken(true);
          setMensagemErroToken(res.value);
        }
        if (res.isValidaData === true) {
          toast.success("Cadastro confirmado com sucesso!");
          router.push("/");
          setToken(false);
          setMensagemErroToken("");
        }
      })
      .catch((error) => {
        setToken(true);
        setMensagemErroToken(error.response.data.value);
      });
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setRegisterSmsToken({ ...registerSmsToken, [name]: value });
  };

  return (
    <div className="h-screen bg-careDarkBlue">
      <div className="xl:block md:hidden">
        <div className="fixed z-40 w-60 h-[6%] right-0 bottom-[33%] xl:bottom-[41%] bg-[#007cc4]"></div>
        <div className="fixed z-40 w-60 h-[6%] right-0 bottom-[26%] xl:bottom-[33%] bg-[#007cc4]"></div>
        <div className="fixed z-40 w-60 h-[6%] right-0 bottom-[19%] xl:bottom-[25%] bg-[#007cc4]"></div>
      </div>
      <div className="z-40 block absolute top-6 left-[80%] md:top-5 md:left-[90%]">
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
      <div className="h-full flex flex-col justify-end md:justify-center md:items-end w-screen mt-2">
        <div className="z-50 p-8 2xl:p-10 mb-32 lg:mb-3 bg-white rounded-3xl max-h-[80%] mx-auto w-11/12 md:w-6/12 lg:w-4/12 2xl:w-[27%] 2xl:mr-28 xl:mr-24 md:mx-auto">
          <div className="flex w-full h-full flex-col">
            <div className="flex justify-center text-careLightBlue text-4xl xl:text-3xl 2xl:text-4xl mb-14">
              <span>Confirmação de cadastro</span>
            </div>
            <div className="flex flex-col ">
              <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-lg">
                Enviamos um código por e-mail e SMS para você.
              </span>
              <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-lg">
                Insira abaixo e confirme seu cadastro!
              </span>
            </div>
            <div className="w-full flex flex-col gap-2 xl:gap-2 justify-end  md:mb-0">
              <Input
                name="token"
                onChange={handleChange}
                className="fill-careBlue h-12 md:h-16"
                startIcon
                iconStart={BsChatSquareDots}
                fullWidth
                placeholder="Inserir código de 6 dígitos"
                type="email"
                autoComplete="off"
                id="confirmar-token-cadastro"
                error={token}
                helperText={mensagemErroToken}
                maxLength={6}
              />
              <div className="flex flex-col items-start mt-4">
                <div className="flex items-center gap-2 text-sm font-bold">
                  <div className="bg-careLightBlue rounded-full p-1 h-7 w-7 flex items-center justify-center">
                    <IoAlert size={24} className="text-white" />
                  </div>
                  <span className="text-careTextError">
                    {message ? (
                      <span className="text-careBlue">{message}</span>
                    ) : counter > 0 ? (
                      <>
                        Aguarde{" "}
                        <span className="text-careBlue">
                          {counter} segundos
                        </span>{" "}
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
            </div>
            <div className="w-full flex flex-col mt-6 gap-2 xl:gap-3 justify-end">
              <Button
                customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-3 2xl:py-5"
                label="CONFIRMAR"
                onClick={handleSmsToken}
                id="click_cadastro_confirmar"
              />
              <Button
                customClass="bg-careBlue border-careBlue py-2 xl:py-3 2xl:py-5"
                label="VOLTAR"
                onClick={() => router.push("/")}
                id="click_cadastro_voltar"
              />
            </div>
          </div>
        </div>
      </div>
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

export default Confirmation;
