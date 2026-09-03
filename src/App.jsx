import { useState } from "react";
import {
  Bell,
  Box,
  ScanLine,
  Wifi,
  Lock,
  Unlock,
  ChevronRight,
} from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isLocked, setIsLocked] = useState(true);

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