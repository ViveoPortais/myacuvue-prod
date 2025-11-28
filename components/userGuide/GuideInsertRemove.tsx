import React from "react";
import Image from "next/image";
import { Box, Typography, Divider, useTheme } from "@mui/material";

const GuideInsertRemove = () => {
    const theme = useTheme();

    const ItemList = ({
        src,
        alt,
        text,
    }: {
        src: string;
        alt: string;
        text: string;
    }) => (
        <Box display="flex" gap={2} alignItems="center">
            <Image src={src} alt={alt} width={60} height={60} />
            <Typography>{text}</Typography>
        </Box>
    );

    return (
        <Box
            display="flex"
            gap={6}
            flexDirection={{ xs: "column", md: "row" }}
            justifyContent="space-between"
        >
            <Box flex={1}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Image src="/putlens.png" alt="Como colocar" width={80} height={80} style={{ zIndex: 2 }}/>
                    <Box
                        bgcolor="#f1ebf8"
                        px={2}
                        py={1}
                        ml={-2}
                        position="relative"
                        sx={{
                            borderTopRightRadius: "24px",
                            borderBottomRightRadius: "24px",
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: "-20px",
                                top: 0,
                                bottom: 0,
                                width: 40,
                                backgroundColor: "#f1ebf8",
                                borderTopRightRadius: "50%",
                                borderBottomRightRadius: "50%",
                                zIndex: 0,
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            color="#753bbd"
                            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                            zIndex={1}
                            ml={1}
                        >
                            Como colocar suas lentes de contato
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" gap={2} ml={1}>
                    <ItemList
                        src="/wash-hands.png"
                        alt="Lavar mãos"
                        text="Lave e seque suas mãos com uma toalha sem fiapos."
                    />

                    <ItemList
                        src="/inside-out.png"
                        alt="Lente do avesso"
                        text="Certifique-se de que a sua lente de contato não está do lado avesso."
                    />

                    <ItemList
                        src="/eye-opening-lens.png"
                        alt="Abrir olhos"
                        text="Puxe a pálpebra inferior para baixo e, com a outra mão, segure a sua pálpebra superior."
                    />

                    <ItemList
                        src="/eye-opening-lens2.png"
                        alt="Posicionar lente"
                        text="Posicione sua lente de contato no centro do olho, ou na parte branca logo abaixo da íris."
                    />

                    <ItemList
                        src="/eye-opening-lens3.png"
                        alt="Soltar pálpebras"
                        text="Solte lentamente as pálpebras e feche os olhos para que a lente se acomode."
                    />
                </Box>
            </Box>
            <Box flex={1}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Image src="/removelens.png" alt="Como retirar" width={80} height={80} style={{ zIndex: 2 }}/>
                    <Box
                        bgcolor="#fdebfb"
                        px={2}
                        py={1}
                        ml={-2}
                        position="relative"
                        sx={{
                            borderTopRightRadius: "24px",
                            borderBottomRightRadius: "24px",
                            "&::before": {
                                content: '""',
                                position: "absolute",
                                left: "-20px",
                                top: 0,
                                bottom: 0,
                                width: 40,
                                backgroundColor: "#fdebfb",
                                borderTopRightRadius: "50%",
                                borderBottomRightRadius: "50%",
                                zIndex: 0,
                            },
                        }}
                    >
                        <Typography
                            variant="h6"
                            fontWeight={600}
                            color="#a51890"
                            sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
                            zIndex={1}
                            ml={1}
                        >
                            Como retirar suas lentes de contato
                        </Typography>
                    </Box>
                </Box>
                <Box display="flex" flexDirection="column" gap={2} ml={1}>
                    <ItemList
                        src="/wash-hands.png"
                        alt="Lavar mãos"
                        text="Lave e seque suas mãos com uma toalha sem fiapos."
                    />

                    <ItemList
                        src="/removal-look-up.png"
                        alt="Olhar para cima"
                        text="Olhe para cima e puxe sua pálpebra inferior para baixo."
                    />

                    <ItemList
                        src="/remove-lens-lower.png"
                        alt="Deslizar lente"
                        text="Toque a borda inferior da lente e deslize-a para a parte inferior do olho."
                    />

                    <ItemList
                        src="/removal-lens-squeeze.png"
                        alt="Remover com dedos"
                        text="Delicadamente, use o polegar e o dedo indicador para remover a lente."
                    />

                    <ItemList
                        src="/lens-cleaning.png"
                        alt="Limpar lente"
                        text="Jogue fora as lentes descartáveis. Limpe e desinfete as reutilizáveis."
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default GuideInsertRemove;
