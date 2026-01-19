import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image, Loader2, RefreshCw, AlertCircle, FileImage } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RiskScore } from "@/components/detection/RiskScore";
import { analyzeQRData } from "@/lib/qrAnalyzer";
import QrcodeDecoder from "qrcode-decoder";

interface AnalysisResult {
  score: number;
  classification: "safe" | "suspicious" | "dangerous";
  findings: string[];
  url: string;
}

export default function UploadQR() {
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const processImage = async (file: File) => {
    setError(null);
    setResult(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageData = e.target?.result as string;
      setUploadedImage(imageData);
      setIsAnalyzing(true);

      try {
        // Decode QR code
        const qr = new QrcodeDecoder();
        const decoded = await qr.decodeFromImage(imageData);
        
        if (decoded && decoded.data) {
          // Analyze the QR data
          const analysis = analyzeQRData(decoded.data);
          setResult(analysis);
        } else {
          setError("No QR code detected in the image. Please upload a clear image of a QR code.");
        }
      } catch (err) {
        console.error("QR decode error:", err);
        setError("Failed to decode QR code. Please ensure the image contains a valid QR code.");
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      processImage(file);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImage(file);
    }
  };

  const reset = () => {
    setUploadedImage(null);
    setResult(null);
    setError(null);
  };

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
            <span className="text-gradient">Upload</span> QR Code
          </h1>
          <p className="text-muted-foreground">
            Upload an image containing a QR code to analyze it for potential threats
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Area */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative glass rounded-2xl p-8 border-2 border-dashed transition-all ${
                isDragging
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="text-center py-12">
                <motion.div
                  animate={{ scale: isDragging ? 1.1 : 1 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center"
                >
                  <Upload className="w-10 h-10 text-primary-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2">
                  Drop your QR code image here
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  or click to browse files
                </p>
                <p className="text-xs text-muted-foreground">
                  Supports: PNG, JPG, JPEG, GIF, WebP
                </p>
              </div>
            </div>

            {/* Uploaded Image Preview */}
            <AnimatePresence>
              {uploadedImage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-6"
                >
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <FileImage className="w-5 h-5 text-primary" />
                      <span className="font-medium">Uploaded Image</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={reset}
                        className="ml-auto"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        New Scan
                      </Button>
                    </div>
                    <div className="relative aspect-square max-w-[200px] mx-auto overflow-hidden rounded-xl bg-muted">
                      <img
                        src={uploadedImage}
                        alt="Uploaded QR Code"
                        className="w-full h-full object-contain"
                      />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                          <div className="h-full w-1 bg-primary/50 animate-scan" />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Results Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isAnalyzing && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass rounded-2xl p-8 text-center"
                >
                  <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
                  <h3 className="text-xl font-semibold mb-2">Analyzing QR Code</h3>
                  <p className="text-muted-foreground text-sm">
                    Running ML-based threat detection...
                  </p>
                </motion.div>
              )}

              {error && !isAnalyzing && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass rounded-2xl p-8"
                >
                  <div className="flex items-center gap-3 text-destructive mb-4">
                    <AlertCircle className="w-6 h-6" />
                    <h3 className="text-xl font-semibold">Detection Error</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={reset} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </Button>
                </motion.div>
              )}

              {result && !isAnalyzing && (
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
                </motion.div>
              )}

              {!uploadedImage && !isAnalyzing && !result && !error && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="glass rounded-2xl p-8 text-center"
                >
                  <Image className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2 text-muted-foreground">
                    No Image Uploaded
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Upload a QR code image to see the analysis results here
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
