import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
// import reportWebVitals from './reportWebVitals'; // opsionale
import "./components/languageSwitcher/LanguageSwitcher.component"
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import DarkMode from 'components/darkMode/DarkMode.component';

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
});
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <DarkMode>
  <I18nextProvider i18n={i18next}>
      <App />
  </I18nextProvider>
  </DarkMode>
);
