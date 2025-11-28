import React from "react";
import ContentCard from "../card/ContentCard";
import { useRouter } from "next/router";
import ContentCardPacient from "../card/ContentCardPacient";

const CardEcp = () => {
  const route = useRouter();
  return (
    <div className="md:pr-20">
      <div className="flex flex-col mb-5">
        <span className="text-lg text-careBlue">
          Aqui você pode verificar os agendamentos realizados, validar vouchers
          de clientes e atualizar os dias e horários disponíveis para consultas.
        </span>
      </div>
      <div className="grid md:grid-cols-1 gap-y-3 lg:grid-cols-2 gap-x-4 mb-3">
        <ContentCard
          id="button-agendamento"
          onButtonClick={() => route.push("/dashboard/scheduling-ecp")}
          svgIcon="/svg/banner1.svg"
          title="Verificar agendamentos"
          subtitle="Você pode controlar todos os dias e horários pretendidos por seus pacientes."
          buttonText="Verificar"
          textColor="text-white"
          bgColor="bg-[url('/svg/banner1.svg')] bg-cover bg-no-repeat bg-careDarkBlue bg-right"
          buttonColor="bg-careLightBlue"
          buttonBorderColor="border-careLightBlue"
        />

        <ContentCard
          id="button-agendar-adaptacao"
          onButtonClick={() => route.push("/dashboard/validate-voucher")}
          svgIcon="/svg/banner2.svg"
          title="Validar vouchers"
          subtitle="Aplique descontos ao seus clientes na compra de suas novas lentes."
          buttonText="Validar"
          textColor="text-white"
          bgColor="bg-[url('/svg/banner2.svg')] bg-cover bg-no-repeat bg-careDarkBlue bg-right"
          buttonColor="bg-careLightBlue"
          buttonBorderColor="border-careLightBlue"
        />
      </div>
      <div className="grid md:grid-cols-1 gap-y-3 lg:grid-cols-3 gap-x-4 mb-5 md:mb-5">
        <ContentCardPacient
          id="edit-shedule"
          cardLink="/dashboard/editscheduling"
          svgIcon="/svg/new-image-3.svg"
          title="Editar agenda"
          subtitle="Configue os dias e horários disponíveis para os agendamentos."
          buttonText="Editar"
          textColor="text-white"
          bgColor="bg-transparent"
          hasIcon
        />
      </div>
    </div>
  );
};

export default CardEcp;
