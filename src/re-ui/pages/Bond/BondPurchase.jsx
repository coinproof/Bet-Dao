import { Box } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import Settings from "src/re-ui/resources/svgs/settings";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { tw } from "twind";
import ArrowButton from "src/re-ui/components/ArrowButton";
import {
  prettifySeconds,
  secondsUntilBlock,
  shorten,
  trim,
} from "../../../helpers";
import useDebounce from "../../../hooks/Debounce";
import {
  bondAsset,
  calcBondDetails,
  changeApproval,
} from "../../../slices/BondSlice";
import { error } from "../../../slices/MessagesSlice";

function BondPurchase({ bond, slippage, recipientAddress, setSettings }) {
  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();

  const [quantity, setQuantity] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);

  const currentBlock = useSelector((state) => {
    return state.app.currentBlock;
  });

  const isBondLoading = useSelector((state) => state.bonding.loading ?? true);

  const pendingTransactions = useSelector((state) => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    if (0) {
      const vestingBlock = parseInt(currentBlock) + parseInt(bond.vestingTerm);

      const seconds = secondsUntilBlock(currentBlock, vestingBlock);
      return prettifySeconds(seconds, "day");
    } else {
      return prettifySeconds(bond.vestingTerm, "day");
    }
  };

  async function onBond() {
    if (quantity === "") {
      dispatch(error("Please enter a value!"));
    } else if (isNaN(quantity)) {
      dispatch(error("Please enter a valid value!"));
    } else if (recipientAddress !== address) {
      const shouldProceed = window.confirm(
        `You are trying to purchase Bond for the address ${shorten(
          recipientAddress
        )}, please ensure the wallet address has connected to PIDAO to view the Bond information after purchase succeeds.`
      );
      if (shouldProceed) {
        await dispatch(
          bondAsset({
            value: quantity,
            slippage,
            bond,
            networkID: chainID,
            provider,
            address: recipientAddress || address,
          })
        );
      }
    } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
      const shouldProceed = window.confirm(
        "You have an existing bond. Bonding will reset your vesting period and forfeit rewards. We recommend claiming rewards first or using a fresh wallet. Do you still want to proceed?"
      );
      if (shouldProceed) {
        await dispatch(
          bondAsset({
            value: quantity,
            slippage,
            bond,
            networkID: chainID,
            provider,
            address: recipientAddress || address,
          })
        );
      }
    } else {
      await dispatch(
        bondAsset({
          value: quantity,
          slippage,
          bond,
          networkID: chainID,
          provider,
          address: recipientAddress || address,
        })
      );
      clearInput();
    }
  }

  const clearInput = () => {
    setQuantity(0);
  };

  const hasAllowance = useCallback(() => {
    return bond.allowance > 0;
  }, [bond.allowance]);

  const setMax = () => {
    let maxQ;
    if (bond.maxBondPrice * bond.bondPrice < Number(bond.balance)) {
      // there is precision loss here on Number(bond.balance)
      maxQ = bond.maxBondPrice * bond.bondPrice.toString();
    } else {
      maxQ = bond.balance;
    }
    setQuantity(maxQ);
  };

  const bondDetailsDebounce = useDebounce(quantity, 1000);

  useEffect(() => {
    dispatch(
      calcBondDetails({ bond, value: quantity, provider, networkID: chainID })
    );
  }, [bondDetailsDebounce]);

  useEffect(() => {
    let interval = null;
    if (secondsToRefresh > 0) {
      interval = setInterval(() => {
        setSecondsToRefresh((secondsToRefresh) => secondsToRefresh - 1);
      }, 1000);
    } else {
      clearInterval(interval);
      dispatch(
        calcBondDetails({ bond, value: quantity, provider, networkID: chainID })
      );
      setSecondsToRefresh(SECONDS_TO_REFRESH);
    }
    return () => clearInterval(interval);
  }, [secondsToRefresh, quantity]);

  const onSeekApproval = async () => {
    dispatch(changeApproval({ address, bond, provider, networkID: chainID }));
  };

  const displayUnits = bond.displayUnits;

  return (
    <Box display="flex" flexDirection="column">
      <div
        className={tw(
          "flex flex-col gap-7 justify-between font-mons p-7 py-10 items-center sm:items-start"
        )}
      >
        <div className={tw("flex gap-4 uppercase font-mons")}>
          <p className={tw("text-[#BCBCBC] font-normal text-[12px] w-[200px]")}>
            Your Balance
          </p>
          <p className={tw("font-bold text-[16px]")}>
            {isBondLoading ? (
              <Skeleton width="100px" />
            ) : (
              <>
                {trim(bond.balance, 4)} {displayUnits}
              </>
            )}
          </p>
        </div>
        <div className={tw("flex gap-4 uppercase font-mons")}>
          <p className={tw("text-[#BCBCBC] font-normal text-[12px] w-[200px]")}>
            You will get
          </p>
          <p className={tw("font-bold text-[16px]")}>
            {isBondLoading ? (
              <Skeleton width="100px" />
            ) : (
              `${trim(bond.bondQuote, 4) || "0"} BETS`
            )}
          </p>
        </div>
        <div className={tw("flex gap-4 uppercase font-mons")}>
          <p className={tw("text-[#BCBCBC] font-normal text-[12px] w-[200px]")}>
            Max You Can Buy
          </p>
          <p className={tw("font-bold text-[16px]")}>
            {isBondLoading ? (
              <Skeleton width="100px" />
            ) : (
              `${trim(bond.maxBondPrice, 4) || "0"} BETS`
            )}
          </p>
        </div>

        <div className={tw("flex gap-4 uppercase font-mons")}>
          <p className={tw("text-[#BCBCBC] font-normal text-[12px] w-[200px]")}>
            ROI
          </p>
          <p className={tw("font-bold text-[16px]")}>
            {isBondLoading ? (
              <Skeleton width="100px" />
            ) : (
              `${trim(bond.bondDiscount * 100, 2)}%`
            )}
          </p>
        </div>

        <div className={tw("flex gap-4 uppercase font-mons")}>
          <p className={tw("text-[#BCBCBC] font-normal text-[12px] w-[200px]")}>
            Debt Ratio
          </p>
          <p className={tw("font-bold text-[16px]")}>
            {isBondLoading ? (
              <Skeleton width="100px" />
            ) : (
              `${trim(bond.debtRatio / 10000000, 4)}%`
            )}
          </p>
        </div>

        <div className={tw("flex gap-4 uppercase font-mons")}>
          <p className={tw("text-[#BCBCBC] font-normal text-[12px] w-[200px]")}>
            Vesting Term
          </p>
          <p className={tw("font-bold text-[16px]")}>
            {isBondLoading ? <Skeleton width="100px" /> : vestingPeriod()}
          </p>
        </div>
        {recipientAddress !== address && (
          <div className={tw("flex gap-4 uppercase font-mons")}>
            <p
              className={tw("text-[#BCBCBC] font-normal text-[12px] w-[200px]")}
            >
              Recipient
            </p>
            <p className={tw("font-bold text-[16px]")}>
              {isBondLoading ? (
                <Skeleton width="100px" />
              ) : (
                shorten(recipientAddress)
              )}
            </p>
          </div>
        )}
      </div>

      <div className={tw("flex items-center justify-between font-mons p-7")}>
        {!hasAllowance() ? (
          <div className={tw("cursor-pointer")} onClick={setSettings}>
            <Settings />
          </div>
        ) : (
          <div
            className={tw(
              "flex uppercase justify-between font-mons bg-[#151515] rounded-[10px] gap-2 py-5 px-2 max-w-[250px] w-full"
            )}
          >
            <input
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              type="number"
              className={tw("bg-transparent max-w-[190px] truncate")}
            />
            <p onClick={setMax} className={tw("text-[#AAAAAA] cursor-pointer")}>
              MAX
            </p>
          </div>
        )}
        {hasAllowance() ? (
          <ArrowButton
            id="bond-btn"
            disabled={isPendingTxn(pendingTransactions, "bond_" + bond.name)}
            onClick={onBond}
          >
            {txnButtonText(pendingTransactions, "bond_" + bond.name, "Bond")}
          </ArrowButton>
        ) : (
          <ArrowButton
            id="bond-approve-btn"
            disabled={isPendingTxn(pendingTransactions, "approve_" + bond.name)}
            onClick={onSeekApproval}
          >
            {txnButtonText(
              pendingTransactions,
              "approve_" + bond.name,
              "Approve"
            )}
          </ArrowButton>
        )}
      </div>
    </Box>
  );
}

export default BondPurchase;
