
import UserHeader from "@/components/UserHeader";
import BalanceCard from "@/components/BalanceCard";
import PromoCard from "@/components/PromoCard";
import LoanStatusCard from "@/components/LoanStatusCard";
import TransactionItem from "@/components/TransactionItem";
import HelpButton from "@/components/HelpButton";
import BottomNav from "@/components/BottomNav";
import { Users, Banknote } from "lucide-react";

export default function Dashboard() {
  // Normalmente estos datos vendrían de una API o servicio
  const userData = {
    name: "Mahayli Adelia",
    availableBalance: 50.00,
    creditLine: 100.00,
    points: 0,
    maxPoints: 750,
    loan: {
      isUpToDate: true,
      daysLeft: 30,
      paymentDate: "Domingo 25 de Mayo",
      installment: "1 de 1",
      amount: 65.00
    },
    transactions: [
      {
        id: "tx1",
        type: "Préstamo Desembolsado",
        description: "Préstamo inicial",
        date: "Viernes 25 De Abril",
        amount: 50.00
      }
    ]
  };
  
  return (
    <div className="pb-20 bg-app-gray min-h-screen">
      <div className="container mx-auto max-w-md bg-white">
        <UserHeader userName={userData.name} />
        
        <div className="px-4 pb-6">
          <BalanceCard 
            availableBalance={userData.availableBalance}
            creditLine={userData.creditLine}
            points={userData.points}
            maxPoints={userData.maxPoints}
          />
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <PromoCard 
              icon={<Users size={24} />}
              title="¡Gana S/20 por cada amigo que invites!"
            />
            <PromoCard 
              icon={<Banknote size={24} />}
              title="¡Te devolvemos tus intereses y comisiones!"
            />
          </div>
          
          <LoanStatusCard 
            isUpToDate={userData.loan.isUpToDate}
            daysLeft={userData.loan.daysLeft}
            paymentDate={userData.loan.paymentDate}
            installment={userData.loan.installment}
            amount={userData.loan.amount}
          />
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
              Últimas transacciones
            </h2>
            
            {userData.transactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                id={tx.id}
                type={tx.type}
                description={tx.description}
                date={tx.date}
                amount={tx.amount}
              />
            ))}
          </div>
        </div>
        
        <HelpButton />
        <BottomNav />
      </div>
    </div>
  );
}
