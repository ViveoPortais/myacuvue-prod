import React, { useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";

const videos = [
  {
    title: "Colocando e retirando suas lentes de contato",
    src: "https://www.youtube.com/embed/jExYqU7siuk",
  },
  {
    title: "Troca e descarte correto das lentes de contato",
    src: "https://www.youtube.com/embed/MNICXkpUMdk",
  },
];

const VideoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box textAlign="center" width="100%">
      <Typography
        variant="h6"
        fontWeight={600}
        mb={2}
        color="primary"
        sx={{ fontSize: { xs: "1rem", md: "1.25rem" } }}
      >
        {videos[currentIndex].title}
      </Typography>

      <Box
        sx={{
          position: "relative",
          width: "100%",
          maxWidth: 800,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: "100%",
            paddingTop: "56.25%",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <iframe
            src={videos[currentIndex].src}
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: 0,
            }}
          />
        </Box>

        <IconButton
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            backgroundColor: "#fff",
            zIndex: 2,
            ":hover": { backgroundColor: "#eee" },
          }}
        >
          <MdChevronLeft />
        </IconButton>

        <IconButton
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            backgroundColor: "#fff",
            zIndex: 2,
            ":hover": { backgroundColor: "#eee" },
          }}
        >
          <MdChevronRight />
        </IconButton>
      </Box>

      <Box mt={{ xs: 3, md: 4 }} display="flex" justifyContent="center" gap={1}>
        {videos.map((_, idx) => (
          <Box
            key={idx}
            width={10}
            height={10}
            borderRadius="50%"
            bgcolor={idx === currentIndex ? "primary.main" : "#ccc"}
          />
        ))}
      </Box>
    </Box>
  );
};

export default VideoCarousel;
