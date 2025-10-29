import React, { useState } from "react";
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem, Box, Switch } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

//components
import { useTheme } from "components/darkMode/DarkMode.component";
import LanguageSwitcher from "components/languageSwitcher/LanguageSwitcher.component";

//json files
import translationEN from "components/languageSwitcher/en.json"
import translationAl from "components/languageSwitcher/al.json"

const resources = {
  en: {
    translation: translationEN,
  },
  al: {
    translation: translationAl,
  },

};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

const Navbar = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t } = useTranslation();

  const navigate=useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuItems = [
    { name: t("add_transaction"), path: "/" },
    { name: t("transactions"), path: "/transactionPage" },
  ];

  return (
    <AppBar position="static"  sx={{ backgroundColor: "#16324f" }}>
      <Toolbar>
        <Box sx={{ display: { xs: "flex", md: "none" }, flexGrow: 1 }}>
          <IconButton color="inherit" edge="start" onClick={handleMenu}>
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
              {menuItems.map((item) => (
              <MenuItem
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  handleClose();
                }}
              >
                {item.name}
              </MenuItem>
            ))}
          </Menu>
        </Box>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          FINANCE TRACKER
        </Typography>
         <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {menuItems.map((item) => (
            <Typography
              key={item.name}
              variant="button"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(item.path)}
            >
              {item.name}
            </Typography>
          ))}
        </Box>
          <Box>
          <Switch checked={darkMode} onChange={toggleDarkMode} />
        </Box>
       <LanguageSwitcher/>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
