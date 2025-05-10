
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

interface BackButtonProps {
  title?: string;
}

export default function BackButton({ title = "" }: BackButtonProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-3 py-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center justify-center"
        aria-label="Volver"
      >
        <ChevronLeft size={24} />
      </button>
      {title && <h1 className="text-xl font-medium">{title}</h1>}
    </div>
  );
}
