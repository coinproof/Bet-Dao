import { Skeleton } from "@material-ui/lab";
import { useEffect, useState, memo } from "react";
import { useSelector } from "react-redux";
import { tw, css } from "twind/style";
import { formatCurrency, trim } from "../../../helpers";
import DashboardLayout from "../../layouts/dashboard";
import {
  AreaChart,
  ResponsiveContainer,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import Info from "src/re-ui/resources/svgs/info";

const Cards = ({ children, strip, title, subtitle, classNameTitle = "" }) => {
  return (
    <div
      className={tw(
        "min-w-[220px] flex-1 rounded-[10px] h-[130px] py-4 bg-[#1C1C1C] relative",
        css({
          "&": {
            transition: "0.4s all ease-out",
            boxShadow: `10px 10px 4px 0px rgba(0, 0, 0, 0.25)`,
          },
        })
      )}
    >
      <div className={tw("h-full flex")}>
        <div className={tw("w-1 h-full rounded-full", `bg-[${strip}]`)} />
        <div className={tw("flex-1 flex flex-col gap-3")}>
          <div className={tw("flex flex-col gap-2 pl-4")}>
            <p
              className={tw(
                "font-mons font-light text-[#BCBCBC] text-[12px] uppercase",
                subtitle === null && "invisible"
              )}
            >
              {subtitle}
            </p>
            <p
              className={tw(
                "font-rw font-normal uppercase text-[15px]",
                classNameTitle
              )}
            >
              {title}
            </p>
          </div>
          <div className={tw("w-full h-[1px]", `bg-[${strip}]`)} />
          <div className={tw("flex flex-col gap-2 pl-4 justify-end flex-1")}>
            <p className={tw("font-mons font-normal uppercase text-[16px]")}>
              {children}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Charts = memo(({ title, price, chartFill, data }) => {
  const chartData = [];
  for (let index = 30; index >= 0; index--) {
    const d = new Date();
    d.setDate(d.getDate() - index);

    chartData.push({
      value: 1 + Math.random(),
      date: d.toISOString().substring(0, 10),
    });
  }

  return (
    <div
      className={tw(
        "min-w-[250px] flex-grow w-[45%] max-w-full rounded-[20px] max-h-max bg-[#0F0F0F] relative p-5 flex flex-col gap-3"
      )}
    >
      <div className={tw("flex flex-col gap-1 pl-4")}>
        <p
          className={tw(
            "font-mons font-light text-[#BCBCBC] text-[12px] uppercase flex items-center gap-2"
          )}
        >
          {title}
          <div className={tw("scale-75")}>
            <Info />
          </div>
        </p>
        <p
          className={tw(
            "font-mons font-normal uppercase text-[15px] mb-[80px]"
          )}
        >
          {price}
        </p>
      </div>
      <ResponsiveContainer width="100%" height={120}>
        <AreaChart data={Array.isArray(data) && data.length ? data : chartData}>
          <Area
            stroke="transparent"
            dataKey="value"
            fill={chartFill}
            fillOpacity={1}
          />
          <XAxis dataKey="date" hide />
          <YAxis dataKey="value" hide />
          {/* <Tooltip contentStyle={{ color: "black" }} /> */}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
});

const Overview = () => {
  const [data, setData] = useState(null);
  const [apy, setApy] = useState(null);
  const [runway, setRunway] = useState(null);

  const staked = useSelector((state) => {
    return state.app.Staked;
  });
  const treasuryMarketValue = useSelector((state) => {
    return state.app.treasuryMarketValue;
  });
  const marketPrice = useSelector((state) => {
    return state.app.marketPrice;
  });
  const circSupply = useSelector((state) => {
    return state.app.circSupply;
  });
  const totalSupply = useSelector((state) => {
    return state.app.totalSupply;
  });
  const marketCap = useSelector((state) => {
    return state.app.marketCap;
  });

  const currentIndex = useSelector((state) => {
    return state.app.currentIndex;
  });

  const backingPerOhm = useSelector((state) => {
    return state.app.treasuryMarketValue / state.app.circSupply;
  });
  const stakingAPY = useSelector((state) => {
    return state.app.stakingAPY;
  });
  const wsOhmPrice = useSelector((state) => {
    return state.app.marketPrice * state.app.currentIndex;
  });

  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  useEffect(() => {}, []);

  return (
    <DashboardLayout>
      <div
        className={tw(
          "w-full bg-[#0F0F0F] flex gap-5 p-8 flex-wrap rounded-[10px]"
        )}
      >
        <Cards strip="#FF4003" title="BETS Price">
          {marketPrice ? (
            formatCurrency(marketPrice, 2)
          ) : (
            <Skeleton width="40%" />
          )}
        </Cards>
        <Cards strip="#05B4FF" title="Current Index">
          {currentIndex ? (
            trim(currentIndex, 2) + " sBETS"
          ) : (
            <Skeleton width="40%" />
          )}
        </Cards>
        <Cards strip="#ED2FC3" title="Circulating Supply">
          {circSupply && totalSupply ? (
            trim(circSupply, 2) + " / " + trim(totalSupply, 2)
          ) : (
            <Skeleton width="40%" />
          )}
        </Cards>
        <Cards strip="#FF9A02" title="APY">
          {stakingAPY ? (
            new Intl.NumberFormat("en-US").format(trimmedStakingAPY) + "%"
          ) : (
            <Skeleton width="40%" />
          )}
        </Cards>
        <Cards strip="#05B4FF" title="BETS Staked">
          {staked ? `${trim(staked, 2)}%` : <Skeleton width="40%" />}
        </Cards>
        <Cards strip="#ED2FC3" title="Market Cap">
          {marketCap && formatCurrency(marketCap, 2)}
          {!marketCap && <Skeleton width="40%" />}
        </Cards>
      </div>

      <div className={tw("relative w-full flex gap-4 items-start flex-wrap")}>
        <Charts
          chartFill="rgba(255, 64, 3, 0.6)"
          title="TOTAL VALUE DEPOSITED"
          price="$600,000,000"
        />
        <Charts
          chartFill="rgba(3, 255, 195, 0.6)"
          title="Market Value of Treasury Assets"
          price="$600,000,000"
        />
        <Charts
          chartFill="rgba(3, 225, 255, 0.6)"
          title="SBETS STAKED"
          price="$600,000,000"
        />
        <Charts
          chartFill="rgba(220, 3, 255, 0.6)"
          title="Protocol Owned Liquidity BUSD-BETS"
          price="$600,000,000"
        />
      </div>
    </DashboardLayout>
  );
};

export default Overview;
