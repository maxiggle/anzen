import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Router from "./Router.tsx";
import "./assets/css/index.css";

import { XMTPProvider } from "@xmtp/react-sdk";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <XMTPProvider>
      <Router />
    </XMTPProvider>
  </StrictMode>
);
