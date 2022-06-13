import { Skeleton } from "@material-ui/lab";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import Settings from "src/re-ui/resources/svgs/settings";
import { tw } from "twind";
import { formatCurrency } from "../../../helpers";
import Dashboard from "../../layouts/dashboard";
import AdvancedSettings from "./AdvancedSettings";
import "./bond.scss";
import BondHeader from "./BondHeader";
import BondPurchase from "./BondPurchase";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Bond({ bond }) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const [slippage, setSlippage] = useState(0.5);
  const [recipientAddress, setRecipientAddress] = useState(address);
  const [settings, setSettings] = useState(false);

  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState();

  const isBondLoading = useSelector((state) => state.bonding.loading ?? true);

  const onRecipientAddressChange = (e) => {
    return setRecipientAddress(e.target.value);
  };

  const onSlippageChange = (e) => {
    return setSlippage(e.target.value);
  };

  useEffect(() => {
    if (address) setRecipientAddress(address);
  }, [provider, quantity, address]);

  const changeView = (event, newView) => {
    setView(newView);
  };

  return (
    <Dashboard>
      <div className={tw("w-full flex flex-col gap-3")}>
        <div className={tw("w-full bg-[#0F0F0F] rounded-[40px]")}>
          <div
            className={tw(
              "flex items-center w-full flex-col justify-between font-mons p-7 border-b-2 gap-5 border-[#2C2B2B] sm:flex-row"
            )}
          >
            <BondHeader
              bond={bond}
              slippage={slippage}
              recipientAddress={recipientAddress}
              onSlippageChange={onSlippageChange}
              onRecipientAddressChange={onRecipientAddressChange}
            />

            <div
              className={tw(
                "flex flex-col gap-2 uppercase font-mons items-center sm:items-center"
              )}
            >
              <p
                className={tw(
                  "text-[#BCBCBC] font-normal text-[12px] uppercase"
                )}
              >
                Bond Price
              </p>
              <p className={tw("font-bold text-[16px]")}>
                {isBondLoading ? (
                  <Skeleton />
                ) : (
                  formatCurrency(bond.bondPrice, 2)
                )}
              </p>
            </div>

            <div
              className={tw(
                "flex flex-col gap-2 uppercase items-end sm:items-end"
              )}
            >
              <p className={tw("text-[#BCBCBC] font-normal text-[12px]")}>
                Market Price
              </p>
              <p className={tw("font-bold text-[16px]")}>
                {isBondLoading ? (
                  <Skeleton />
                ) : (
                  formatCurrency(bond.marketPrice, 2)
                )}
              </p>
            </div>

            {/* <div
              className={tw(
                "flex flex-col gap-2 uppercase items-center sm:items-end"
              )}
            >
              <p className={tw("text-[#BCBCBC] font-normal text-[12px]")}>
                Fixed Term
              </p>
              <p className={tw("font-normal text-[16px]")}>14 days</p>
            </div> */}
          </div>

          <BondPurchase
            bond={bond}
            slippage={slippage}
            recipientAddress={recipientAddress}
            setSettings={setSettings.bind(this, !settings)}
          />
        </div>

        {/* <TabPanel value={view} index={1}>
          <BondRedeem bond={bond} />
        </TabPanel> */}

        {settings && (
          <AdvancedSettings handleClose={() => setSettings(false)} />
        )}
      </div>
    </Dashboard>
  );
}

export default Bond;
