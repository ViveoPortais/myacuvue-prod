import React from "react";
import ContentCard from "../card/ContentCard";
import { useRouter } from "next/router";
import ContentCardPacient from "../card/ContentCardPacient";

const CardPdv = () => {
  const route = useRouter();
  return (
    <div>
      {/* <div className="grid md:grid-cols-1 gap-y-3 lg:grid-cols-2 gap-x-4 mb-3">
        <ContentCard
          onButtonClick={() => route.push("/dashboard/validate-voucher")}
          svgIcon="/svg/v-card.svg"
          title="Validar Voucher"
          subtitle="Validar os vouchers dos seus pacientes."
          buttonText="ver mais"
          textColor="text-white"
          buttonColor="bg-careDarkBlue"
          bgColor="bg-careLightBlue"
          buttonBorderColor="border-careDarkBlue"
          hasIcon
        />
        <ContentCard
          onButtonClick={() => route.push("/dashboard/reimbursement")}
          svgIcon="/card-terugbetaling.png"
          title="Reembolso​"
          subtitle="Saiba como obter reembolsos."
          buttonText="ver mais"
          textColor="text-white"
          buttonColor="bg-careDarkBlue"
          bgColor="bg-careLightBlue"
          buttonBorderColor="border-careDarkBlue"
          hasIcon
        />
      </div> */}
       <div className="md:pr-20">
      <div className="flex flex-col mb-5">
        <span className="text-lg text-careBlue">
          Aqui você pode validar vouchers de clientes, além de gerenciar vendas e reembolsos.
        </span>
      </div>
      <div className="grid md:grid-cols-1 gap-y-3 lg:grid-cols-2 gap-x-4 mb-3">
         <ContentCard
          id="button-voucher-pdv"
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
        <ContentCard
          id="button-gerenciar-vendas-pdv"
          onButtonClick={() => route.push("/dashboard/manage-sales")}
          svgIcon="/svg/banner1.svg"
          title="Gerenciar vendas"
          subtitle="Você terá acesso ao histórico de vendas e de resgate de vouchers."
          buttonText="Gerenciar"
          textColor="text-white"
          bgColor="bg-[url('/svg/banner-destaque-2.svg')] bg-cover bg-no-repeat bg-careDarkBlue bg-right"
          buttonColor="bg-careLightBlue"
          buttonBorderColor="border-careLightBlue"
        />    
      </div>
      <div className="grid md:grid-cols-1 gap-y-3 lg:grid-cols-3 gap-x-4 mb-5 md:mb-5">
        <ContentCardPacient
          id="edit-shedule"
          cardLink="/dashboard/editscheduling"
          svgIcon="/svg/new-image-1.svg"
          title="Reembolso"
          subtitle="Realize com vacilidade o processo de reembolso para os seus clientes."
          buttonText="Ver mais"
          textColor="text-white"
          bgColor="bg-transparent"
          hasIcon
        />
      </div>
    </div>
    </div>
  );
};

export default CardPdv;
