import React from "react";
import useLogin from "@/hooks/useLogin";
import { showChats } from "../specialist/HuggyChat";
import { FiMessageCircle, FiPhoneCall, FiMail } from "react-icons/fi";
import Image from "next/image";
import ContentCardPacient from "../card/ContentCardPacient";

const Talkspecialist = () => {
  const login = useLogin();

  const handleButtonClick = () => {
    showChats();
  };

  return (
    <div className="fade-in">
      <div className="w-full mb-6">
        <div className="hidden md:block">
          <Image
            src="/svg/agendamento-banner.svg"
            alt="Fale com um especialista"
            width={1600}
            height={400}
            className="w-full h-auto rounded-3xl"
            priority
          />
        </div>

        <div className="block md:hidden">
          <Image
            src="/svg/agendamento-banner-mobile.svg"
            alt="Fale com um especialista"
            width={600}
            height={300}
            className="w-full h-auto rounded-3xl"
            priority
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <ContentCardPacient
          onButtonClick={handleButtonClick}
          title="Chat online"
          subtitle="Tire suas dúvidas com um especialista ACUVUE®."
          buttonText="ACESSAR"
          textColor="text-white"
          bgColor="bg-white"
          hasIcon
          id="acessar-chat"
          svgIcon={""}
        >
          <FiMessageCircle size={28} className="text-[#0071BC]" />
        </ContentCardPacient>
        <ContentCardPacient
          title="Telefone"
          subtitle="0800 400 5001"
          textphone="0800 400 5001"
          buttonText="LIGAR"
          textColor="text-white"
          bgColor="bg-white"
          cardLink="tel:08004005001"
          hasIcon
          svgIcon={""}
        >
          <FiPhoneCall size={28} className="text-[#0071BC]" />
        </ContentCardPacient>
        <ContentCardPacient
          title="E-mail"
          subtitle="programamyacuvue@suporteaopaciente.com.br"
          buttonText="ENVIAR"
          textColor="text-white"
          bgColor="bg-white"
          cardLink="mailto:programamyacuvue@suporteaopaciente.com.br"
          hasIcon
          svgIcon={""}
        >
          <FiMail size={28} className="text-[#0071BC]" />
        </ContentCardPacient>
      </div>
      <div className="flex justify-start mt-6">
        <span className="text-xs text-neutral-500 text-center">
          Horário de atendimento das 08h às 20h
        </span>
      </div>
    </div>
  );
};

export default Talkspecialist;
