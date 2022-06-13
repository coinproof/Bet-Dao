import { Box, TableCell, TableRow, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import { useDispatch, useSelector } from "react-redux";
import { useBonds, useWeb3Context } from "src/hooks";
import {
  isPendingTxn,
  txnButtonTextGeneralPending,
} from "src/slices/PendingTxnsSlice";
import { tw } from "twind";
import BondLogo from "../../../components/BondLogo";
import { prettyVestingPeriod, trim } from "../../../helpers";
import { redeemBond } from "../../../slices/BondSlice";
import "./choosebond.scss";

export function ClaimBondTableData({ userBond }) {
  const dispatch = useDispatch();
  const { bonds } = useBonds();
  const { address, chainID, provider } = useWeb3Context();

  const bond = userBond[1];
  const bondName = bond.bond;

  const isAppLoading = useSelector((state) => state.app.loading ?? true);

  const currentBlock = useSelector((state) => {
    return state.app.currentBlock;
  });

  const pendingTransactions = useSelector((state) => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }) {
    let currentBond = bonds.find((bnd) => bnd.name === bondName);
    await dispatch(
      redeemBond({
        address,
        bond: currentBond,
        networkID: chainID,
        provider,
        autostake,
      })
    );
  }

  return (
    <TableRow id={`${bondName}--claim`}>
      <TableCell>
        <BondLogo bond={bond} />
      </TableCell>
      <TableCell align="left">
        <div className={tw("flex items-center")}>
          <div className="bond-name">
            <p className={tw("font-mons! text-[13px]!")}>
              {bond.displayName ? (
                trim(bond.displayName, 4)
              ) : (
                <Skeleton width={100} />
              )}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell align="center">
        <p className={tw("font-mons! text-[13px]!")}>
          {bond.pendingPayout ? (
            trim(bond.pendingPayout, 4)
          ) : (
            <Skeleton width={100} />
          )}
        </p>
      </TableCell>
      <TableCell align="center">
        <p className={tw("font-mons! text-[13px]!")}>
          {bond.interestDue ? (
            trim(bond.interestDue, 4)
          ) : (
            <Skeleton width={100} />
          )}
        </p>
      </TableCell>
      <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
        <p className={tw("font-mons! text-[13px]!")}>
          {isAppLoading ? <Skeleton /> : vestingPeriod()}
        </p>
      </TableCell>
      <TableCell align="left">
        <button
          disabled={isPendingTxn(
            pendingTransactions,
            "redeem_bond_" + bondName
          )}
          className={tw(
            "py-3 bg-white rounded-[10px] font-mons flex justify-center items-center px-5 text-[12px] font-extrabold uppercase text-black"
          )}
          onClick={() => onRedeem({ autostake: false })}
        >
          {txnButtonTextGeneralPending(
            pendingTransactions,
            "redeem_bond_" + bondName,
            "Claim"
          )}
        </button>
      </TableCell>
    </TableRow>
  );
}

export function ClaimBondCardData({ userBond }) {
  const dispatch = useDispatch();
  const { bonds } = useBonds();
  const { address, chainID, provider } = useWeb3Context();

  const bond = userBond[1];
  const bondName = bond.bond;

  const currentBlock = useSelector((state) => {
    return state.app.currentBlock;
  });

  const pendingTransactions = useSelector((state) => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  async function onRedeem({ autostake }) {
    let currentBond = bonds.find((bnd) => bnd.name === bondName);
    await dispatch(
      redeemBond({
        address,
        bond: currentBond,
        networkID: chainID,
        provider,
        autostake,
      })
    );
  }

  return (
    <Box
      id={`${bondName}--claim`}
      className="claim-bond-data-card bond-data-card"
      style={{ marginBottom: "30px" }}
    >
      <Box className="bond-pair">
        <BondLogo bond={bond} />
        <Box className="bond-name">
          <Typography>
            {bond.displayName ? (
              trim(bond.displayName, 4)
            ) : (
              <Skeleton width={100} />
            )}
          </Typography>
        </Box>
      </Box>

      <div className="data-row">
        <Typography>Claimable</Typography>
        <Typography>
          {bond.pendingPayout ? (
            trim(bond.pendingPayout, 4)
          ) : (
            <Skeleton width={100} />
          )}
        </Typography>
      </div>

      <div className="data-row">
        <Typography>Pending</Typography>
        <Typography>
          {bond.interestDue ? (
            trim(bond.interestDue, 4)
          ) : (
            <Skeleton width={100} />
          )}
        </Typography>
      </div>

      <div className="data-row" style={{ marginBottom: "20px" }}>
        <Typography>Fully Vested</Typography>
        <Typography>{vestingPeriod()}</Typography>
      </div>
      <Box
        display="flex"
        justifyContent="space-around"
        alignItems="center"
        className="claim-bond-card-buttons"
      >
        <button
          disabled={isPendingTxn(
            pendingTransactions,
            "redeem_bond_" + bondName
          )}
          className={tw(
            "py-3 bg-white rounded-[10px] w-full font-mons flex justify-center items-center px-5 text-[12px] font-extrabold uppercase text-black"
          )}
          onClick={() => onRedeem({ autostake: false })}
        >
          {txnButtonTextGeneralPending(
            pendingTransactions,
            "redeem_bond_" + bondName,
            "Claim"
          )}
        </button>
        <button
          onClick={() => onRedeem({ autostake: true })}
          className={tw(
            "py-3 bg-white rounded-[10px] w-full font-mons flex justify-center items-center px-5 text-[12px] font-extrabold uppercase text-black"
          )}
        >
          {txnButtonTextGeneralPending(
            pendingTransactions,
            "redeem_bond_" + bondName + "_autostake",
            "Claim and Stake"
          )}
        </button>
      </Box>
    </Box>
  );
}
