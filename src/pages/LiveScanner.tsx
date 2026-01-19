import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, CameraOff, RefreshCw, Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskScore } from "@/components/detection/RiskScore";
import { analyzeQRData } from "@/lib/qrAnalyzer";
import { Html5Qrcode } from "html5-qrcode";

interface AnalysisResult {
  score: number;
  classification: "safe" | "suspicious" | "dangerous";
  findings: string[];
  url: string;
}

export default function LiveScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startScanner = async () => {
    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Avoid re-scanning the same code
          if (decodedText !== lastScanned) {
            setLastScanned(decodedText);
            const analysis = analyzeQRData(decodedText);
            setResult(analysis);
            
            // Play sound feedback based on result
            if (analysis.classification === "dangerous") {
              // Could add audio feedback here
            }
          }
        },
        () => {
          // QR code scanning failed (no QR in view)
        }
      );

      setIsScanning(true);
    } catch (err: any) {
      console.error("Scanner error:", err);
      setError(
        err.message?.includes("Permission")
          ? "Camera permission denied. Please allow camera access and try again."
          : "Failed to start camera. Please ensure your device has a camera."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current = null;
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
    }
    setIsScanning(false);
  };

  const reset = () => {
    setResult(null);
    setLastScanned(null);
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-gradient">Live</span> Scanner
          </h1>
          <p className="text-muted-foreground">
            Use your camera to scan QR codes in real-time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Scanner Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="glass rounded-2xl p-4 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  {isScanning ? (
                    <span className="flex items-center gap-2 text-success text-sm">
                      <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                      Camera Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-2 text-muted-foreground text-sm">
                      <span className="w-2 h-2 rounded-full bg-muted-foreground" />
                      Camera Off
                    </span>
                  )}
                </div>
                <Button
                  variant={isScanning ? "destructive" : "hero"}
                  size="sm"
                  onClick={isScanning ? stopScanner : startScanner}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isScanning ? (
                    <>
                      <CameraOff className="w-4 h-4" />
                      Stop
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4" />
                      Start Camera
                    </>
                  )}
                </Button>
              </div>

              {/* Camera View */}
              <div
                ref={containerRef}
                className="relative aspect-square bg-muted rounded-xl overflow-hidden"
              >
                <div id="qr-reader" className="w-full h-full" />
                
                {!isScanning && !isLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-4">
                      <Camera className="w-10 h-10 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Camera Not Active</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Click "Start Camera" to begin scanning QR codes
                    </p>
                    <Button onClick={startScanner} variant="hero">
                      <Camera className="w-4 h-4" />
                      Start Scanning
                    </Button>
                  </div>
                )}

                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <div className="text-center">
                      <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                      <p className="text-muted-foreground">Initializing camera...</p>
                    </div>
                  </div>
                )}

                {isScanning && (
                  <>
                    {/* Scanning overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                        <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary" />
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-primary/50 animate-scan" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Instructions */}
              <div className="mt-4 text-center text-sm text-muted-foreground">
                {isScanning
                  ? "Point your camera at a QR code"
                  : "Start the camera to scan QR codes"}
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          {/* Results Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <RiskScore
                    score={result.score}
                    classification={result.classification}
                    findings={result.findings}
                    url={result.url}
                  />
                  <Button
                    onClick={reset}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Scan Another Code
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="waiting"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass rounded-2xl p-8 text-center"
                >
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
                    <Shield className="w-10 h-10 text-muted-foreground animate-float" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                    Waiting for QR Code
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {isScanning
                      ? "Point your camera at a QR code to analyze it"
                      : "Start the camera to begin scanning"}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
