import React from "react";
import ContentCard from "../card/ContentCard";
import router, { useRouter } from "next/router";
import ContentCardAdmin from "../card/ContentCardAdmin";

const CardAdmin = () => {
  const route = useRouter();

  return (
    <div>
     
      
      <div className="flex flex-col mb-5">
        <span className="text-lg text-careBlue">
          Aqui você pode criar e ativar vouchers, além de gerenciar o cadastro de parceiros e pedidos de compra realizados.
          
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid md:grid-cols-2 mb-3 gap-4">
        <div>
          <ContentCard
            id="click_inicio_agendar"
            onButtonClick={() => route.push("/dashboard/voucher")}
            svgIcon="/svg/v-card.svg"
            title="Gerenciar Vouchers"
            subtitle="Ative vouchers e cadastre campanhas.​"
            buttonText="Gerenciar"
            textColor="text-white"
            bgColor="bg-[url('/svg/banner-perfil-admin-1.svg')] bg-cover bg-no-repeat bg-careDarkBlue bg-right"
            buttonColor="bg-careLightBlue"
            buttonBorderColor="border-careLightBlue"
          />
        </div>
        <div>
          <ContentCard
            id="click_inicio_resgatar"
           onButtonClick={() => route.push("/dashboard/register-partiner")}
            svgIcon="/svg/v-card.svg"
            title="Cadastrar parceiros"
            subtitle="Canal exclusivo para cadastros de parceiros J&J.​"
            buttonText="Cadastrar"
            margemTop
            textColor="text-white"
            bgColor="bg-[url('/svg/banner-perfil-admin-2.svg')] bg-cover bg-no-repeat bg-careDarkBlue bg-right"
            buttonColor="bg-careLightBlue"
            buttonBorderColor="border-careLightBlue"
          />
        </div>
      </div>
      
    </div>
    
  );
};

export default CardAdmin;
