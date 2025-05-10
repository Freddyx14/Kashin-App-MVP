
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PaymentSelectionPage from "./pages/PaymentSelectionPage";
import PaymentDetailPage from "./pages/PaymentDetailPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import CardPaymentPage from "./pages/CardPaymentPage";
import YapePaymentPage from "./pages/YapePaymentPage";
import BankTransferPage from "./pages/BankTransferPage";
import PaymentCodePage from "./pages/PaymentCodePage";
import AgentPaymentPage from "./pages/AgentPaymentPage";
import InvitePage from "./pages/InvitePage";
import RewardsPage from "./pages/RewardsPage";
import MorePage from "./pages/MorePage";
import NotFound from "./pages/NotFound";
import WelcomePage from "./pages/WelcomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CustomerFeedback from "./pages/CustomerFeedback";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/pagar" element={<PaymentSelectionPage />} />
            <Route path="/pagar/metodo" element={<PaymentDetailPage />} />
            <Route path="/pagar/exito" element={<PaymentSuccessPage />} />
            <Route path="/pagar/tarjeta" element={<CardPaymentPage />} />
            <Route path="/pagar/yape" element={<YapePaymentPage />} />
            <Route path="/pagar/transferencia" element={<BankTransferPage />} />
            <Route path="/pagar/codigo/:bankId" element={<PaymentCodePage />} />
            <Route path="/pagar/agentes" element={<AgentPaymentPage />} />
            <Route path="/customer-feedback" element={<CustomerFeedback />} />
            <Route path="/invitar" element={<InvitePage />} />
            <Route path="/recompensas" element={<RewardsPage />} />
            <Route path="/mas" element={<MorePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
