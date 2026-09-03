import { useEffect, useRef, useState } from "react";
import {
  Bell,
  Box,
  ScanLine,
  Wifi,
  Lock,
  Unlock,
  ChevronRight,
  X,
  QrCode,
} from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLocked, setIsLocked] = useState(true);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [scanCode, setScanCode] = useState("");
  const [scanMessage, setScanMessage] = useState("");
  const streamRef = useRef(null);
  const videoRef = useRef(null);

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

    // Demo behavior: a successful scan unlocks Dropora.
    setIsLocked(false);
  };

  const startScanner = async () => {
  setScanMessage("Starting camera...");

  try {
    stopScanner();

    // Check if the browser supports camera access
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setScanMessage("Camera access is not supported by this browser.");
      return;
    }

    // Request the device camera
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    });

    streamRef.current = stream;

    // Make sure the video element exists
    if (!videoRef.current) {
      stream.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      return;
    }

    // Put camera stream into the video element
    videoRef.current.srcObject = stream;

    // Start displaying the camera
    await videoRef.current.play();

    setScanMessage("Camera is ready. Point it at a QR code.");

    // QR scanner
    if ("BarcodeDetector" in window) {
      const detector = new BarcodeDetector({
        formats: ["qr_code"],
      });

      const scanFrame = async () => {
        if (!streamRef.current || !videoRef.current) {
          return;
        }

        try {
          const barcodes = await detector.detect(videoRef.current);

          if (barcodes.length > 0 && barcodes[0].rawValue) {
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
      setScanMessage("No camera was found on this device.");
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

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#11162b] px-5 py-8 text-white md:px-10 lg:px-12">

      {/* ================= HEADER ================= */}
      <header className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

        <div>
          <p className="text-[12px] font-medium tracking-[0.28em] text-[#53658f]">
            WEDNESDAY, SEPTEMBER 2
          </p>

          <h1 className="mt-2 text-[34px] font-normal leading-tight tracking-[-1px] md:text-[38px]">
            Welcome back,{" "}
            <span className="text-[#5797ff]">Morgan</span>
          </h1>

          <p className="mt-2 text-[15px] text-[#7282aa]">
            1 package awaiting · 1 ready to collect
          </p>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-4">

          <div className="flex items-center gap-2 rounded-full bg-[#1a2139] px-5 py-2.5 text-[14px] text-[#3ee18a] shadow-lg shadow-black/10">
            <Wifi size={16} />
            <span>Online</span>
          </div>

          <button
            className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#1a2139] text-[#7b88a9] shadow-lg shadow-black/20 transition hover:text-white"
          >
            <Bell size={21} />

            <span className="absolute right-[10px] top-[8px] h-[9px] w-[9px] rounded-full bg-[#f18b35]" />
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
          className="
            flex
            min-h-[110px]
            items-center
            rounded-[28px]
            border
            border-[#252d4b]
            bg-[#1a2037]
            px-7
            text-left
            shadow-[0_15px_35px_rgba(0,0,0,0.12)]
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
              bg-[#202d4d]
              text-[#5c9cff]
            "
          >
            <ScanLine size={28} strokeWidth={1.7} />
          </div>

          <div>
            <p className="text-[19px] font-medium">
              Scan Delivery Code
            </p>

            <p className="mt-1 text-[14px] text-[#7181a9]">
              QR or manual entry
            </p>
          </div>

        </button>

      </section>


      {/* ================= MAIN DASHBOARD ================= */}
      <main className="mt-7 grid gap-7 lg:grid-cols-[478px_minmax(0,1fr)]">

        {/* ================= DROPORA LOCKER ================= */}
        <section
          className="
            rounded-[27px]
            border
            border-[#202945]
            bg-gradient-to-br
            from-[#202640]
            to-[#171d33]
            p-7
            shadow-[0_20px_45px_rgba(0,0,0,0.15)]
          "
        >

          {/* Locker Header */}
          <div className="mb-4 flex items-center justify-between">

            <p className="text-[15px] font-medium tracking-wide text-[#687aa5]">
              DROPORA
            </p>

            <div className="flex items-center gap-2 text-[14px] text-[#38d983]">

              <span
                className="
                  h-[10px]
                  w-[10px]
                  rounded-full
                  bg-[#3bd985]
                  shadow-[0_0_12px_rgba(59,217,133,0.7)]
                "
              />

              Connected
            </div>

          </div>


          {/* Locker Device */}
          <div
            className="
              rounded-[25px]
              border
              border-[#27304c]
              bg-[#1b223b]
              p-6
              shadow-inner
            "
          >

            {/* Device Name */}
            <div
              className="
                mb-5
                flex
                h-[39px]
                items-center
                justify-between
                rounded-[15px]
                bg-[#171d34]
                px-5
              "
            >

              <span className="text-[13px] tracking-[0.2em] text-[#536487]">
                DROPORA LOCKER
              </span>

              <span
                className="
                  h-[10px]
                  w-[10px]
                  rounded-full
                  bg-[#3fe486]
                  shadow-[0_0_12px_rgba(63,228,134,0.8)]
                "
              />

            </div>


            {/* ================= SINGLE COMPARTMENT ================= */}
            <div
              className={`
                relative
                flex
                h-[180px]
                flex-col
                justify-between
                overflow-hidden
                rounded-[24px]
                p-6
                ${
                  isLocked
                    ? "bg-[#202743]"
                    : "bg-[#1d2944]"
                }
              `}
            >

              {/* Subtle diagonal pattern */}
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

                <span className="text-[14px] tracking-[0.15em] text-[#687898]">
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
                  className={`
                    mb-3
                    flex
                    h-[54px]
                    w-[54px]
                    items-center
                    justify-center
                    rounded-full
                    ${
                      isLocked
                        ? "bg-[#26c978]/15 text-[#35d985]"
                        : "bg-[#3d86ee]/15 text-[#5b9af4]"
                    }
                  `}
                >
                  {isLocked ? (
                    <Lock size={25} />
                  ) : (
                    <Unlock size={25} />
                  )}
                </div>

                <span
                  className={`
                    rounded-full
                    px-4
                    py-1.5
                    text-[12px]
                    ${
                      isLocked
                        ? "bg-[#26c978]/15 text-[#35d985]"
                        : "bg-[#3d86ee]/15 text-[#5b9af4]"
                    }
                  `}
                >
                  {isLocked ? "Locked" : "Unlocked"}
                </span>

              </div>


              {/* Bottom */}
              <div className="relative flex items-center justify-between">

                <span className="text-[12px] text-[#687898]">
                  Main Compartment
                </span>

                <span
                  className={`
                    h-[13px]
                    w-[13px]
                    rounded-full
                    ${
                      isLocked
                        ? "bg-[#42dd85] shadow-[0_0_14px_rgba(66,221,133,0.7)]"
                        : "bg-[#5599f2] shadow-[0_0_14px_rgba(85,153,242,0.6)]"
                    }
                  `}
                />

              </div>

            </div>


            {/* Lock / Unlock Button */}
            <button
              onClick={() => setIsLocked(!isLocked)}
              className={`
                mt-5
                flex
                h-[48px]
                w-full
                items-center
                justify-center
                gap-2
                rounded-[14px]
                text-[14px]
                transition
                ${
                  isLocked
                    ? "bg-[#24304e] text-[#5a9aff] hover:bg-[#29385c]"
                    : "bg-[#183b31] text-[#3fe18a] hover:bg-[#1d4a3d]"
                }
              `}
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
            className="
              grid
              grid-cols-3
              rounded-[20px]
              border
              border-[#252d4b]
              bg-[#1b2139]
              p-1
            "
          >

            {["Overview", "Packages", "Notifications"].map((item) => (

              <button
                key={item}
                onClick={() => setActiveTab(item)}
                className={`
                  relative
                  rounded-[16px]
                  py-3
                  text-[14px]
                  transition
                  ${
                    activeTab === item
                      ? "bg-[#202640] text-[#5c9cff] shadow-lg"
                      : "text-[#53638b] hover:text-[#8290b4]"
                  }
                `}
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
                />

                <StatCard
                  value="1"
                  label="Collected"
                  valueColor="text-[#3fdf86]"
                />

                <StatCard
                  value={isLocked ? "Locked" : "Open"}
                  label="Locker Status"
                  valueColor={
                    isLocked
                      ? "text-[#3fdf86]"
                      : "text-[#5799ff]"
                  }
                />

              </div>


              {/* DROPORA STATUS */}
              <div
                className="
                  mt-5
                  rounded-[24px]
                  border
                  border-[#222b48]
                  bg-gradient-to-br
                  from-[#202640]
                  to-[#181e34]
                  p-6
                  shadow-[0_15px_35px_rgba(0,0,0,0.12)]
                "
              >

                {/* Package Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                  <h2 className="text-[17px] font-medium text-[#dce5ff]">
                    Dropora Compartment
                  </h2>

                  <div
                    className={`
                      flex
                      items-center
                      gap-2
                      text-[14px]
                      ${
                        isLocked
                          ? "text-[#40df87]"
                          : "text-[#5b9af4]"
                      }
                    `}
                  >

                    {isLocked ? (
                      <Lock size={16} />
                    ) : (
                      <Unlock size={16} />
                    )}

                    {isLocked ? "Locked" : "Unlocked"}

                  </div>

                </div>


                {/* Package Information */}
                <div className="mt-5 grid grid-cols-2 gap-4">

                  <InfoCard
                    title="PACKAGE ID"
                    value="PKG-4821"
                  />

                  <InfoCard
                    title="SENDER"
                    value="Apple Store"
                  />

                  <InfoCard
                    title="ARRIVED"
                    value="Today, 2:34 PM"
                  />

                  <InfoCard
                    title="WEIGHT"
                    value="1.2 kg"
                  />

                </div>


                {/* Details Button */}
                <button
                  className="
                    mt-5
                    flex
                    h-[46px]
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-[14px]
                    bg-[#24304e]
                    text-[14px]
                    text-[#5a9aff]
                    transition
                    hover:bg-[#29385c]
                  "
                >

                  View Package Details

                  <ChevronRight size={18} />

                </button>

              </div>

            </>
          )}


          {/* ================= PACKAGES ================= */}
          {activeTab === "Packages" && (
            <EmptyState
              icon={<Box size={42} />}
              title="Your Packages"
              description="1 package is currently registered in Dropora."
            />
          )}


          {/* ================= NOTIFICATIONS ================= */}
          {activeTab === "Notifications" && (
            <EmptyState
              icon={<Bell size={42} />}
              title="Notifications"
              description="You have 2 unread notifications."
            />
          )}

        </section>

      </main>

      {/* ================= QR SCANNER ================= */}
      {isScanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] border border-[#293352] bg-[#171d33] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.22em] text-[#5f7199]">DROPORA</p>
                <h2 className="mt-1 text-xl font-medium">Scan Delivery Code</h2>
              </div>

              <button
                onClick={closeScanner}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#222a44] text-[#8090b5] transition hover:text-white"
                aria-label="Close scanner"
              >
                <X size={19} />
              </button>
            </div>

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

            {scanMessage && (
              <div className="mt-4 rounded-[14px] bg-[#202943] px-4 py-3 text-sm text-[#b9c7e8]">
                {scanMessage}
              </div>
            )}

            {scanCode && (
              <div className="mt-4 rounded-[14px] bg-[#183b31] px-4 py-3 text-sm text-[#42df88]">
                Delivery code: <span className="font-medium">{scanCode}</span>
              </div>
            )}

            <div className="my-5 flex items-center gap-3 text-xs text-[#566789]">
              <span className="h-px flex-1 bg-[#293352]" />
              OR ENTER CODE MANUALLY
              <span className="h-px flex-1 bg-[#293352]" />
            </div>

            <div className="flex gap-3">
              <input
                value={scanCode}
                onChange={(e) => setScanCode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") processScan(scanCode);
                }}
                placeholder="e.g. PKG-4821"
                className="min-w-0 flex-1 rounded-[14px] border border-[#293352] bg-[#1d2540] px-4 py-3 text-sm text-white outline-none placeholder:text-[#596a8e] focus:border-[#5b9af4]"
              />

              <button
                onClick={() => processScan(scanCode)}
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

function StatCard({ value, label, valueColor }) {
  return (
    <div
      className="
        flex
        h-[105px]
        flex-col
        items-center
        justify-center
        rounded-[20px]
        border
        border-[#202943]
        bg-[#1b2139]
        shadow-inner
      "
    >

      <span className={`text-[25px] font-normal ${valueColor}`}>
        {value}
      </span>

      <span className="mt-2 text-[13px] text-[#5d6c91]">
        {label}
      </span>

    </div>
  );
}


/* ================= INFO CARD ================= */

function InfoCard({ title, value }) {
  return (
    <div
      className="
        min-h-[78px]
        rounded-[15px]
        bg-[#181e35]
        p-4
      "
    >

      <p className="text-[10px] text-[#59698d]">
        {title}
      </p>

      <p className="mt-2 text-[17px] font-normal text-[#dce5ff]">
        {value}
      </p>

    </div>
  );
}


/* ================= EMPTY STATE ================= */

function EmptyState({ icon, title, description }) {
  return (
    <div
      className="
        mt-5
        flex
        min-h-[350px]
        flex-col
        items-center
        justify-center
        rounded-[24px]
        border
        border-[#222b48]
        bg-[#1b2139]
        text-center
      "
    >

      <div className="mb-4 text-[#5799ff]">
        {icon}
      </div>

      <h2 className="text-lg font-medium text-white">
        {title}
      </h2>

      <p className="mt-2 text-sm text-[#667596]">
        {description}
      </p>

    </div>
  );
}

export default App;