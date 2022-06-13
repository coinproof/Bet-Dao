import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Grid,
  TableRow,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useBonds from "src/hooks/Bonds";
import { useWeb3Context } from "src/hooks/web3Context";
import { redeemAllBonds } from "src/slices/BondSlice";
import {
  isPendingTxn,
  txnButtonTextGeneralPending,
} from "src/slices/PendingTxnsSlice";
import { tw } from "twind/style";
import CardHeader from "../../../components/CardHeader/CardHeader";
import "./choosebond.scss";
import { ClaimBondCardData, ClaimBondTableData } from "./ClaimRow";

function ClaimBonds({ activeBonds }) {
  const dispatch = useDispatch();
  const { provider, address, chainID } = useWeb3Context();
  const { bonds } = useBonds();

  const [numberOfBonds, setNumberOfBonds] = useState(0);
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query

  const pendingTransactions = useSelector((state) => {
    return state.pendingTransactions;
  });

  const pendingClaim = () => {
    if (
      isPendingTxn(pendingTransactions, "redeem_all_bonds") ||
      isPendingTxn(pendingTransactions, "redeem_all_bonds_autostake")
    ) {
      return true;
    }

    return false;
  };

  const onRedeemAll = async ({ autostake }) => {
    console.log("redeeming all bonds");

    console.error({ address, bonds, networkID: chainID, provider, autostake });
    await dispatch(
      redeemAllBonds({
        address,
        bonds,
        networkID: chainID,
        provider,
        autostake,
      })
    );

    console.log("redeem all complete");
  };

  useEffect(() => {
    let bondCount = Object.keys(activeBonds).length;
    setNumberOfBonds(bondCount);
  }, [activeBonds]);

  return (
    <>
      {numberOfBonds >= 0 && (
        <Grid container item className={tw("pl-[7%]")}>
          <CardHeader title="Your Bonds (1,1)" />

          {!isSmallScreen && (
            <TableContainer>
              <Table aria-label="Claimable bonds">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={tw(
                        "font-mons! text-[15px]! text-[#BCBCBC]! invisible"
                      )}
                      align="left"
                    >
                      Bond
                    </TableCell>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="left"
                    >
                      Bond
                    </TableCell>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="left"
                    >
                      Claimable
                    </TableCell>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="left"
                    >
                      Pending
                    </TableCell>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="right"
                    >
                      Fully Vested
                    </TableCell>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="right"
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(activeBonds).map((bond, i) => (
                    <ClaimBondTableData key={i} userBond={bond} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {isSmallScreen &&
            Object.entries(activeBonds).map((bond, i) => (
              <ClaimBondCardData key={i} userBond={bond} />
            ))}

          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              padding: "20px 0px",
              gap: "10px",
            }}
            className={`global-claim-buttons ${isSmallScreen ? "small" : ""}`}
          >
            {numberOfBonds < 1 && (
              <>
                <button
                  disabled={pendingClaim()}
                  onClick={() => {
                    onRedeemAll({ autostake: false });
                  }}
                  className={tw(
                    "py-3 bg-white rounded-[10px] font-mons flex justify-center items-center px-5 text-[12px] font-extrabold uppercase text-black"
                  )}
                >
                  {txnButtonTextGeneralPending(
                    pendingTransactions,
                    "redeem_all_bonds",
                    "Claim all"
                  )}
                </button>

                <button
                  id="claim-all-and-stake-btn"
                  disabled={pendingClaim()}
                  onClick={() => {
                    onRedeemAll({ autostake: true });
                  }}
                  className={tw(
                    "py-3 bg-white rounded-[10px] font-mons flex justify-center items-center px-5 text-[12px] font-extrabold uppercase text-black"
                  )}
                >
                  {txnButtonTextGeneralPending(
                    pendingTransactions,
                    "redeem_all_bonds_autostake",
                    "Claim all and Stake"
                  )}
                </button>
              </>
            )}
          </div>
        </Grid>
      )}
    </>
  );
}

export default ClaimBonds;
