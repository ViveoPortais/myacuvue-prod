import React from "react";
import Image from "next/image";
import { Box, Typography, Divider } from "@mui/material";

const StepItem = ({
    step,
    text,
}: {
    step: number;
    text: string;
}) => (
    <Box display="flex" alignItems="center" gap={2}>
        <Box
            sx={{
                bgcolor: "primary.main",
                color: "white",
                borderRadius: "50%",
                width: { xs: 32, md: 36 },
                height: { xs: 32, md: 36 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: { xs: "0.875rem", md: "1rem" },
                lineHeight: 1,
                flexShrink: 0,
            }}
        >
            {step}
        </Box>
        <Typography>{text}</Typography>
    </Box>
);

const GuideStorage = () => {
    return (
        <Box display="flex" flexDirection="column" gap={6} alignItems="center">
            <Box display="flex" flexDirection="column" width="100%" maxWidth="800px">
                <Box display="flex" alignItems="center" gap={2} mb={2}>

                    <Image
                        src="/wash-hands(1).png"
                        alt="Lavar mãos"
                        width={80}
                        height={80}
                    />

                    <Image
                        src="/clean-contacts(1).png"
                        alt="Limpar lentes"
                        width={80}
                        height={80}
                        style={{ zIndex: 2 }}
                    />

                    <Box
                        bgcolor="#e9f4f6"
                        px={2}
                        py={1}
                        display="flex"
                        alignItems="center"
                        ml={-2}
                        position="relative"
                        sx={{
                            borderTopRightRadius: "24px",
                            borderBottomRightRadius: "24px",
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: "-30px",
                                top: 0,
                                bottom: 0,
                                width: 50,
                                backgroundColor: "#e9f4f6",
                                borderTopRightRadius: "50%",
                                borderBottomRightRadius: "50%",
                                zIndex: 0,
                            },
                        }}
                    >
                        <Typography variant="h6" color="#01575c" fontWeight={600} zIndex={1} ml={1} sx={{ fontSize: { xs: "0.80rem", md: "1.25rem" } }}>
                            Como higienizar e armazenar lentes de contato reutilizáveis
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={2}>
                    <StepItem step={1} text="Coloque três ou mais gotas de solução para limpeza em um lado da lente de contato." />
                    <StepItem step={2} text="Esfregue delicadamente do centro para as extremidades. Vire e repita o processo." />
                    <StepItem step={3} text="Limpe cada lado por, pelo menos, cinco segundos." />
                    <StepItem step={4} text="Coloque as lentes limpas dentro do seu estojo e feche firmemente. Deixe-as desinfetando por, no mínimo, seis horas antes de usar novamente." />
                </Box>
            </Box>

            <Divider style={{ width: "100%", maxWidth: 800 }} />

            <Box display="flex" flexDirection="column" width="100%" maxWidth="800px">
                <Box display="flex" alignItems="center" gap={2} mb={2}>

                    <Image
                        src="/lens-case(1).png"
                        alt="Estojo de lente"
                        width={80}
                        height={80}
                    />

                    <Image
                        src="/take-out-begin-same-eye(1).png"
                        alt="Retirada correta"
                        width={80}
                        height={80}
                        style={{ zIndex: 2 }}
                    />

                    <Box
                        bgcolor="#fdf1ea"
                        px={2}
                        py={1}
                        display="inline-block"
                        alignItems="center"
                        ml={-2}
                        position="relative"
                        sx={{
                            borderTopRightRadius: "24px",
                            borderBottomRightRadius: "24px",
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0,
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: "-20px",
                                top: 0,
                                bottom: 0,
                                width: 40,
                                backgroundColor: "#fdf1ea",
                                borderTopRightRadius: "50%",
                                borderBottomRightRadius: "50%",
                                zIndex: 0,
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            color="#d15b17"
                            fontWeight={600}
                            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                            zIndex={1}
                            ml={1}
                        >
                            Como cuidar do estojo de lentes
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" gap={2}>
                    <StepItem step={1} text="Coloque três ou mais gotas de solução para limpeza em um lado da lente de contato." />
                    <StepItem step={2} text="Esfregue delicadamente do centro para as extremidades. Vire e repita o processo." />
                    <StepItem step={3} text="Limpe cada lado por pelo menos cinco segundos." />
                </Box>
            </Box>
        </Box>
    );
};

export default GuideStorage;
