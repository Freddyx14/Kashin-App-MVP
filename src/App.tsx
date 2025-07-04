
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PaymentSelectionPage from "./pages/PaymentSelectionPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";
import CardPaymentPage from "./pages/CardPaymentPage";
import YapePaymentPage from "./pages/YapePaymentPage";
import BankTransferPage from "./pages/BankTransferPage";
import PaymentCodePage from "./pages/PaymentCodePage";
import AgentPaymentPage from "./pages/AgentPaymentPage";
import InvitePage from "./pages/InvitePage";
import RewardsPage from "./pages/RewardsPage";
import MorePage from "./pages/MorePage";
import ReceiptPage from "./pages/ReceiptPage";
import PaymentReceiptPage from "./pages/PaymentReceiptPage";
import RemindersPage from "./pages/RemindersPage";
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
      <AuthProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/welcome" element={<WelcomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/registro" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/comprobante/:id" element={
                <ProtectedRoute>
                  <ReceiptPage />
                </ProtectedRoute>
              } />
              <Route path="/comprobante-pago/:id" element={
                <ProtectedRoute>
                  <PaymentReceiptPage />
                </ProtectedRoute>
              } />
              <Route path="/recordatorios" element={
                <ProtectedRoute>
                  <RemindersPage />
                </ProtectedRoute>
              } />
              <Route path="/pagar" element={
                <ProtectedRoute>
                  <PaymentSelectionPage />
                </ProtectedRoute>
              } />
              <Route path="/pagar/exito" element={
                <ProtectedRoute>
                  <PaymentSuccessPage />
                </ProtectedRoute>
              } />
              <Route path="/pagar/tarjeta" element={
                <ProtectedRoute>
                  <CardPaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/pagar/yape" element={
                <ProtectedRoute>
                  <YapePaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/pagar/transferencia" element={
                <ProtectedRoute>
                  <BankTransferPage />
                </ProtectedRoute>
              } />
              <Route path="/pagar/codigo/:bankId" element={
                <ProtectedRoute>
                  <PaymentCodePage />
                </ProtectedRoute>
              } />
              <Route path="/pagar/agentes" element={
                <ProtectedRoute>
                  <AgentPaymentPage />
                </ProtectedRoute>
              } />
              <Route path="/customer-feedback" element={
                <ProtectedRoute>
                  <CustomerFeedback />
                </ProtectedRoute>
              } />
              <Route path="/invitar" element={
                <ProtectedRoute>
                  <InvitePage />
                </ProtectedRoute>
              } />
              <Route path="/recompensas" element={
                <ProtectedRoute>
                  <RewardsPage />
                </ProtectedRoute>
              } />
              <Route path="/mas" element={
                <ProtectedRoute>
                  <MorePage />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
