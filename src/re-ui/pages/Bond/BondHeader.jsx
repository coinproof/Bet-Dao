import { useState } from "react";
import { NavLink, useHistory } from "react-router-dom";
import BondLogo from "../../../components/BondLogo";
import AdvancedSettings from "./AdvancedSettings";
import { Typography, IconButton, SvgIcon, Link } from "@material-ui/core";
import { ReactComponent as SettingsIcon } from "../../../assets/icons/settings.svg";
import { ReactComponent as XIcon } from "../../../assets/icons/x.svg";
import useEscape from "../../../hooks/useEscape";
import { tw } from "twind";

function BondHeader({
  bond,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  let history = useHistory();

  useEscape(() => {
    if (open) handleClose;
    else history.push("/bonds");
  });

  return (
    <div className="bond-header">
      <div className={`bond-header-logo ${tw("gap-3 flex")}`}>
        <BondLogo bond={bond} />

        <div className={tw("flex flex-col gap-3")}>
          <p className={tw("font-mons font-normal text-[14px] uppercase")}>
            {bond?.displayName}
          </p>
          <p
            className={tw(
              "text-[#05FF69] font-mons font-normal text-[12px] uppercase"
            )}
          >
            20.4%
          </p>
        </div>
      </div>
    </div>
  );
}

export default BondHeader;

/*

<div className="bond-settings">
        <IconButton onClick={handleOpen}>
          <SvgIcon color="primary" component={SettingsIcon} />
        </IconButton>
        <AdvancedSettings
          open={open}
          handleClose={handleClose}
          slippage={slippage}
          recipientAddress={recipientAddress}
          onRecipientAddressChange={onRecipientAddressChange}
          onSlippageChange={onSlippageChange}
        />
      </div>


*/
