import Button from "@/components/button/Button";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/input/Input";
import Card from "@/components/card/Card";
import { getAdmData, getClientData, userLogin } from "@/services/login";
import { toast } from "react-toastify";
import useLogin from "@/hooks/useLogin";
import api from "@/services/api";
import { listPartiner } from "@/services/partiner";
import { useEffect } from "react";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [errorPassword, setErrorPassword] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [errorEmail, setErrorEmail] = useState(false);

  const router = useRouter();
  const auth = useLogin();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
    healthProgramCode: "073",
  });

  useEffect(() => {
    if (auth.isLogged) {
      router.push("/dashboard/home");
    }
  }, [auth.isLogged, router]);

  const getPartinerData = async (cnpj: string) => {
    listPartiner(cnpj)
      .then((res) => {
        auth.setUserData(res[0]);
      })
      .catch((err) => {});
  };

  const handleGetAdmData = async () => {
    getAdmData()
      .then((res) => {
        auth.setDataAdmin(res);
      })
      .catch((err) => {});
  };

  const handleGetUserData = () => {
    getClientData()
      .then((res) => {
        auth.setDataPatient(res.data);
      })
      .catch((err) => {});
  };

  const handleLogin = async () => {
    setLoading(true);

    userLogin(userData)
      .then((res) => {
        auth.setUserName(res.userName);
        auth.setName(res.name);
        auth.setToken(res.token);
        auth.setRole(res.role);
        auth.setFirstLogin(res.firstLogin);
        auth.setId(res.id);
        api.defaults.headers.Authorization = `Bearer ${res.token}`;
        toast.success("Login realizado com sucesso");
        auth.onLogin();
        getPartinerData(res.cnpj);
        handleGetAdmData();
        handleGetUserData();
        return router.push("/dashboard/home");
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          "O e-mail ou senha inserido não foi encontrado. Verifique se as informações estão corretas ou cadastre-se agora para ter acesso às recomendações personalizadas de lentes de contato ACUVUE."
        );
        // if (err.response.data) {
        //   setErrorPassword(true);
        //   setMensagem(err.response.data);
        // }

        setLoginAttempts(loginAttempts + 1);
        if (loginAttempts + 1 >= 5) {
          toast.error(
            "Você excedeu o número máximo de 5 tentativas de login, dentro do intervalo de 15 minutos."
          );
          setDisabled(true);
          let timeLeft = 900;
          const timer = setInterval(() => {
            timeLeft -= 1;
            setRemainingTime(timeLeft);
            if (timeLeft <= 0) {
              clearInterval(timer);
              setDisabled(false);
              setLoginAttempts(0);
              setRemainingTime(0);
            }
          }, 1000);
        }
      });
  };

  useEffect(() => {
    if (disabled) {
      setRemainingTime(900);
    }
  }, [disabled]);

  const changeUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevState) => ({ ...prevState, [name]: value }));
  };

  if (auth.isLogged) return null;

  return (
    <div className="h-screen bg-careDarkBlue">
      <div className="hidden xl:block">
        <div className="fixed z-20 w-60 h-[7%] right-0 bottom-[40%] bg-[#007cc4]"></div>
        <div className="fixed z-20 w-60 h-[7%] right-0 bottom-[30%] bg-[#007cc4]"></div>
        <div className="fixed z-20 w-60 h-[7%] right-0 bottom-[20%] bg-[#007cc4]"></div>
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
      <div className="hidden xl:block">
        <Image
          fill
          alt="background"
          src="/svg/new-visioncare.svg"
          className="object-left-bottom object-cover"
          quality={100}
        />
      </div>
      <Card>
        <div className="flex justify-center items-center">
          <Image
            quality={100}
            width={400}
            height={300}
            src="/LoginProgramaMyACUVUE.png"
            alt="acuvue-login"
            className="w-[300px] xl:w-[300px] 2xl:w-[400px]"
          />
        </div>
        <div className="my-5 z-30 ">
          <span className="flex  text-careBlue text-sm opacity-70 xl:text-base 2xl:text-xl">
            Acesse com seu e-mail e senha abaixo:
          </span>
        </div>
        <div className="w-full flex flex-col gap-2 xl:gap-2 justify-end md:my-4 md:mb-0">
          <Input
            className="fill-careBlue h-12 md:h-16 xl:h-14 2xl:h-16"
            startIcon
            imageSrc="/communication-mail.png"
            fullWidth
            placeholder="E-mail"
            type="email"
            autoComplete="off"
            onChange={changeUserData}
            name="email"
            maxLength={100}
            disabled={loading}
            id="click_login_email"
            error={errorEmail}
            helperText={mensagem}
          />
          <Input
            className="fill-careBlue h-12 md:h-16 xl:h-14 2xl:h-16"
            startIcon
            endIcon
            imageSrc="/house-lock.png"
            fullWidth
            placeholder="Senha"
            type="password"
            autoComplete="off"
            onChange={changeUserData}
            name="password"
            disabled={loading}
            id="click_login_senha"
            error={errorPassword}
            helperText={mensagem}
          />
        </div>
        <div className="flex mt-3 justify-end text-sm md:text-base cursor-pointer hover:opacity-60 text-careLightBlue underline">
          <span
            id="click_login_esqueci-senha"
            onClick={() => router.push("/forgot-password")}
          >
            Esqueci minha senha
          </span>
        </div>
        <div className="w-full flex flex-col mt-8 gap-2 xl:gap-4 justify-end">
          <Button
            customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-3 2xl:py-5"
            label={
              disabled
                ? `Tente novamente em ${Math.floor(remainingTime / 60)}:${(
                    remainingTime % 60
                  )
                    .toString()
                    .padStart(2, "0")}`
                : "ACESSAR"
            }
            onClick={handleLogin}
            isLoading={loading}
            disabled={
              loading || !userData.email || !userData.password || disabled
            }
            id="click_login_acessar"
          />
          <Button
            customClass="bg-careBlue border-careBlue py-2 xl:py-3 2xl:py-5"
            label="VOLTAR"
            onClick={() => router.push("/")}
            id="click_login_voltar"
          />
        </div>
      </Card>
      <div className="hidden z-40 md:flex justify-end absolute bottom-24 right-[8.5rem]">
        <div className="text-white flex flex-col items-center text-sm">
          <span className="ml-3">
            Precisa de ajuda com acesso? Entre em contato nos canais: telefone{" "}
            <span className="text-careLightBlue">0800 400 5001</span>
          </span>

          <span className="ml-3">
            ou através do e-mail{" "}
            <span className="text-careLightBlue">
              programamyacuvue@suporteaopaciente.com.br
            </span>
          </span>
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
            className="text-white text-base underline hover:text-careLightBlue"
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
            className="text-white text-base underline hover:text-careLightBlue"
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

export default Login;
