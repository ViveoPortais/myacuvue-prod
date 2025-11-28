import React from "react";
import Image from "next/image";
import { Box, Typography } from "@mui/material";

const GuideDosAndDonts = () => {
  return (
    <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={4}>
      <Box flex={1}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Image src="/contactlensesgreen.png" alt="O que fazer" width={80} height={80} style={{ zIndex: 2 }}/>
          <Box
            bgcolor="#f2f9f4"
            px={2}
            py={1}
            ml={-2}
            sx={{
              borderTopRightRadius: "32px",
              borderBottomRightRadius: "32px",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                left: "-20px",
                top: 0,
                bottom: 0,
                width: 40,
                backgroundColor: "#f2f9f4",
                borderTopRightRadius: "50%",
                borderBottomRightRadius: "50%",
                zIndex: 0,
              },
            }}
          >
            <Typography variant="h6" fontWeight={600} color="#2e7d32" zIndex={1} ml={1} sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
              O que fazer
            </Typography>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          {[
            "Coloque suas lentes de contato antes de aplicar a maquiagem no rosto.",
            "Sempre lave bem as mãos e seque com uma toalha sem fiapos antes de manusear suas lentes.",
            "Utilize solução especial de limpeza para lentes de contato para higienizar suas lentes e o estojo.",
            "Consulte seu oftalmologista caso note vermelhidão, sensibilidade à luz, alteração na visão, ou sinta dor e desconforto.",
          ].map((text, index) => (
            <Box key={index} display="flex" alignItems="start" gap={1}>
              <Image src="/yesdo.png" alt="Check" width={32} height={32} />
              <Typography>{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box flex={1}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Image src="/contactlensesred.png" alt="O que não fazer" width={80} height={80} style={{ zIndex: 2 }}/>
          <Box
            bgcolor="#fdeeee"
            px={2}
            py={1}
            ml={-2}
            sx={{
              borderTopRightRadius: "32px",
              borderBottomRightRadius: "32px",
              position: "relative",
              "&::before": {
                content: '""',
                position: "absolute",
                left: "-20px",
                top: 0,
                bottom: 0,
                width: 40,
                backgroundColor: "#fdeeee",
                borderTopRightRadius: "50%",
                borderBottomRightRadius: "50%",
                zIndex: 0,
              },
            }}
          >
            <Typography variant="h6" fontWeight={600} color="#d32f2f" zIndex={1} ml={1} sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}>
              O que não fazer
            </Typography>
          </Box>
        </Box>
        
        <Box display="flex" flexDirection="column" gap={2}>
          {[
            "Não use suas lentes de contato por mais tempo do que o indicado pelo seu oftalmologista.",
            "Não durma enquanto estiver usando as lentes de contato, a não ser que seja recomendado pelo seu oftalmologista.",
            "Nunca use água da torneira para lavar suas lentes ou limpar seu estojo.",
          ].map((text, index) => (
            <Box key={index} display="flex" alignItems="start" gap={1}>
              <Image src="/nottodo.png" alt="X" width={32} height={32} />
              <Typography>{text}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default GuideDosAndDonts;
