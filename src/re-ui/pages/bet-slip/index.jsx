import React, { useState, useMemo } from "react";
import { tw } from "twind";
import DashboardLayout from "../../layouts/dashboard";
import { Select, MenuItem } from "@material-ui/core";
import Arrow from "src/re-ui/resources/svgs/arrow";

const Cards = ({ price, strip, title }) => {
  return (
    <div
      className={tw(
        "min-w-[200px] flex-1 rounded-[10px] h-[130px] py-4 bg-[#1C1C1C]"
      )}
    >
      <div className={tw("h-full flex")}>
        <div className={tw("w-1 h-full rounded-full", `bg-[${strip}]`)} />
        <div className={tw("flex-1 flex flex-col gap-3")}>
          <div className={tw("flex flex-col gap-2 pl-4")}>
            <p
              className={tw(
                "font-mons font-light text-[#BCBCBC] text-[12px] uppercase"
              )}
            >
              Total
            </p>
            <p className={tw("font-rw font-normal uppercase text-[15px]")}>
              {title}
            </p>
          </div>
          <div className={tw("w-full h-[1px] ", `bg-[${strip}]`)} />
          <div className={tw("flex flex-col gap-2 pl-4 justify-end flex-1")}>
            <p className={tw("font-mons font-normal uppercase text-[18px]")}>
              {price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const betData = [
  {
    team1: "Chealsea",
    team2: "Machester City",
    poolSize: "3600",
    team1Percent: "30",
    team2Percent: "65",
    draw: "5",
    category: "active",
    btn: "BOOST",
    leftTime: "3",
    active: "active",
  },
  {
    team1: "Chealsea",
    team2: "Machester City",
    poolSize: "3600",
    team1Percent: "30",
    team2Percent: "65",
    draw: "5",
    category: "active",
    btn: "BOOST",
    leftTime: "3",
    active: "active",
  },
  {
    team1: "Chealsea",
    team2: "Machester City",
    poolSize: "3600",
    team1Percent: "30",
    team2Percent: "65",
    draw: "5",
    category: "active",
    btn: "BOOST",
    leftTime: "3",
    active: "active",
  },
  {
    team1: "Chealsea",
    team2: "Machester City",
    poolSize: "3600",
    team1Percent: "30",
    team2Percent: "65",
    draw: "5",
    category: "inactive",
    btn: "CLAIM",
    active: "ended",
    win: "Chelsie",
  },
  {
    team1: "Chealsea",
    team2: "Machester City",
    poolSize: "3600",
    team1Percent: "30",
    team2Percent: "65",
    draw: "5",
    category: "inactive",
    btn: "CLAIM",
    active: "ended",
    win: "Chelsie",
  },
  {
    team1: "Chealsea",
    team2: "Machester City",
    poolSize: "3600",
    team1Percent: "30",
    team2Percent: "65",
    draw: "5",
    category: "inactive",
    btn: "CLAIM",
    active: "ended",
    win: "Chelsie",
  },
  {
    team1: "Chealsea",
    team2: "Machester City",
    poolSize: "3600",
    team1Percent: "30",
    team2Percent: "65",
    draw: "5",
    category: "history",
    active: "ended",
    win: "Chelsie",
  },
  {
    team1: "Chealsea",
    team2: "Machester City",
    poolSize: "3600",
    team1Percent: "30",
    team2Percent: "65",
    draw: "5",
    category: "history",
    active: "ended",
    win: "Chelsie",
  },
  {
    team1: "Chealsea",
    team2: "Machester City",
    poolSize: "3600",
    team1Percent: "30",
    team2Percent: "65",
    draw: "5",
    category: "history",
    active: "ended",
    win: "Chelsie",
  },
];

const SelectContainer = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("all");

  const items = useMemo(() => {
    const active = betData.filter((val) =>
      selected === "all" ? true : val.category === selected
    );
    return active;
  }, [betData, selected]);

  const renderAction = (category, leftTime) => {
    switch (true) {
      case category === "inactive":
        return (
          <button
            className={tw(
              "px-5 py-3 bg-[#05FF69] rounded-[10px] text-[14px] font-bold uppercase text-black sm:text-[16px]"
            )}
          >
            Claim
          </button>
        );

      case category === "active":
        return (
          <div className={tw("flex flex-col items-end gap-4")}>
            <p
              className={tw("text-[9px] font-normal uppercase sm:text-[10px]")}
            >
              {leftTime} Days left
            </p>
            <button
              className={tw(
                "px-5 py-3 bg-[#FF9A02] rounded-[10px] text-[14px] font-bold uppercase text-black sm:text-[16px]"
              )}
            >
              Boost
            </button>
          </div>
        );

      case category === "history":
        return (
          <div className={tw("flex flex-col gap-1")}>
            <p
              className={tw(
                "text-[10px] font-normal text-[#BCBCBC] uppercase sm:text-[12px]"
              )}
            >
              You won
            </p>
            <p
              className={tw("text-[10px] font-normal uppercase sm:text-[12px]")}
            >
              $2,000
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={tw("w-full bg-[#0F0F0F] flex gap-5 p-8 flex-wrap")}>
      <div
        onClick={setOpen.bind(this, !open)}
        className={tw("relative max-w-[300px] w-full")}
      >
        <div
          className={tw(
            "h-[60px] bg-[#2B2A2A] rounded-[10px] capitalize flex items-center px-4 mb-2 cursor-pointer justify-between"
          )}
        >
          {selected}

          <div className={tw(open && "rotate-180", "scale-75")}>
            <Arrow />
          </div>
        </div>
        {open && (
          <div
            className={tw(
              "absolute bg-[#2B2A2A] w-full p-4 flex flex-col rounded-[10px] cursor-pointer"
            )}
            onClick={(e) => setSelected(e.target.value)}
          >
            <option className={tw("py-2")} value="active">
              Active Bets
            </option>
            <option className={tw("py-2")} value="inactive">
              In Active Bets
            </option>
            <option className={tw("py-2")} value="history">
              History Bets
            </option>
            <option className={tw("py-2")} value="all">
              All Bets
            </option>
          </div>
        )}
      </div>

      {items.map(
        ({
          team1,
          team2,
          poolSize,
          team1Percent,
          team2Percent,
          draw,
          win,
          leftTime,
          active,
          category,
        }) => (
          <div
            className={tw(
              "w-full flex flex-col p-4 rounded-[10px] bg-[#1C1C1C] h-[260px] justify-between"
            )}
          >
            <div className={tw("flex items-center justify-between font-mons")}>
              <p
                className={tw(
                  "text-[10px] font-extrabold uppercase flex gap-2 items-center sm:text-[12px]"
                )}
              >
                <div
                  className={tw(
                    "w-2 h-2 rounded-full",
                    `bg-[${active === "active" ? "#FF4003" : "#05FF69"}]`
                  )}
                />{" "}
                {active}
              </p>
              <p
                className={tw(
                  "text-[11px] text-[#BCBCBC] font-ob font-extrabold sm:text-[13px]"
                )}
              >
                #Soccer
              </p>
            </div>
            <div
              className={tw(
                "flex flex-col items-center justify-center h-full gap-7 font-mons"
              )}
            >
              <p
                className={tw(
                  "text-[14px] font-normal uppercase sm:text-[16px]"
                )}
              >
                {team1} <span className={tw("text-[#FF0606]")}>vs</span> {team2}
              </p>

              <div
                className={tw(
                  "flex text-[14px] flex-col gap-3 items-center sm:text-[15px] font-ob font-extrabold "
                )}
              >
                <p className={tw("text-[0.8em]")}>Pool Size</p>
                <p>{poolSize}</p>
              </div>

              {category === "inactive" ? (
                <p
                  className={tw(
                    "text-[14px] font-bold uppercase sm:text-[16px]"
                  )}
                >
                  YOU WON $2,000
                </p>
              ) : null}
            </div>
            <div className={tw("flex items-center justify-between font-mons")}>
              <div className={tw("flex flex-col gap-1")}>
                {active !== "active" ? (
                  <>
                    <p
                      className={tw(
                        "text-[10px] font-normal text-[#BCBCBC] uppercase sm:text-[12px]"
                      )}
                    >
                      Winner
                    </p>
                    <p
                      className={tw(
                        "text-[11px] font-normal uppercase sm:text-[12px]"
                      )}
                    >
                      {win}
                    </p>
                  </>
                ) : (
                  <ul
                    className={tw(
                      "flex flex-col gap-2 text-[#AAAAAA] uppercase text-[11px] sm:text-[12px]"
                    )}
                  >
                    <li className={tw("flex gap-2")}>
                      <p className={tw("w-9")}>{team1Percent}</p> <p>{team1}</p>
                    </li>
                    <li className={tw("flex gap-2")}>
                      <p className={tw("w-9")}>{team2Percent}</p> <p>{team2}</p>
                    </li>
                    <li className={tw("flex gap-2")}>
                      <p className={tw("w-9")}>{draw}</p> <p>Draw</p>
                    </li>
                  </ul>
                )}
              </div>

              {renderAction(category, leftTime)}
            </div>
          </div>
        )
      )}
    </div>
  );
};

const BetSlip = () => {
  const cardsData = [
    {
      price: "500",
      strip: "#FFFEFE",
      title: "Bets Made",
    },
    {
      price: "50",
      strip: "#2F92ED",
      title: "Bets Won",
    },
    {
      price: "70",
      strip: "#FF0505",
      title: "Bets Lost",
    },
    {
      price: "80",
      strip: "#02FF67",
      title: "Amount Won",
    },
  ];

  return (
    <DashboardLayout>
      <div className={tw("w-full bg-[#0F0F0F] flex gap-5 p-8 flex-wrap")}>
        {cardsData.map((card) => (
          <Cards {...card} />
        ))}
      </div>
      <SelectContainer />
    </DashboardLayout>
  );
};

export default BetSlip;
