import React, { useState } from "react";
import {
    Box,
    Typography,
    Button as MuiButton,
} from "@mui/material";
import { useRouter } from "next/router";
import useOpen from "@/hooks/useOpen";
import GuideInsertRemove from "@/components/userGuide/GuideInsertRemove";
import GuideStorage from "@/components/userGuide/GuideStorage";
import GuideDosAndDonts from "@/components/userGuide/GuideDosAndDonts";
import VideoCarousel from "@/components/userGuide/VideoCarousel";

const tabLabels = [
    "Vídeos",
    "Colocando e retirando as lentes",
    "Armazenamento e cuidados",
    "O que fazer e o que não fazer",
];

const UserGuideTabs = () => {
    const [activeTab, setActiveTab] = useState(0);
    const route = useRouter();
    const openGuides = useOpen();

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box className="fade-in">
            <Box
                className="fade-in"
                sx={{
                    width: '100%',
                    maxWidth: '100vw',
                    overflowX: 'hidden',
                    px: { xs: 2, md: 0 },
                }}
            >
                <Typography
                    variant="h6"
                    mb={3}
                    fontWeight={400}
                    sx={{
                        fontSize: { xs: "0.95rem", md: "1.1rem" },
                        width: "100%",
                        lineHeight: 1.6,
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                    }}
                >
                    Aqui você encontra todas as informações necessárias para a correta utilização e higienização das suas lentes de contato.
                    <br />
                    <Box
                        component="span"
                        sx={{
                            display: "inline",
                            color: "#1565c0",
                        }}
                    >
                        Se ainda ficar com dúvidas, você pode{" "}
                        <Box
                            component="span"
                            sx={{ textDecoration: "underline", fontWeight: 600, cursor: "pointer" }}
                            onClick={() => route.push("/dashboard/talk-to-specialist")}
                        >
                            falar com um especialista
                        </Box>{" "}
                        ou{" "}
                        <Box
                            component="span"
                            sx={{ textDecoration: "underline", fontWeight: 600, cursor: "pointer" }}
                            onClick={() => window.open("https://www.acuvue.com.br/", "_blank")}
                        >
                            acessar nosso site
                        </Box>.
                    </Box>
                </Typography>
            </Box>

            <Box
                sx={{
                    border: { xs: "none", md: "1px solid #84BDDF" },
                    borderRadius: 2,
                    p: { xs: 2, md: 3 },
                    backgroundColor: { xs: "transparent", md: "#fff" },
                    width: "100%",
                    maxWidth: { xs: "42%", md: "100%" },
                    boxSizing: "border-box",
                    overflowX: "hidden",
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        overflowX: "auto",
                        display: "flex",
                        justifyContent: { xs: "flex-start", md: "center" },
                        pb: 1,
                        mb: 3,
                    }}
                >
                    <Box
                        sx={{
                            display: "inline-flex",
                            gap: 2,
                            px: 2,
                        }}
                    >
                        {tabLabels.map((label, index) => (
                            <MuiButton
                                key={index}
                                onClick={() => setActiveTab(index)}
                                variant={activeTab === index ? "contained" : "outlined"}
                                color="primary"
                                sx={{
                                    borderRadius: 999,
                                    textTransform: "none",
                                    fontWeight: activeTab === index ? 700 : 500,
                                    fontSize: "0.9rem",
                                    px: 3,
                                    py: 1.5,
                                    whiteSpace: "nowrap",
                                    flexShrink: 0,
                                }}
                            >
                                {label}
                            </MuiButton>
                        ))}
                    </Box>
                </Box>

                <Box mt={3}>
                    {activeTab === 0 && (
                        <Box mt={4} px={{ xs: 2, md: 0 }}>
                            <VideoCarousel />
                        </Box>
                    )}

                    {activeTab === 1 && (
                        <Box mt={4} maxWidth="1200px" mx="auto">
                            <GuideInsertRemove />
                        </Box>
                    )}
                    {activeTab === 2 && (
                        <Box mt={4} maxWidth="1200px" mx="auto">
                            <GuideStorage />
                        </Box>
                    )}
                    {activeTab === 3 && (
                        <Box mt={4} maxWidth="1200px" mx="auto">
                            <GuideDosAndDonts />
                        </Box>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default UserGuideTabs;
