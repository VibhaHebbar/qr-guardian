import { motion } from "framer-motion";
import { Shield, ShieldAlert, ShieldCheck, ShieldX, AlertTriangle, CheckCircle, XCircle, Info } from "lucide-react";

interface RiskScoreProps {
  score: number;
  classification: "safe" | "suspicious" | "dangerous";
  findings: string[];
  url?: string;
}

export function RiskScore({ score, classification, findings, url }: RiskScoreProps) {
  const getScoreColor = () => {
    if (score <= 3) return "text-threat-safe";
    if (score <= 5) return "text-threat-medium";
    if (score <= 7) return "text-threat-high";
    return "text-threat-critical";
  };

  const getGradient = () => {
    if (score <= 3) return "from-green-500 to-emerald-500";
    if (score <= 5) return "from-yellow-500 to-amber-500";
    if (score <= 7) return "from-orange-500 to-red-500";
    return "from-red-500 to-rose-600";
  };

  const getIcon = () => {
    if (score <= 3) return <ShieldCheck className="w-12 h-12" />;
    if (score <= 5) return <Shield className="w-12 h-12" />;
    if (score <= 7) return <ShieldAlert className="w-12 h-12" />;
    return <ShieldX className="w-12 h-12" />;
  };

  const getBgGlow = () => {
    if (score <= 3) return "bg-green-500/20";
    if (score <= 5) return "bg-yellow-500/20";
    if (score <= 7) return "bg-orange-500/20";
    return "bg-red-500/20";
  };

  const getClassificationLabel = () => {
    switch (classification) {
      case "safe":
        return { label: "Safe", icon: CheckCircle, color: "text-threat-safe bg-threat-safe/10" };
      case "suspicious":
        return { label: "Suspicious", icon: AlertTriangle, color: "text-threat-medium bg-threat-medium/10" };
      case "dangerous":
        return { label: "Dangerous", icon: XCircle, color: "text-threat-critical bg-threat-critical/10" };
    }
  };

  const classificationInfo = getClassificationLabel();
  const ClassificationIcon = classificationInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6 space-y-6"
    >
      {/* Score Circle */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`w-32 h-32 rounded-full ${getBgGlow()} flex items-center justify-center`}
          >
            <div className={`${getScoreColor()}`}>
              {getIcon()}
            </div>
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r ${getGradient()} text-white font-bold text-2xl px-4 py-1 rounded-full shadow-lg`}
          >
            {score}/10
          </motion.div>
        </div>

        {/* Classification Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full ${classificationInfo.color}`}
        >
          <ClassificationIcon className="w-5 h-5" />
          <span className="font-semibold">{classificationInfo.label}</span>
        </motion.div>
      </div>

      {/* URL */}
      {url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="bg-muted rounded-lg p-3"
        >
          <p className="text-xs text-muted-foreground mb-1">Extracted URL</p>
          <p className="text-sm font-mono break-all text-foreground">{url}</p>
        </motion.div>
      )}

      {/* Findings */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="space-y-3"
      >
        <h4 className="font-semibold flex items-center gap-2 text-foreground">
          <Info className="w-4 h-4 text-primary" />
          What we found
        </h4>
        <div className="space-y-2">
          {findings.map((finding, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 + index * 0.1 }}
              className="flex items-start gap-2 text-sm"
            >
              <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${score > 5 ? "text-threat-high" : "text-threat-medium"}`} />
              <span className="text-muted-foreground">{finding}</span>
            </motion.div>
          ))}
          {findings.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-threat-safe">
              <CheckCircle className="w-4 h-4" />
              <span>No suspicious indicators detected</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Recommendation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className={`rounded-lg p-4 ${
          classification === "safe"
            ? "bg-threat-safe/10 border border-threat-safe/20"
            : classification === "suspicious"
            ? "bg-threat-medium/10 border border-threat-medium/20"
            : "bg-threat-critical/10 border border-threat-critical/20"
        }`}
      >
        <p className="text-sm">
          {classification === "safe" && "✅ This QR code appears to be safe. However, always verify the destination before entering sensitive information."}
          {classification === "suspicious" && "⚠️ This QR code shows some suspicious patterns. Proceed with caution and avoid entering personal information."}
          {classification === "dangerous" && "🚫 This QR code is likely malicious. Do NOT visit this URL or enter any information."}
        </p>
      </motion.div>
    </motion.div>
  );
}
