import {
  Typography,
  Box,
  Modal,
  Paper,
  SvgIcon,
  IconButton,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
} from "@material-ui/core";
import { tw } from "twind";
import { ReactComponent as XIcon } from "../../../assets/icons/x.svg";
import "./bondSettings.scss";

function AdvancedSettings({
  handleClose,
  slippage,
  recipientAddress,
  onRecipientAddressChange,
  onSlippageChange,
}) {
  return (
    <div className={tw("w-full bg-[#0F0F0F] rounded-[40px] p-5")}>
      <div className={tw("w-full flex justify-end")}>
        <IconButton onClick={handleClose}>
          <SvgIcon color="primary" component={XIcon} />
        </IconButton>
      </div>

      <div className={tw("w-full flex flex-col gap-4")}>
        <InputLabel className={tw("uppercase")} htmlFor="slippage">
          Slippage
        </InputLabel>
        <div className={tw("flex flex-col gap-3")}>
          <OutlinedInput
            id="slippage"
            value={slippage}
            onChange={onSlippageChange}
            type="number"
            className={tw(" w-full max-w-[400px]")}
            max="100"
            min="100"
            endAdornment={<InputAdornment position="end">%</InputAdornment>}
          />
          <div className="help-text">
            <Typography
              className={tw("text-[14px]!")}
              variant="body2"
              color="textSecondary"
            >
              Transaction may revert if price changes by more than slippage %
            </Typography>
          </div>
        </div>

        <InputLabel className={tw("mt-5 uppercase")} htmlFor="recipient">
          Recipient Address
        </InputLabel>
        <div className={tw("flex flex-col gap-3")}>
          <OutlinedInput
            id="recipient"
            value={recipientAddress}
            onChange={onRecipientAddressChange}
            type="text"
            className={tw(" w-full max-w-[400px]")}
          />
          <div className="help-text">
            <Typography
              variant="body2"
              className={tw("text-[14px]!")}
              color="textSecondary"
            >
              Choose recipient address. By default, this is your currently
              connected address
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedSettings;
