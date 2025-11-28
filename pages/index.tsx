import Button from "@/components/button/Button";
import Card from "@/components/card/Card";
import Modal from "@/components/modals/Modal";
import ModalCookie from "@/components/modals/ModalCookie";
import ModalCookieDefinitions from "@/components/modals/ModalCookieDefinitions";
import openModalCookie from "@/hooks/openModalCookie";
import useCookieConsent from "@/hooks/useCookieConsent";
import useLogin from "@/hooks/useLogin";
import { Switch } from "@mui/material";
import { set } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const auth = useLogin();

  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenCookie, setIsModalOpenCookie] = useState(false);
  const modalCookie = openModalCookie();
  const { isConsentGiven, acceptCookies } = useCookieConsent();
  const { rejectCookies } = useCookieConsent();
  const [definitionCookie, setDefinitionCookie] = useState(false);
  const [isCheckedSegmentação, setIsCheckedSegmentação] = useState(false);
  const [isCheckedDesempenho, setIsCheckedDesempenho] = useState(false);

  useEffect(() => {
    if (isConsentGiven === false) {
      setIsModalOpenCookie(true);
    }
  }, [isConsentGiven]);

  const handLogin = () => {
    setLoading(true);
    router.push("/login");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAcceptTerms = () => {
    setIsModalOpen(false);
    router.push("/signup");
  };

  const handlweAcceptCookie = () => {
    acceptCookies();

    document.cookie = `cookie_segmentacao=true; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;
    document.cookie = `cookie_desempenho=true; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;

    setIsCheckedSegmentação(true);
    setIsCheckedDesempenho(true);
    setIsModalOpenCookie(false);
    setDefinitionCookie(false);
  };

  const handleRejectCookies = () => {
    rejectCookies();

    document.cookie = `cookie_segmentacao=false; path=/; max-age=0`;
    document.cookie = `cookie_desempenho=false; path=/; max-age=0`;

    setIsModalOpenCookie(false);
    setDefinitionCookie(false);
  };

  const handleOpenDefinitionCookie = () => {
    setDefinitionCookie(true);
  };

  const handleConfirmeMinhaEscolha = () => {
    document.cookie = `cookie_segmentacao=${isCheckedSegmentação}; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;
    document.cookie = `cookie_desempenho=${isCheckedDesempenho}; path=/; max-age=${
      60 * 60 * 24 * 365
    }`;

    setIsModalOpenCookie(false);
    setDefinitionCookie(false);
    acceptCookies();
  };

  useEffect(() => {
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
    };

    const segmentacao = getCookie("cookie_segmentacao");
    const desempenho = getCookie("cookie_desempenho");

    if (segmentacao !== undefined) {
      setIsCheckedSegmentação(segmentacao === "true");
    }

    if (desempenho !== undefined) {
      setIsCheckedDesempenho(desempenho === "true");
    }
  }, []);

  if (auth.isLogged) return null;
  return (
    <main className="h-screen bg-careDarkBlue">
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
      <div>
        <span className="hidden z-40 md:block absolute top-10 left-5 md:top-16 md:left-2 rotate-90 text-white text-xs">
          2023PP10003
        </span>
      </div>
      <Image
        src="/LogoMyAcuvue.png"
        className="z-40 block md:hidden absolute top-10 left-5 md:top-5 md:left-7"
        alt="acuvue letter"
        width={220}
        height={50}
      />

      <div className="block md:hidden">
        <Image
          width={400}
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
            width={200}
            height={220}
            src="/logo.png"
            alt="acuvue-login"
            className="w-[120px] xl:w-[120px] 2xl:w-[180px]"
          />
        </div>
        <div className="mt-5 xl:mt-3 2xl:mt-5 flex flex-col gap-1 items-center">
          <span className="text-careBlue text-sm/none opacity-70 xl:text-sm/none 2xl:text-lg/none ">
            Sua experiência personalizada com as lentes
          </span>
          <span className="text-careBlue text-sm/none opacity-70 xl:text-sm/none 2xl:text-lg/none">
            de contato ACUVUE
            <span style={{ verticalAlign: "super", fontSize: "0.6em" }}>®</span>
            . Agende a adaptação
          </span>
          <span className="text-careBlue text-sm/none opacity-70 xl:text-sm/none 2xl:text-lg/none">
            e resgate vouchers de descontos exclusivos
          </span>
          <span className="text-careBlue text-sm/none opacity-70 xl:text-sm/none 2xl:text-lg/none">
            para a compra de suas lentes.
          </span>
        </div>
        <div className="flex justify-center xl:mb-7 mb-7 mt-12 lg:mt-10 z-40">
          <span className="text-careBlue text-sm/none opacity-70 xl:text-sm/none 2xl:text-xl/none">
            Acesse sua conta ou cadastre-se!
          </span>
        </div>
        <div className="w-full flex flex-col gap-2 xl:gap-2 justify-end">
          <Button
            id="click_home_login"
            customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-3 2xl:py-5"
            label="Login"
            onClick={handLogin}
          />
          <Button
            id="click_home_criar-conta"
            customClass="bg-careBlue border-careBlue py-2 xl:py-3 2xl:py-5"
            label="Criar conta"
            onClick={openModal}
            isLoading={loading}
            disabled={loading}
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
      {isModalOpen && (
        <Modal
          customClass="w-full  md:w-[50%] md:h-[70%]"
          isOpen={true}
          onClose={() => {}}
          isButtonDisabled={true}
          isCloseIconVisible={false}
        >
          <div className="flex justify-center text-careLightBlue text-base xl:text-4xl 2xl:text-5xl mb-8">
            <span>Aviso de Privacidade</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-xl">
              Para participar do Programa de benefícios MyACUVUE você precisa
              estar cadastrado em nosso site. Os dados pessoais que você
              fornecer voluntariamente serão utilizados para habilitar seu
              cadastro, oferecer os serviços disponíveis e enviar notificação
              necessárias sobre sua participação no Programa, conforme detalhado
              no Regulamento. Se você nos autorizar podemos também enviar
              informações sobre nossos produtos e serviços.
            </span>
            <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-xl">
              Seus dados serão compartilhados com parceiros externos que estão
              responsáveis pela operacionalização deste Programa e é possível
              que seus dados pessoais sejam transferidos para afiliadas da
              Johnson & Johnson em outras jurisdições fora do seu país de
              residência.
            </span>
            <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-xl">
              Procuramos utilizar medidas organizacionais, técnicas e
              administrativas desenvolvidas para proteger as informações
              pessoais sob o nosso controle e com nossos parceiros de negócio.
            </span>
            <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-xl">
              Por favor veja nossa{" "}
              <a
                href="/DOC2-Aviso e Politica de privacidade para aplicação_site_cookies essenciais.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Política de Privacidade
              </a>{" "}
              para saber os detalhes sobre o tratamento de seus dados pessoais.
            </span>
            <span className="text-careBlue text-sm opacity-70 xl:text-base 2xl:text-xl">
              Este programa é direcionado para maiores de 18 anos.
            </span>
          </div>
          <div className="flex justify-center mt-10 gap-2">
            <Button
              customClass="bg-careBlue border-careBlue py-2 xl:py-3 2xl:py-5 w-full"
              label="Recusar"
              onClick={closeModal}
              id="click_aviso_recusar"
            />
            <Button
              customClass="bg-careLightBlue border-careLightBlue py-2 xl:py-3 2xl:py-5 w-full"
              label="Aceitar"
              onClick={handleAcceptTerms}
              id="click_aviso_aceitar"
            />
          </div>
        </Modal>
      )}
      {isModalOpenCookie && (
        <ModalCookie
          customClass="w-full  md:w-[50%] md:h-[70%]"
          isOpen={true}
          onClose={() => {}}
          isButtonDisabled={true}
          isCloseIconVisible={false}
        >
          <div className="flex justify-start text-xl font-bold mb-4">
            <span>Valorizamos sua privacidade</span>
          </div>
          <div
            className="flex flex-col md:flex md:flex-row items-center
           gap-10"
          >
            <div className="md:w-[60%]">
              <span className="text-[14px]">
                Usamos cookies para permitir que o nosso site funcione
                corretamente, para personalizar conteúdo e anúncios, para
                proporcionar funcionalidades das redes sociais e para analisar o
                nosso tráfego. Poderemos partilhar dados com os nossos parceiros
                envolvidos no envio e/ou personalização de anúncios em outros
                sites, tal como explicado nas &quot;Definições de Cookies&quot;.
                Por favor clique em &quot;Aceitar&quot; caso concorde com a
                nossa utilização de cookies, em &quot;Definições de
                Cookies&quot; para gerir as suas preferências ou
                &quot;Rejeitar&quot; se apenas concorda com os cookies
                necessários
              </span>
            </div>

            <div className="w-[40%] flex flex-col md:flex md:flex-row items-center md:justify-center gap-2 md:gap-5 md:ml-16">
              <div>
                <span
                  onClick={handleOpenDefinitionCookie}
                  className="underline cursor-pointer text-blue-400 hover:opacity-80"
                >
                  Definições de cookies
                </span>
              </div>
              <div className="w-full md:w-40">
                <Button
                  customClass="bg-careBlue border-careBlue py-2 xl:py-3 2xl:py-3 rounded-none w-80 md:w-full"
                  label="Recusar"
                  onClick={handleRejectCookies}
                  id="click_cookie_recusar"
                />
              </div>
              <div className="w-full md:w-40">
                <Button
                  customClass="bg-careBlue border-careBlue py-2 xl:py-3 2xl:py-3 rounded-none w-80 md:w-full"
                  label="Aceitar"
                  onClick={handlweAcceptCookie}
                  id="click_cookie_aceitar"
                />
              </div>
            </div>
          </div>
        </ModalCookie>
      )}

      {definitionCookie && (
        <ModalCookieDefinitions
          customClass="w-full  md:w-[30%]"
          isOpen={definitionCookie}
          onClose={() => {}}
          isButtonDisabled={true}
          isCloseIconVisible={false}
        >
          <div className="overflow-y-auto h-[80vh]">
            <div className="px-6 py-4">
              <div className="flex justify-start text-xl font-bold mb-2">
                <Image
                  src="/jnj.png"
                  alt="logo"
                  width={150}
                  height={100}
                  className="mb-4"
                />
              </div>
              <div className="flex flex-col gap-2 ">
                <h2 className="font-bold text-lg">
                  Centro de Preferências de Cookies
                </h2>
                <span className="text-sm">
                  Quando você visita qualquer site, ele pode armazenar ou
                  recuperar informações no seu navegador, principalmente na
                  forma de cookies. Essas informações podem ser sobre você, suas
                  preferências ou seu dispositivo e são usadas principalmente
                  para fazer o site funcionar conforme o esperado. As
                  informações geralmente não o identificam diretamente, mas
                  podem oferecer uma experiência na web mais personalizada. Como
                  respeitamos o seu direito à privacidade, você pode optar por
                  não permitir alguns tipos de cookies. Clique nos títulos das
                  diferentes categorias para saber mais e alterar nossas
                  configurações padrão. No entanto, o bloqueio de alguns tipos
                  de cookies pode afetar sua experiência no site e nos serviços
                  que podemos oferecer.
                </span>
                <Button
                  customClass="bg-careBlue border-careBlue py-2 xl:py-2 2xl:py-2 rounded-none w-40 mt-4"
                  label="Permitir todos"
                  onClick={handlweAcceptCookie}
                  id="click_cookie_definicoes_fechar"
                />
              </div>
              <div className="flex flex-col gap-3 mt-5">
                <h2 className="font-bold text-lg">
                  Gerenciar preferências de consentimento
                </h2>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">
                    Cookies estritamente necessários
                  </span>
                  <span className="text-sm text-careLightBlue">
                    Sempre ativos
                  </span>
                </div>
                <span className=" text-sm">
                  Esses cookies são necessários para o funcionamento do site e
                  não podem ser desativados em nossos sistemas. Geralmente, eles
                  são definidos apenas em resposta a ações feitas por você que
                  equivalem a uma solicitação de serviços, como definir suas
                  preferências de privacidade, fazer login ou preencher
                  formulários. Você pode configurar seu navegador para bloquear
                  ou alertá-lo sobre esses cookies, mas algumas partes do site
                  não funcionarão.
                </span>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">
                    Cookies de segmentação
                  </span>
                  <span className="text-sm text-careLightBlue">
                    <Switch
                      checked={isCheckedSegmentação}
                      onChange={(e) =>
                        setIsCheckedSegmentação(e.target.checked)
                      }
                      id="click_cookie_segmentacao"
                    />
                  </span>
                </div>
                <span className="text-black text-sm">
                  Esses cookies podem ser definidos através do nosso site por
                  nossos parceiros de publicidade. Eles podem ser usados por
                  essas empresas para criar um perfil de seus interesses e
                  mostrar anúncios relevantes em outros sites. Eles não
                  armazenam informações diretamente pessoais, mas baseiam-se na
                  identificação exclusiva do seu navegador e dispositivo de
                  Internet. Se você não permitir esses cookies, terá uma
                  publicidade menos direcionada
                </span>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">
                    Cookies de desempenho
                  </span>
                  <span className="text-sm text-careLightBlue">
                    <Switch
                      checked={isCheckedDesempenho}
                      onChange={(e) => setIsCheckedDesempenho(e.target.checked)}
                      id="click_cookie_desempenho"
                    />
                  </span>
                </div>
                <span className="text-black text-sm">
                  Esses cookies nos permitem contar visitas e fontes de tráfego
                  para que possamos medir e melhorar o desempenho do nosso site.
                  Eles nos ajudam a saber quais páginas são as mais e menos
                  populares e a ver como os visitantes se movem pelo site. Se
                  você não permitir esses cookies, não saberemos quando você
                  visitou o nosso site e não conseguiremos monitorar seu
                  desempenho.
                </span>
                <Button
                  customClass="bg-careBlue border-careBlue py-2 xl:py-2 2xl:py-2 rounded-none w-60 mt-4"
                  label="Confirmar minhas escolhas"
                  onClick={handleConfirmeMinhaEscolha}
                  id="click_cookie_definicoes_fechar"
                />
              </div>
            </div>
          </div>
        </ModalCookieDefinitions>
      )}
    </main>
  );
}
