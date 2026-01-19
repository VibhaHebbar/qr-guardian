// ML-based QR Code URL Analysis
// This simulates an ML model analyzing URLs for phishing indicators

interface AnalysisResult {
  score: number;
  classification: "safe" | "suspicious" | "dangerous";
  findings: string[];
  url: string;
}

// Feature extraction and analysis
export function analyzeURL(url: string): AnalysisResult {
  const findings: string[] = [];
  let riskScore = 0;

  try {
    const parsedUrl = new URL(url);
    
    // Check for IP address instead of domain
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipPattern.test(parsedUrl.hostname)) {
      findings.push("Uses IP address instead of domain name");
      riskScore += 3;
    }

    // Check for HTTPS
    if (parsedUrl.protocol !== "https:") {
      findings.push("No HTTPS encryption detected");
      riskScore += 2;
    }

    // Check for suspicious keywords in URL
    const suspiciousKeywords = [
      "login", "verify", "secure", "account", "update", "confirm",
      "banking", "paypal", "amazon", "apple", "microsoft", "google",
      "password", "credential", "suspend", "locked", "urgent",
      "free", "winner", "prize", "claim", "reward", "gift"
    ];
    
    const urlLower = url.toLowerCase();
    const foundKeywords = suspiciousKeywords.filter(kw => urlLower.includes(kw));
    if (foundKeywords.length > 0) {
      findings.push(`Suspicious keywords detected: ${foundKeywords.slice(0, 3).join(", ")}`);
      riskScore += Math.min(foundKeywords.length * 0.5, 2);
    }

    // Check for URL shorteners
    const shorteners = [
      "bit.ly", "tinyurl.com", "t.co", "goo.gl", "ow.ly", "is.gd",
      "buff.ly", "adf.ly", "shorte.st", "cutt.ly"
    ];
    if (shorteners.some(s => parsedUrl.hostname.includes(s))) {
      findings.push("URL shortener detected - destination hidden");
      riskScore += 2;
    }

    // Check for suspicious TLDs
    const suspiciousTLDs = [".tk", ".ml", ".ga", ".cf", ".gq", ".xyz", ".top", ".work", ".click"];
    if (suspiciousTLDs.some(tld => parsedUrl.hostname.endsWith(tld))) {
      findings.push("Suspicious top-level domain detected");
      riskScore += 1.5;
    }

    // Check for excessive subdomains (typosquatting technique)
    const subdomains = parsedUrl.hostname.split(".");
    if (subdomains.length > 4) {
      findings.push("Excessive subdomains detected (possible typosquatting)");
      riskScore += 1.5;
    }

    // Check for lookalike domains
    const lookalikes = [
      { real: "google", fakes: ["g00gle", "googIe", "gogle", "googel"] },
      { real: "amazon", fakes: ["amaz0n", "amazom", "arnazon"] },
      { real: "paypal", fakes: ["paypa1", "paypai", "pαypal"] },
      { real: "microsoft", fakes: ["micr0soft", "rnicrosoft", "mircosoft"] },
      { real: "apple", fakes: ["app1e", "appie", "ąpple"] },
    ];
    
    for (const brand of lookalikes) {
      if (brand.fakes.some(fake => urlLower.includes(fake))) {
        findings.push(`Possible brand impersonation detected (looks like ${brand.real})`);
        riskScore += 3;
        break;
      }
    }

    // Check for unusual port numbers
    if (parsedUrl.port && !["80", "443", ""].includes(parsedUrl.port)) {
      findings.push(`Unusual port number: ${parsedUrl.port}`);
      riskScore += 1;
    }

    // Check for data: or javascript: URLs
    if (url.startsWith("data:") || url.startsWith("javascript:")) {
      findings.push("Potentially malicious URL scheme detected");
      riskScore += 4;
    }

    // Check URL length (very long URLs can be suspicious)
    if (url.length > 200) {
      findings.push("Unusually long URL");
      riskScore += 0.5;
    }

    // Check for encoded characters abuse
    const encodedPattern = /%[0-9A-Fa-f]{2}/g;
    const encodedMatches = url.match(encodedPattern);
    if (encodedMatches && encodedMatches.length > 5) {
      findings.push("Excessive URL encoding detected");
      riskScore += 1;
    }

    // Check for @ symbol in URL (can be used for URL spoofing)
    if (url.includes("@") && !url.startsWith("mailto:")) {
      findings.push("Contains @ symbol (possible URL spoofing)");
      riskScore += 2;
    }

  } catch (error) {
    // Invalid URL
    findings.push("Invalid or malformed URL detected");
    riskScore += 3;
  }

  // Normalize score to 1-10
  const normalizedScore = Math.min(Math.max(Math.round(riskScore), 1), 10);

  // Determine classification
  let classification: "safe" | "suspicious" | "dangerous";
  if (normalizedScore <= 3) {
    classification = "safe";
  } else if (normalizedScore <= 6) {
    classification = "suspicious";
  } else {
    classification = "dangerous";
  }

  return {
    score: normalizedScore,
    classification,
    findings,
    url,
  };
}

// Decode QR code data and analyze
export function analyzeQRData(data: string): AnalysisResult {
  // Check if it's a URL
  if (data.startsWith("http://") || data.startsWith("https://") || data.startsWith("www.")) {
    const url = data.startsWith("www.") ? `https://${data}` : data;
    return analyzeURL(url);
  }

  // Check for other protocols
  if (data.includes("://")) {
    return analyzeURL(data);
  }

  // Non-URL data
  const findings: string[] = [];
  let riskScore = 1;

  // Check for potential phone numbers or SMS
  if (data.startsWith("tel:") || data.startsWith("sms:") || data.startsWith("SMSTO:")) {
    findings.push("Phone/SMS QR code - verify the number before calling");
    riskScore = 2;
  }

  // Check for email
  if (data.startsWith("mailto:")) {
    findings.push("Email QR code - verify sender before responding");
    riskScore = 2;
  }

  // Check for WiFi
  if (data.startsWith("WIFI:")) {
    findings.push("WiFi configuration QR - only connect to trusted networks");
    riskScore = 3;
  }

  // Check for vCard/contact
  if (data.includes("BEGIN:VCARD")) {
    findings.push("Contact card QR - verify contact information");
    riskScore = 2;
  }

  return {
    score: riskScore,
    classification: riskScore <= 3 ? "safe" : "suspicious",
    findings: findings.length > 0 ? findings : ["Plain text QR code - no URL detected"],
    url: data,
  };
}
