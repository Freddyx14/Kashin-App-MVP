
import { Bell, HelpCircle } from "lucide-react";

interface UserHeaderProps {
  userName: string;
}

export default function UserHeader({ userName }: UserHeaderProps) {
  return (
    <div className="flex items-center justify-between w-full py-4 px-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-app-blue text-white flex items-center justify-center">
          {userName.charAt(0)}
        </div>
        <span className="font-medium text-gray-700">{userName}</span>
      </div>
      <div className="flex items-center gap-4">
        <button aria-label="Notificaciones">
          <Bell size={20} className="text-app-blue" />
        </button>
        <button aria-label="Centro de ayuda">
          <HelpCircle size={20} className="text-app-blue" />
        </button>
      </div>
    </div>
  );
}
