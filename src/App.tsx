
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PaymentSelectionPage from "./pages/PaymentSelectionPage";
import PaymentDetailPage from "./pages/PaymentDetailPage";
import PaymentConfirmationPage from "./pages/PaymentConfirmationPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import InvitePage from "./pages/InvitePage";
import RewardsPage from "./pages/RewardsPage";
import MorePage from "./pages/MorePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pagar" element={<PaymentSelectionPage />} />
          <Route path="/pagar/metodo" element={<PaymentDetailPage />} />
          <Route path="/pagar/confirmacion" element={<PaymentConfirmationPage />} />
          <Route path="/pagar/exito" element={<PaymentSuccessPage />} />
          <Route path="/invitar" element={<InvitePage />} />
          <Route path="/recompensas" element={<RewardsPage />} />
          <Route path="/mas" element={<MorePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
