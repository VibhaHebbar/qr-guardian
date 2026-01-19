import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Shield, Upload, Camera, ChevronRight, Scan, AlertTriangle, Lock, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Scan,
    title: "ML-Powered Detection",
    description: "Advanced machine learning analyzes QR codes for phishing patterns, suspicious URLs, and known threat indicators.",
  },
  {
    icon: AlertTriangle,
    title: "Real-time Analysis",
    description: "Get instant risk scores from 1-10 with detailed explanations of what makes a QR code suspicious.",
  },
  {
    icon: Lock,
    title: "Explainable AI",
    description: "Understand exactly why a QR code was flagged - transparent security you can trust.",
  },
  {
    icon: Zap,
    title: "Multiple Input Methods",
    description: "Upload images or use your camera for live scanning - analyze QR codes however you prefer.",
  },
];

const stats = [
  { value: "99.2%", label: "Detection Accuracy" },
  { value: "50ms", label: "Analysis Time" },
  { value: "1M+", label: "Scans Protected" },
  { value: "24/7", label: "Protection" },
];

export default function Index() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                Advanced QR Security Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
            >
              Detect{" "}
              <span className="text-gradient">Quishing</span>{" "}
              <br className="hidden sm:block" />
              Before It's Too Late
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Our ML-powered platform analyzes QR codes in real-time, detecting phishing attempts, malicious URLs, and suspicious patterns before you click.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/upload">
                <Button variant="hero" size="xl" className="w-full sm:w-auto group">
                  <Upload className="w-5 h-5" />
                  Upload QR Code
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/scanner">
                <Button variant="glass" size="xl" className="w-full sm:w-auto">
                  <Camera className="w-5 h-5" />
                  Live Scanner
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Floating Shield Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
          >
            <div className="relative w-[600px] h-[600px]">
              <div className="absolute inset-0 gradient-primary opacity-10 rounded-full blur-3xl animate-pulse" />
              <Shield className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 text-primary/10" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How We <span className="text-gradient">Protect</span> You
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Advanced machine learning combined with real-time threat intelligence to keep you safe from QR code scams.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass rounded-2xl p-6 hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple <span className="text-gradient">3-Step</span> Process
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Scan or Upload", desc: "Use your camera or upload a QR code image" },
              { step: "02", title: "AI Analysis", desc: "Our ML model analyzes patterns and threats" },
              { step: "03", title: "Get Results", desc: "Receive risk score and detailed explanation" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center relative"
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
                {index < 2 && (
                  <ChevronRight className="hidden md:block absolute top-1/4 -right-4 w-8 h-8 text-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 gradient-primary opacity-5" />
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-6">
                <CheckCircle className="w-8 h-8 text-primary-foreground" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Stay Safe?
              </h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Start scanning QR codes now and protect yourself from phishing attacks. It's free and takes seconds.
              </p>
              <Link to="/scanner">
                <Button variant="hero" size="xl">
                  <Camera className="w-5 h-5" />
                  Start Scanning Now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-semibold text-gradient">Quishing Detector</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Quishing Detector. Protecting users from QR code scams.
          </p>
        </div>
      </footer>
    </div>
  );
}
