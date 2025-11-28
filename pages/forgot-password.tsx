import Button from "@/components/button/Button";
import Input from "@/components/input/Input";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { MdOutlineMail } from "react-icons/md";
import Card from "@/components/card/Card";
import { resetPassword } from "@/services/login";
import { ToastContainer, toast } from "react-toastify";
import { BsChatSquareDots } from "react-icons/bs";
import useLogin from "@/hooks/useLogin";

const Confirmation = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const auth = useLogin();

  const [forgetPassword, setForgetPassword] = useState({
    userEmail: "",
    templateName: "#ForgotPasswordToken",
    programCode: "073",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForgetPassword((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetUserPassword = () => {
    setLoading(true);
    resetPassword(forgetPassword)
      .then((res) => {
        if (res.isValidData === false) {
          toast.error("E-mail não encontrado. Verifique e tente novamente.");
          setLoading(false);
          return;
        }

        auth.setLoginNewPassword(forgetPassword.userEmail);
        toast.success(
          "Token enviado por e-mail, sms e whatsapp. O código de verificação é válido por 5 minutos."
        );
        router.push("/new-password");
      })
      .catch((err) => {
        toast.error("Erro ao enviar email!");
        setLoading(false);
      });
  };

  return (
    <div className="h-screen bg-careDarkBlue">
      <ToastContainer
        position="top-right"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
      />
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
        <div className="flex flex-col justify-start text-careLightBlue text-4xl xl:text-4xl 2xl:text-5xl mb-5">
          <span>Esqueceu sua senha?</span>
        </div>
        <div className="my-3 xl:my-3 2xl:my-5 z-40 flex flex-col ">
          <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-xl">
            Por favor, insira o endereço de e-mail
          </span>
          <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-xl">
            associado à sua conta abaixo:
          </span>
        </div>
        <div className="w-full flex flex-col gap-2 xl:gap-2 justify-end md:my-7 md:mb-0">
          <Input
            name="userEmail"
            className="fill-careBlue h-12 md:h-14"
            startIcon
            imageSrc="/communication-mail.png"
            fullWidth
            placeholder="Seu e-mail"
            type="email"
            autoComplete="off"
            onChange={handleChange}
            disabled={loading}
            id="email-esqueceu-senha"
          />
        </div>
        <div className="w-full flex flex-col mt-8 gap-2 xl:gap-4 justify-end">
          <Button
            customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-3 2xl:py-5"
            label="Enviar"
            onClick={resetUserPassword}
            isLoading={loading}
            disabled={loading}
            id="click_esqueceu_enviar"
          />
          <Button
            customClass="bg-careBlue border-careBlue py-2 xl:py-3 2xl:py-5"
            label="VOLTAR"
            id="click_esqueceu_voltar"
            onClick={() => router.push("/login")}
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

export default Confirmation;
