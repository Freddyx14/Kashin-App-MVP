
import { Upload } from "lucide-react";

export default function UploadReceiptButton() {
  return (
    <div className="border border-dashed border-app-blue rounded-lg p-4 flex flex-col items-center justify-center">
      <div className="bg-app-light-blue p-3 rounded-full">
        <Upload size={20} className="text-app-blue" />
      </div>
      <p className="text-app-blue mt-2 text-center">
        Subir comprobante<br/>o tomar foto
      </p>
    </div>
  );
}
