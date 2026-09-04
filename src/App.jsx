import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Box,
  ScanLine,
  Wifi,
  Lock,
  Unlock,
  X,
  QrCode,
  Sun,
  Moon,
} from "lucide-react";

import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLocked, setIsLocked] = useState(true);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const [theme, setTheme] = useState("dark");

  const streamRef = useRef(null);
  const videoRef = useRef(null);

  const isDark = theme === "dark";

  // ================= SCANNER =================

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const closeScanner = () => {
    stopScanner();
    setIsScanOpen(false);
    setScanMessage("");
  };

  const processScan = (value) => {
    const code = value.trim();

    if (!code) {
      setScanMessage("Please enter or scan a delivery code.");
      return;
    }

    setScanCode(code);
    setScanMessage(`Code scanned: ${code}`);

    stopScanner();

    // Successful scan unlocks Dropora
    setIsLocked(false);
  };

  const startScanner = async () => {
    setScanMessage("Starting camera...");

    try {
      stopScanner();

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setScanMessage(
          "Camera access is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

      streamRef.current = stream;

      if (!videoRef.current) {
        stream.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        return;
      }

      videoRef.current.srcObject = stream;

      await videoRef.current.play();

      setScanMessage(
        "Camera is ready. Point it at a QR code."
      );

      if ("BarcodeDetector" in window) {
        const detector = new BarcodeDetector({
          formats: ["qr_code"],
        });

        const scanFrame = async () => {
          if (!streamRef.current || !videoRef.current) {
            return;
          }

          try {
            const barcodes =
              await detector.detect(videoRef.current);

            if (
              barcodes.length > 0 &&
              barcodes[0].rawValue
            ) {
              processScan(barcodes[0].rawValue);
              return;
            }
          } catch (error) {
            console.error("QR detection error:", error);
          }

          requestAnimationFrame(scanFrame);
        };

        requestAnimationFrame(scanFrame);
      } else {
        setScanMessage(
          "Camera is working, but QR scanning is not supported in this browser. You can enter the code manually."
        );
      }
    } catch (error) {
      console.error("Camera error:", error);

      if (error.name === "NotAllowedError") {
        setScanMessage(
          "Camera permission was denied. Please allow camera access."
        );
      } else if (error.name === "NotFoundError") {
        setScanMessage(
          "No camera was found on this device."
        );
      } else {
        setScanMessage(
          "Unable to access the camera. Please allow camera permission and try again."
        );
      }

      stopScanner();
    }
  };

  useEffect(() => {
    if (!isScanOpen) return;

    const timer = setTimeout(() => {
      startScanner();
    }, 150);

    return () => {
      clearTimeout(timer);
      stopScanner();
    };
  }, [isScanOpen]);

  // ================= RENDER =================

  return (
    <div className={`app ${isDark ? "dark" : "light"}`}>

      {/* ================= HEADER ================= */}

      <header className="header">

        <div className="logo">
          DROPORA
        </div>

        <div className="header-controls">

          {/* Online */}

          <div className="online-status">
            <Wifi size={16} />
            <span>Online</span>
          </div>

          {/* Theme */}

          <button
            onClick={() =>
              setTheme(isDark ? "light" : "dark")
            }
            className="icon-button theme-button"
            title={
              isDark
                ? "Switch to Light Mode"
                : "Switch to Dark Mode"
            }
          >
            {isDark ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {/* Notifications */}

          <button className="icon-button notification-button">
            <Bell size={21} />

            <span className="notification-dot" />
          </button>

        </div>
      </header>

      {/* ================= ACTION CARDS ================= */}

      <section className="action-cards">

        {/* Receive Package */}

        <button className="receive-card">

          <div className="action-icon">
            <Box size={28} strokeWidth={1.8} />
          </div>

          <div>
            <p className="action-title">
              Receive Package
            </p>

            <p className="action-description">
              Open Dropora compartment
            </p>
          </div>

        </button>

        {/* Scan Delivery */}

        <button
          onClick={() => {
            setIsScanOpen(true);
            setScanMessage("");
          }}
          className="scan-card"
        >

          <div className="scan-icon">
            <ScanLine size={28} strokeWidth={1.7} />
          </div>

          <div>
            <p className="action-title">
              Scan Delivery Code
            </p>

            <p className="action-description">
              QR or manual entry
            </p>
          </div>

        </button>

      </section>

      {/* ================= MAIN DASHBOARD ================= */}

      <main className="dashboard">

        {/* ================= DROPORA LOCKER ================= */}

        <section className="locker-section">

          {/* Locker Header */}

          <div className="locker-header">

            <p className="locker-label">
              DROPORA
            </p>

            <div className="connected">
              <span className="connected-dot" />
              Connected
            </div>

          </div>

          {/* Locker Device */}

          <div className="locker-device">

            {/* Device Name */}

            <div className="device-name">

              <span>
                DROPORA LOCKER
              </span>

              <span className="device-dot" />

            </div>

            {/* Single Compartment */}

            <div
              className={`compartment ${
                isLocked
                  ? "compartment-locked"
                  : "compartment-unlocked"
              }`}
            >

              {/* Pattern */}

              <div className="compartment-pattern" />

              {/* Top */}

              <div className="compartment-top">

                <span>
                  DROPORA
                </span>

                {isLocked ? (
                  <Lock
                    size={25}
                    className="lock-green"
                    strokeWidth={1.6}
                  />
                ) : (
                  <Unlock
                    size={25}
                    className="lock-blue"
                    strokeWidth={1.6}
                  />
                )}

              </div>

              {/* Center */}

              <div className="compartment-center">

                <div
                  className={`lock-circle ${
                    isLocked
                      ? "lock-circle-green"
                      : "lock-circle-blue"
                  }`}
                >
                  {isLocked ? (
                    <Lock size={25} />
                  ) : (
                    <Unlock size={25} />
                  )}
                </div>

                <span
                  className={`status-pill ${
                    isLocked
                      ? "status-locked"
                      : "status-unlocked"
                  }`}
                >
                  {isLocked ? "Locked" : "Unlocked"}
                </span>

              </div>

              {/* Bottom */}

              <div className="compartment-bottom">

                <span>
                  Main Compartment
                </span>

                <span
                  className={`compartment-status-dot ${
                    isLocked
                      ? "status-dot-green"
                      : "status-dot-blue"
                  }`}
                />

              </div>

            </div>

            {/* Lock / Unlock */}

            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`locker-button ${
                isLocked
                  ? "unlock-button"
                  : "lock-button"
              }`}
            >

              {isLocked ? (
                <>
                  <Unlock size={18} />
                  Unlock Dropora
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Lock Dropora
                </>
              )}

            </button>

          </div>

        </section>

        {/* ================= RIGHT CONTENT ================= */}

        <section className="right-content">

          {/* Tabs */}

          <div className="tabs">

            {[
              "Overview",
              "Packages",
              "Notifications",
            ].map((item) => (

              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`tab ${
                  activeTab === item
                    ? "active-tab"
                    : ""
                }`}
              >

                {item}

                {item === "Notifications" && (
                  <span className="notification-count">
                    2
                  </span>
                )}

              </button>

            ))}

          </div>

          {/* ================= OVERVIEW ================= */}

          {activeTab === "Overview" && (
            <>

              {/* Stat Cards */}

              <div className="stat-grid">

                <StatCard
                  value="1"
                  label="Received"
                  valueColor="blue"
                  isDark={isDark}
                />

                <StatCard
                  value="1"
                  label="Collected"
                  valueColor="green"
                  isDark={isDark}
                />

                <StatCard
                  value={isLocked ? "Locked" : "Open"}
                  label="Locker Status"
                  valueColor={
                    isLocked ? "green" : "blue"
                  }
                  isDark={isDark}
                />

              </div>

              {/* Dropora Status */}

              <div className="status-card">

                <div className="status-header">

                  <h2>
                    Dropora Compartment
                  </h2>

                  <div
                    className={`locker-status ${
                      isLocked
                        ? "green-text"
                        : "blue-text"
                    }`}
                  >

                    {isLocked ? (
                      <Lock size={16} />
                    ) : (
                      <Unlock size={16} />
                    )}

                    {isLocked
                      ? "Locked"
                      : "Unlocked"}

                  </div>

                </div>

                {/* Package Information */}

                <div className="info-grid">

                  <InfoCard
                    title="PACKAGE ID"
                    value="PKG-4821"
                    isDark={isDark}
                  />

                  <InfoCard
                    title="SENDER"
                    value="Apple Store"
                    isDark={isDark}
                  />

                  <InfoCard
                    title="ARRIVED"
                    value="Today, 2:34 PM"
                    isDark={isDark}
                  />

                  <InfoCard
                    title="WEIGHT"
                    value="1.2 kg"
                    isDark={isDark}
                  />

                </div>

              </div>

            </>
          )}

          {/* ================= PACKAGES ================= */}

          {activeTab === "Packages" && (
            <EmptyState
              icon={<Box size={42} />}
              title="Your Packages"
              description="1 package is currently registered in Dropora."
              isDark={isDark}
            />
          )}

          {/* ================= NOTIFICATIONS ================= */}

          {activeTab === "Notifications" && (
            <EmptyState
              icon={<Bell size={42} />}
              title="Notifications"
              description="You have 2 unread notifications."
              isDark={isDark}
            />
          )}

        </section>

      </main>

      {/* ================= QR SCANNER ================= */}

      {isScanOpen && (
        <div className="scanner-overlay">

          <div className="scanner-modal">

            {/* Scanner Header */}

            <div className="scanner-header">

              <div>
                <p className="scanner-small-title">
                  DROPORA
                </p>

                <h2>
                  Scan Delivery Code
                </h2>
              </div>

              <button
                onClick={closeScanner}
                className="close-button"
                aria-label="Close scanner"
              >
                <X size={19} />
              </button>

            </div>

            {/* Camera */}

            <div className="camera-container">

              <video
                ref={videoRef}
                className="camera"
                muted
                playsInline
              />

              <div className="scanner-frame">
                <div className="scanner-box" />
              </div>

              <div className="camera-instruction">
                Point the camera at a QR code
              </div>

            </div>

            {/* Scan Message */}

            {scanMessage && (
              <div className="scan-message">
                {scanMessage}
              </div>
            )}

            {/* Successful Code */}

            {scanCode && (
              <div className="successful-code">
                Delivery code:{" "}
                <span>
                  {scanCode}
                </span>
              </div>
            )}

            {/* Divider */}

            <div className="manual-divider">

              <span />

              OR ENTER CODE MANUALLY

              <span />

            </div>

            {/* Manual Input */}

            <div className="manual-input">

              <input
                value={scanCode}
                onChange={(e) =>
                  setScanCode(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    processScan(scanCode);
                  }
                }}
                placeholder="e.g. PKG-4821"
              />

              <button
                onClick={() =>
                  processScan(scanCode)
                }
                className="scan-button"
              >
                <QrCode size={17} />
                Scan
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}


/* ================= STAT CARD ================= */

function StatCard({
  value,
  label,
  valueColor,
  isDark,
}) {
  return (
    <div className="stat-card">

      <span
        className={`stat-value ${
          valueColor === "blue"
            ? "blue-text"
            : "green-text"
        }`}
      >
        {value}
      </span>

      <span className="stat-label">
        {label}
      </span>

    </div>
  );
}


/* ================= INFO CARD ================= */

function InfoCard({
  title,
  value,
  isDark,
}) {
  return (
    <div className="info-card">

      <p className="info-title">
        {title}
      </p>

      <p className="info-value">
        {value}
      </p>

    </div>
  );
}


/* ================= EMPTY STATE ================= */

function EmptyState({
  icon,
  title,
  description,
  isDark,
}) {
  return (
    <div className="empty-state">

      <div className="empty-icon">
        {icon}
      </div>

      <h2>
        {title}
      </h2>

      <p>
        {description}
      </p>

    </div>
  );
}


export default App;