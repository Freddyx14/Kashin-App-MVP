
import { Card, CardContent } from "@/components/ui/card";

export default function ReceiptInfo() {
  return (
    <Card className="bg-blue-50">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-blue-600 text-sm">ℹ</span>
          </div>
          <div>
            <p className="text-sm text-blue-800 font-medium mb-1">
              Comprobante válido
            </p>
            <p className="text-sm text-blue-700">
              Este comprobante es válido y puede ser usado como constancia de tu transacción.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
