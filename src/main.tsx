import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ConfigProvider } from "@nutui/nutui-react";
const darkTheme = {
  nutuiColorPrimary: "#0092d8",
  nutuiColorPrimaryStop1: "#0092d8",
  nutuiColorPrimaryStop2: "#0092d8",
};
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={darkTheme}>
      <App />
    </ConfigProvider>
  </React.StrictMode>
);
