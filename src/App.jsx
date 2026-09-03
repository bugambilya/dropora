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

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLocked, setIsLocked] = useState(true);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [scanMessage, setScanMessage] = useState("");

  // ================= THEME =================
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

  // ================= COLORS =================

  const colors = {
    page: isDark
      ? "bg-[#11162b] text-white"
      : "bg-[#f4f7fc] text-[#182238]",

    muted: isDark
      ? "text-[#7282aa]"
      : "text-[#687797]",

    card: isDark
      ? "bg-[#1b2139]"
      : "bg-white",

    cardBorder: isDark
      ? "border-[#252d4b]"
      : "border-[#dce3ef]",

    secondaryCard: isDark
      ? "bg-[#202640]"
      : "bg-[#f8faff]",

    input: isDark
      ? "bg-[#1d2540] border-[#293352]"
      : "bg-[#f1f5fb] border-[#d8e0ed]",

    title: isDark
      ? "text-[#dce5ff]"
      : "text-[#1c2942]",

    smallText: isDark
      ? "text-[#687898]"
      : "text-[#71809c]",
  };

  return (
    <div
      className={`min-h-screen overflow-x-hidden px-5 py-8 transition-colors duration-300 md:px-10 lg:px-12 ${colors.page}`}
    >

      {/* ================= HEADER ================= */}

      <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

        <div>
          <p
            className={`text-[12px] font-medium tracking-[0.28em] ${isDark ? "text-[#53658f]" : "text-[#72809a]"}`}
          >
            WEDNESDAY, SEPTEMBER 2
          </p>

          <h1 className="mt-2 text-[34px] font-normal leading-tight tracking-[-1px] md:text-[38px]">
            Welcome back,{" "}
            <span className="text-[#5797ff]">
              Morgan
            </span>
          </h1>

          <p className={`mt-2 text-[15px] ${colors.muted}`}>
            1 package awaiting · 1 ready to collect
          </p>
        </div>

        {/* Header Controls */}

        <div className="flex items-center gap-3">

          {/* Online */}

          <div
            className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-[14px] shadow-lg transition-colors ${
              isDark
                ? "bg-[#1a2139] text-[#3ee18a]"
                : "bg-white text-[#22a968] border border-[#dce3ef]"
            }`}
          >
            <Wifi size={16} />
            <span>Online</span>
          </div>

          {/* Theme Button */}

          <button
            onClick={() =>
              setTheme(isDark ? "light" : "dark")
            }
            className={`flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300 ${
              isDark
                ? "bg-[#1a2139] text-[#f7c75d] hover:bg-[#242d49]"
                : "bg-white text-[#52627f] border border-[#dce3ef] hover:bg-[#edf2fa]"
            }`}
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

          {/* Notification */}

          <button
            className={`relative flex h-12 w-12 items-center justify-center rounded-full transition ${
              isDark
                ? "bg-[#1a2139] text-[#7b88a9] hover:text-white"
                : "bg-white text-[#687797] border border-[#dce3ef] hover:text-[#182238]"
            }`}
          >
            <Bell size={21} />

            <span className="absolute right-[8px] top-[7px] h-[9px] w-[9px] rounded-full bg-[#f18b35]" />
          </button>

        </div>
      </header>

      {/* ================= ACTION CARDS ================= */}

      <section className="mt-8 grid gap-5 lg:grid-cols-2">

        {/* Receive Package */}

        <button
          className="
            group
            flex
            min-h-[110px]
            items-center
            rounded-[28px]
            bg-gradient-to-r
            from-[#6eabf8]
            to-[#5894ed]
            px-7
            text-left
            shadow-[0_15px_35px_rgba(57,111,210,0.18)]
            transition
            duration-200
            hover:-translate-y-1
          "
        >

          <div
            className="
              mr-5
              flex
              h-[59px]
              w-[59px]
              shrink-0
              items-center
              justify-center
              rounded-[19px]
              bg-white/15
              shadow-inner
            "
          >
            <Box size={28} strokeWidth={1.8} />
          </div>

          <div>
            <p className="text-[19px] font-medium">
              Receive Package
            </p>

            <p className="mt-1 text-[14px] text-[#d8e7ff]">
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
          className={`flex min-h-[110px] items-center rounded-[28px] border px-7 text-left shadow-[0_15px_35px_rgba(0,0,0,0.08)] transition duration-200 hover:-translate-y-1 ${colors.cardBorder} ${colors.card}`}
        >

          <div
            className="
              mr-5
              flex
              h-[59px]
              w-[59px]
              shrink-0
              items-center
              justify-center
              rounded-[19px]
              bg-[#202d4d]
              text-[#5c9cff]
            "
          >
            <ScanLine size={28} strokeWidth={1.7} />
          </div>

          <div>
            <p
              className={`text-[19px] font-medium ${colors.title}`}
            >
              Scan Delivery Code
            </p>

            <p className={`mt-1 text-[14px] ${colors.muted}`}>
              QR or manual entry
            </p>
          </div>

        </button>

      </section>

      {/* ================= MAIN DASHBOARD ================= */}

      <main className="mt-7 grid gap-7 lg:grid-cols-[478px_minmax(0,1fr)]">

        {/* ================= DROPORA LOCKER ================= */}

        <section
          className={`rounded-[27px] border p-7 shadow-[0_20px_45px_rgba(0,0,0,0.12)] transition-colors duration-300 ${
            isDark
              ? "border-[#202945] bg-gradient-to-br from-[#202640] to-[#171d33]"
              : "border-[#dce3ef] bg-gradient-to-br from-white to-[#f3f6fc]"
          }`}
        >

          {/* Locker Header */}

          <div className="mb-4 flex items-center justify-between">

            <p
              className={`text-[15px] font-medium tracking-wide ${colors.smallText}`}
            >
              DROPORA
            </p>

            <div className="flex items-center gap-2 text-[14px] text-[#38d983]">

              <span className="h-[10px] w-[10px] rounded-full bg-[#3bd985] shadow-[0_0_12px_rgba(59,217,133,0.7)]" />

              Connected
            </div>

          </div>

          {/* Locker Device */}

          <div
            className={`rounded-[25px] border p-6 shadow-inner ${
              isDark
                ? "border-[#27304c] bg-[#1b223b]"
                : "border-[#dce3ef] bg-[#f7f9fd]"
            }`}
          >

            {/* Device Name */}

            <div
              className={`mb-5 flex h-[39px] items-center justify-between rounded-[15px] px-5 ${
                isDark
                  ? "bg-[#171d34]"
                  : "bg-[#eaf0f8]"
              }`}
            >

              <span
                className={`text-[13px] tracking-[0.2em] ${colors.smallText}`}
              >
                DROPORA LOCKER
              </span>

              <span className="h-[10px] w-[10px] rounded-full bg-[#3fe486] shadow-[0_0_12px_rgba(63,228,134,0.8)]" />

            </div>

            {/* ================= SINGLE COMPARTMENT ================= */}

            <div
              className={`relative flex h-[180px] flex-col justify-between overflow-hidden rounded-[24px] p-6 ${
                isLocked
                  ? isDark
                    ? "bg-[#202743]"
                    : "bg-[#eaf7f0]"
                  : isDark
                  ? "bg-[#1d2944]"
                  : "bg-[#eaf2ff]"
              }`}
            >

              {/* Pattern */}

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  opacity-[0.08]
                  [background:repeating-linear-gradient(55deg,transparent,transparent_13px,#7b8eb8_14px,#7b8eb8_15px)]
                "
              />

              {/* Top */}

              <div className="relative flex items-center justify-between">

                <span className={`text-[14px] tracking-[0.15em] ${colors.smallText}`}>
                  DROPORA
                </span>

                {isLocked ? (
                  <Lock
                    size={25}
                    className="text-[#35d985]"
                    strokeWidth={1.6}
                  />
                ) : (
                  <Unlock
                    size={25}
                    className="text-[#5b9af4]"
                    strokeWidth={1.6}
                  />
                )}

              </div>

              {/* Center */}

              <div className="relative flex flex-col items-center justify-center">

                <div
                  className={`mb-3 flex h-[54px] w-[54px] items-center justify-center rounded-full ${
                    isLocked
                      ? "bg-[#26c978]/15 text-[#35d985]"
                      : "bg-[#3d86ee]/15 text-[#5b9af4]"
                  }`}
                >
                  {isLocked ? (
                    <Lock size={25} />
                  ) : (
                    <Unlock size={25} />
                  )}
                </div>

                <span
                  className={`rounded-full px-4 py-1.5 text-[12px] ${
                    isLocked
                      ? "bg-[#26c978]/15 text-[#35d985]"
                      : "bg-[#3d86ee]/15 text-[#5b9af4]"
                  }`}
                >
                  {isLocked ? "Locked" : "Unlocked"}
                </span>

              </div>

              {/* Bottom */}

              <div className="relative flex items-center justify-between">

                <span className={`text-[12px] ${colors.smallText}`}>
                  Main Compartment
                </span>

                <span
                  className={`h-[13px] w-[13px] rounded-full ${
                    isLocked
                      ? "bg-[#42dd85] shadow-[0_0_14px_rgba(66,221,133,0.7)]"
                      : "bg-[#5599f2] shadow-[0_0_14px_rgba(85,153,242,0.6)]"
                  }`}
                />

              </div>

            </div>

            {/* Lock / Unlock Button */}

            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`mt-5 flex h-[48px] w-full items-center justify-center gap-2 rounded-[14px] text-[14px] transition ${
                isLocked
                  ? "bg-[#24304e] text-[#5a9aff] hover:bg-[#29385c]"
                  : "bg-[#183b31] text-[#3fe18a] hover:bg-[#1d4a3d]"
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

        <section className="min-w-0">

          {/* TABS */}

          <div
            className={`grid grid-cols-3 rounded-[20px] border p-1 ${
              colors.cardBorder
            } ${colors.card}`}
          >

            {[
              "Overview",
              "Packages",
              "Notifications",
            ].map((item) => (

              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`relative rounded-[16px] py-3 text-[14px] transition ${
                  activeTab === item
                    ? isDark
                      ? "bg-[#202640] text-[#5c9cff] shadow-lg"
                      : "bg-[#edf3fc] text-[#4c8ef5] shadow-sm"
                    : isDark
                    ? "text-[#53638b] hover:text-[#8290b4]"
                    : "text-[#74819a] hover:text-[#4d5c77]"
                }`}
              >

                {item}

                {item === "Notifications" && (
                  <span
                    className="
                      ml-2
                      inline-flex
                      h-[20px]
                      w-[20px]
                      items-center
                      justify-center
                      rounded-full
                      bg-[#f28b36]
                      text-[10px]
                      font-medium
                      text-white
                    "
                  >
                    2
                  </span>
                )}

              </button>

            ))}

          </div>

          {/* ================= OVERVIEW ================= */}

          {activeTab === "Overview" && (
            <>

              {/* STAT CARDS */}

              <div className="mt-5 grid grid-cols-3 gap-4">

                <StatCard
                  value="1"
                  label="Received"
                  valueColor="text-[#5799ff]"
                  isDark={isDark}
                />

                <StatCard
                  value="1"
                  label="Collected"
                  valueColor="text-[#3fdf86]"
                  isDark={isDark}
                />

                <StatCard
                  value={isLocked ? "Locked" : "Open"}
                  label="Locker Status"
                  valueColor={
                    isLocked
                      ? "text-[#3fdf86]"
                      : "text-[#5799ff]"
                  }
                  isDark={isDark}
                />

              </div>

              {/* DROPORA STATUS */}

              <div
                className={`mt-5 rounded-[24px] border p-6 shadow-[0_15px_35px_rgba(0,0,0,0.08)] ${
                  isDark
                    ? "border-[#222b48] bg-gradient-to-br from-[#202640] to-[#181e34]"
                    : "border-[#dce3ef] bg-gradient-to-br from-white to-[#f4f7fc]"
                }`}
              >

                {/* Package Header */}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <h2
                    className={`text-[17px] font-medium ${colors.title}`}
                  >
                    Dropora Compartment
                  </h2>

                  <div
                    className={`flex items-center gap-2 text-[14px] ${
                      isLocked
                        ? "text-[#40df87]"
                        : "text-[#5b9af4]"
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

                <div className="mt-5 grid grid-cols-2 gap-4">

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">

          <div
            className={`w-full max-w-md rounded-[28px] border p-6 shadow-2xl ${
              isDark
                ? "border-[#293352] bg-[#171d33]"
                : "border-[#dce3ef] bg-white"
            }`}
          >

            <div className="mb-5 flex items-center justify-between">

              <div>
                <p className="text-[11px] tracking-[0.22em] text-[#5f7199]">
                  DROPORA
                </p>

                <h2
                  className={`mt-1 text-xl font-medium ${colors.title}`}
                >
                  Scan Delivery Code
                </h2>
              </div>

              <button
                onClick={closeScanner}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition ${
                  isDark
                    ? "bg-[#222a44] text-[#8090b5] hover:text-white"
                    : "bg-[#edf2f8] text-[#687797] hover:text-[#182238]"
                }`}
                aria-label="Close scanner"
              >
                <X size={19} />
              </button>

            </div>

            {/* Camera */}

            <div className="relative overflow-hidden rounded-[22px] border border-[#2b3656] bg-black">

              <video
                ref={videoRef}
                className="aspect-square w-full object-cover"
                muted
                playsInline
              />

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-52 w-52 rounded-[22px] border-2 border-[#5b9af4] shadow-[0_0_35px_rgba(91,154,244,0.35)]" />
              </div>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/65 px-4 py-2 text-xs text-white/80">
                Point the camera at a QR code
              </div>

            </div>

            {/* Scan Message */}

            {scanMessage && (
              <div
                className={`mt-4 rounded-[14px] px-4 py-3 text-sm ${
                  isDark
                    ? "bg-[#202943] text-[#b9c7e8]"
                    : "bg-[#edf3fb] text-[#596982]"
                }`}
              >
                {scanMessage}
              </div>
            )}

            {/* Successful Code */}

            {scanCode && (
              <div className="mt-4 rounded-[14px] bg-[#183b31] px-4 py-3 text-sm text-[#42df88]">
                Delivery code:{" "}
                <span className="font-medium">
                  {scanCode}
                </span>
              </div>
            )}

            <div className="my-5 flex items-center gap-3 text-xs text-[#566789]">
              <span className="h-px flex-1 bg-[#293352]" />

              OR ENTER CODE MANUALLY

              <span className="h-px flex-1 bg-[#293352]" />
            </div>

            {/* Manual Input */}

            <div className="flex gap-3">

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
                className={`min-w-0 flex-1 rounded-[14px] border px-4 py-3 text-sm outline-none placeholder:text-[#596a8e] focus:border-[#5b9af4] ${
                  isDark
                    ? "border-[#293352] bg-[#1d2540] text-white"
                    : "border-[#d5deeb] bg-[#f4f7fb] text-[#182238]"
                }`}
              />

              <button
                onClick={() =>
                  processScan(scanCode)
                }
                className="flex items-center gap-2 rounded-[14px] bg-[#5799ff] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#6aa6ff]"
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
    <div
      className={`flex h-[105px] flex-col items-center justify-center rounded-[20px] border shadow-inner ${
        isDark
          ? "border-[#202943] bg-[#1b2139]"
          : "border-[#dce3ef] bg-white"
      }`}
    >

      <span
        className={`text-[25px] font-normal ${valueColor}`}
      >
        {value}
      </span>

      <span
        className={`mt-2 text-[13px] ${
          isDark
            ? "text-[#5d6c91]"
            : "text-[#71809a]"
        }`}
      >
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
    <div
      className={`min-h-[78px] rounded-[15px] p-4 ${
        isDark
          ? "bg-[#181e35]"
          : "bg-[#f1f5fa]"
      }`}
    >

      <p
        className={`text-[10px] ${
          isDark
            ? "text-[#59698d]"
            : "text-[#71809a]"
        }`}
      >
        {title}
      </p>

      <p
        className={`mt-2 text-[17px] font-normal ${
          isDark
            ? "text-[#dce5ff]"
            : "text-[#27344e]"
        }`}
      >
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
    <div
      className={`mt-5 flex min-h-[350px] flex-col items-center justify-center rounded-[24px] border text-center ${
        isDark
          ? "border-[#222b48] bg-[#1b2139]"
          : "border-[#dce3ef] bg-white"
      }`}
    >

      <div className="mb-4 text-[#5799ff]">
        {icon}
      </div>

      <h2
        className={`text-lg font-medium ${
          isDark
            ? "text-white"
            : "text-[#1c2942]"
        }`}
      >
        {title}
      </h2>

      <p
        className={`mt-2 text-sm ${
          isDark
            ? "text-[#667596]"
            : "text-[#71809a]"
        }`}
      >
        {description}
      </p>

    </div>
  );
}

export default App;