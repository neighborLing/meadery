import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

window.onerror = function (message, source, lineno, colno, error) {
    console.log(`[错误信息]：`, {
        // 错误信息
        message,
        // 错误文件
        source,
        // 错误行号
        lineno,
        // 错误列号
        colno,
        // 错误堆栈
        error,
    });
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
