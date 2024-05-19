/*
 * @Date: 2021-07-02 16:55:42
 * @Description:
 * @LastEditors: Aaron Su
 * @LastEditTime: 2023-04-24 22:01:46
 * @FilePath: /frontend_screen/src/App.tsx
 */
import { memo, FC } from "react";
import router from "@/router";
import { ConfigProvider } from "@nutui/nutui-react";
import { RouterProvider } from "react-router-dom";
import "./App.scss";

const darkTheme = {
  nutuiColorPrimary: "#0092d8",
  nutuiColorPrimaryStop1: "#0092d8",
  nutuiColorPrimaryStop2: "#0092d8",
  nutuiButtonPrimary: "#0092d8",
  nutuiNavbarBackground: "#FFF",
  nutuiNavbarMarginBottom: "0",
  nutuiNavbarBoxShadow: "0px 2px 5px 0px rgba(237, 238, 241, 1)",
  nutuiButtonPrimaryDisabled: "#99deff",
};

const App: FC = () => {
  return (
    <ConfigProvider theme={darkTheme}>
      <RouterProvider router={router} />
    </ConfigProvider>
  );
};

export default memo(App);
