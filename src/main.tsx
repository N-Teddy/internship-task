import * as React from "react";
import './index.css'
import App from './App.tsx'
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>

        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
