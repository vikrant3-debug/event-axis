import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { TicketValidationMethod, TicketValidationStatus } from "@/domain/domain";
import { Check, RefreshCw, X, QrCode, Keyboard, ShieldCheck } from "lucide-react";
import { validateTicket } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import NavBar from "@/components/nav-bar";

const DashboardValidateQrPage: React.FC = () => {
  const { token } = useAuth();
  const [isManual, setIsManual] = useState(false);
  const [data, setData] = useState<string | undefined>();
  const [manualInput, setManualInput] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [validationStatus, setValidationStatus] = useState<TicketValidationStatus | undefined>();

  const handleReset = () => {
    setIsManual(false);
    setData(undefined);
    setManualInput("");
    setError(undefined);
    setValidationStatus(undefined);
  };

  const handleError = (err: unknown) => {
    setError(err instanceof Error ? err.message : "An unknown error occurred");
  };

  const handleValidate = async (id: string, method: TicketValidationMethod) => {
    if (!token || !id.trim()) return;
    try {
      setError(undefined);
      setData(id);
      const response = await validateTicket(token, { id, method });
      setValidationStatus(response.status);
    } catch (err) {
      handleError(err);
    }
  };

  const isValid = validationStatus === TicketValidationStatus.VALID;
  const isInvalid = validationStatus === TicketValidationStatus.INVALID;

  return (
    <div className="min-h-screen bg-[#08080e] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@700;800;900&display=swap');`}</style>
      <NavBar />

      <div className="flex items-center justify-center px-4 py-10 min-h-[calc(100vh-64px)]">
        <div className="w-full max-w-sm">

          {/* Header */}
          <div className="text-center mb-7">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-2xl font-black" style={{ fontFamily: "'Syne', sans-serif" }}>Ticket Validator</h1>
            <p className="text-gray-500 text-sm mt-1">Scan or enter a ticket ID to validate entry</p>
          </div>

          {/* Mode toggle */}
          <div className="flex gap-2 mb-5 bg-white/5 p-1 rounded-xl">
            <button
              onClick={() => {
                setIsManual(false);
                setData(undefined);
                setManualInput("");
                setError(undefined);
                setValidationStatus(undefined);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                !isManual ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <QrCode className="w-4 h-4" /> Scan QR
            </button>
            <button
              onClick={() => {
                setIsManual(true);
                setData(undefined);
                setManualInput("");
                setError(undefined);
                setValidationStatus(undefined);
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                isManual ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Keyboard className="w-4 h-4" /> Manual Entry
            </button>
          </div>

          <div className="bg-[#111118] border border-white/8 rounded-2xl overflow-hidden">

            {!isManual ? (
              /* QR Scanner */
              <div className="relative">
                <Scanner
                  key={`scanner-${data}-${validationStatus}`}
                  onScan={(result) => {
                    if (result && !validationStatus) {
                      const qrCodeId = result[0].rawValue;
                      handleValidate(qrCodeId, TicketValidationMethod.QR_SCAN);
                    }
                  }}
                  onError={handleError}
                />
                {validationStatus && (
                  <div className={`absolute inset-0 flex flex-col items-center justify-center ${
                    isValid ? "bg-emerald-950/90" : "bg-red-950/90"
                  }`}>
                    <div className={`rounded-full p-5 mb-3 ${
                      isValid
                        ? "bg-emerald-500 shadow-2xl shadow-emerald-500/40"
                        : "bg-red-500 shadow-2xl shadow-red-500/40"
                    }`}>
                      {isValid ? <Check className="w-12 h-12 text-white" /> : <X className="w-12 h-12 text-white" />}
                    </div>
                    <p className={`text-lg font-black ${isValid ? "text-emerald-300" : "text-red-300"}`} style={{ fontFamily: "'Syne', sans-serif" }}>
                      {isValid ? "VALID TICKET" : "INVALID TICKET"}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* Manual Entry */
              <div className="p-5 space-y-3">
                <Input
                  className="bg-[#08080e] border-white/10 text-white placeholder-gray-600 focus:border-cyan-500/50 rounded-xl font-mono text-sm"
                  placeholder="Enter ticket UUID..."
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleValidate(manualInput, TicketValidationMethod.MANUAL)}
                />
                <Button
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold py-2.5 rounded-xl"
                  onClick={() => handleValidate(manualInput, TicketValidationMethod.MANUAL)}
                >
                  Validate Ticket
                </Button>
              </div>
            )}

            {/* Status / info area */}
            <div className="p-5 pt-0 space-y-3">
              {validationStatus && (
                <div className={`rounded-xl px-4 py-3 text-center font-bold text-sm ${
                  isValid
                    ? "bg-emerald-900/40 text-emerald-300 border border-emerald-800/50"
                    : "bg-red-900/40 text-red-300 border border-red-800/50"
                }`} style={{ fontFamily: "'Syne', sans-serif" }}>
                  {isValid ? "✓ Entry Allowed" : "✗ Entry Denied"}
                </div>
              )}

              {error && (
                <div className="bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {data && (
                <div className="bg-[#08080e] border border-white/5 rounded-xl px-4 py-3">
                  <p className="text-gray-600 text-xs mb-0.5">Scanned ID</p>
                  <p className="font-mono text-sm text-gray-400 truncate">{data}</p>
                </div>
              )}

              {(validationStatus || error || data) && (
                <button
                  onClick={handleReset}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/8 text-gray-500 hover:text-white hover:bg-white/5 text-sm transition-all"
                >
                  <RefreshCw className="w-4 h-4" /> {isManual ? "Clear" : "Reset Scanner"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;
