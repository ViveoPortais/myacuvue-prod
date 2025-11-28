import React from "react";
import ContentCard from "../card/ContentCard";
import { useRouter } from "next/router";
import ContentCardPacient from "../card/ContentCardPacient";

const CardPacient = () => {
  const route = useRouter();
  return (
    <div className="md:pr-20">
      <div className="flex flex-col mb-5">
        <span className="text-lg text-careBlue">
          Aqui você pode agendar sua adaptação, resgatar vouchers de desconto
          exclusivos para a compra de suas lentes, além de tirar dúvidas e
          acessar dicas para aproveitar ao máximo sua jornada com ACUVUE
          <span style={{ verticalAlign: "super", fontSize: "0.6em" }}>®</span>
          <span>.</span>
        </span>

        <span className="text-base text-careLightBlue">
          Lembre-se que é imprescindível uma receita oftalmológica válida,
          emitida nos últimos 12 meses.
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid md:grid-cols-2 mb-3 gap-4">
        <div>
          <ContentCard
            id="click_inicio_agendar"
            onButtonClick={() => route.push("/dashboard/scheduling")}
            svgIcon="/svg/v-card.svg"
            title="Agende sua adaptação"
            subtitle="Encontre a clínica oftalmológica mais próxima de você para realizar a adaptação das lentes."
            buttonText="Agendar"
            textColor="text-white"
            bgColor="bg-[url('/svg/bannerdestaque1.svg')] bg-cover bg-no-repeat bg-careDarkBlue bg-right"
            buttonColor="bg-careLightBlue"
            buttonBorderColor="border-careLightBlue"
          />
        </div>
        <div>
          <ContentCard
            id="click_inicio_resgatar"
            onButtonClick={() => route.push("/dashboard/patient-voucher")}
            svgIcon="/svg/v-card.svg"
            title="Meus Vouchers"
            subtitle="Obtenha descontos na compra de suas novas lentes de contato."
            buttonText="Resgatar"
            margemTop
            textColor="text-white"
            bgColor="bg-[url('/svg/bannerdestaque2.svg')] bg-cover bg-no-repeat bg-careDarkBlue bg-right"
            buttonColor="bg-careLightBlue"
            buttonBorderColor="border-careLightBlue"
          />
        </div>
      </div>
      <div className="grid md:grid-cols-1 gap-y-3 lg:grid-cols-3 gap-x-4 mb-3">
        <ContentCardPacient
          id="click_inicio_falar-especialista"
          cardLink="/dashboard/talk-to-specialist"
          svgIcon="/svg/new-image-2.svg"
          title="Fale com"
          titleTwo="um especialista"
          subtitle="Tire suas dúvidas com um Especialista ACUVUE"
          buttonText="Falar com especialista"
          textColor="text-white"
          bgColor="bg-transparent"
          hasIcon
          showTrademark
        />
        <ContentCardPacient
          id="click_inicio_guia-do-usuario"
          cardLink="/dashboard/user-guide"
          svgIcon="/svg/new-image-1.svg"
          title="Guia do usuário"
          subtitle="Veja dicas sobre o uso, os cuidados, o descarte e a troca das lentes de contato."
          buttonText="Ver mais"
          textColor="text-white"
          bgColor="bg-transparent"
          hasIcon
        />
        <ContentCardPacient
          id="click_inicio_encontre-aqui"
          cardLink="https://www.acuvue.com.br/guia-de-compra/onde-comprar-lentes-de-contato"
          svgIcon="/svg/new-image-3.svg"
          title="Onde encontrar?"
          subtitle="Encontre os pontos de venda e clínicas oftalmológicas mais próximos."
          buttonText="Encontre aqui"
          textColor="text-white"
          bgColor="bg-transparent"
          hasIcon
        />
      </div>
    </div>
  );
};

export default CardPacient;
