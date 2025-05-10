
import { cn } from "@/lib/utils";

interface BankOptionProps {
  name: string;
  selected: boolean;
  onClick: () => void;
}

export default function BankOption({ name, selected, onClick }: BankOptionProps) {
  return (
    <button
      className={cn(
        "rounded-full px-6 py-2 font-medium",
        selected 
          ? "bg-app-turquoise text-white"
          : "bg-gray-200 text-gray-700"
      )}
      onClick={onClick}
    >
      {name}
    </button>
  );
}
