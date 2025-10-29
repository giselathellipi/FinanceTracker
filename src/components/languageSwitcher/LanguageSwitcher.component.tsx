import React, { useState } from "react";
import { Box, Menu, MenuItem, Typography } from "@mui/material";
import i18n from "i18next";

const LanguageSwitcher = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleClose();
  };

  const languages = [
    { code: "en", label: "English" },
    { code: "al", label: "Albanian" },
  ];

  const currentLang = languages.find(lang => lang.code === i18n.language)?.label || "English";

  return (
    <Box>
      <Typography
        onClick={handleOpen}
        sx={{
          cursor: "pointer",
          color: "white",
          fontWeight: 400,
          px: 2,
          py: 0.5,
          border: "1px solid rgba(255,255,255,0.5)",
          borderRadius: 2,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.1)",
            transition: "0.2s",
          },
          userSelect: "none",
        }}
      >
        {currentLang}
      </Typography>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            selected={currentLang === lang.label}
          >
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default LanguageSwitcher;
