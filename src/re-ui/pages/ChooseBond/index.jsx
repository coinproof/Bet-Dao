import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Zoom,
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Skeleton } from "@material-ui/lab";
import _ from "lodash";
import { useSelector } from "react-redux";
import { allBondsMap } from "src/helpers/AllBonds";
import useBonds from "../../../hooks/Bonds";
import { formatCurrency } from "../../../helpers";
import { BondDataCard, BondTableData } from "./BondRow";
import "./choosebond.scss";
import ClaimBonds from "./ClaimBonds";
import Dashboard from "../../layouts/dashboard";
import { tw } from "twind";
import Info from "src/re-ui/resources/svgs/info";

function ChooseBond() {
  const { bonds } = useBonds();
  const isSmallScreen = useMediaQuery("(max-width: 733px)"); // change to breakpoint query
  const isVerySmallScreen = useMediaQuery("(max-width: 420px)");

  const isAppLoading = useSelector((state) => state.app.loading);
  const isAccountLoading = useSelector((state) => state.account.loading);

  const accountBonds = useSelector((state) => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });

  const marketPrice = useSelector((state) => {
    return state.app.marketPrice;
  });

  const treasuryBalance = useSelector((state) => {
    if (state.bonding.loading == false) {
      let tokenBalances = 0;
      for (const bond in allBondsMap) {
        if (state.bonding[bond]) {
          tokenBalances += state.bonding[bond].purchased;
        }
      }
      return tokenBalances;
    }
  });

  return (
    <Dashboard>
      <div id="choose-bond-view" className=" bg-[#0F0F0F] rounded-[10px]">
        {!isAccountLoading && !_.isEmpty(accountBonds) && (
          <ClaimBonds activeBonds={accountBonds} />
        )}

        <div
          className={tw(
            "flex items-center w-full flex-col justify-between font-mons p-7 border-b-2 gap-5 border-[#2C2B2B] sm:flex-row"
          )}
        >
          <div
            className={tw(
              "flex flex-col gap-2 uppercase font-mons items-center sm:items-start"
            )}
          >
            <p
              className={tw(
                "text-[#BCBCBC] font-normal text-[12px] uppercase flex gap-3 items-center"
              )}
            >
              Treasury Balance
              <div>
                <Info />
              </div>
            </p>
            <p className={tw("font-bold text-[16px]")}>
              {isAppLoading ? (
                <Skeleton width="180px" />
              ) : (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(treasuryBalance)
              )}
            </p>
          </div>

          <div
            className={tw(
              "flex flex-col gap-2 uppercase items-center sm:items-end"
            )}
          >
            <p className={tw("text-[#BCBCBC] font-normal text-[12px]")}>
              BETS Price
            </p>
            <p className={tw("font-normal text-[16px]")}>
              {isAppLoading ? (
                <Skeleton width="100px" />
              ) : (
                formatCurrency(marketPrice, 2)
              )}
            </p>
          </div>
        </div>

        <div
          className={tw(
            "flex w-full py-4 flex-col uppercase font-mons gap-2 p-4"
          )}
        >
          <p className={tw("text-[#BCBCBC] font-normal text-[11px]")}>
            BOND (1,1)
          </p>
          <p className={tw("text-[#BCBCBC] font-normal text-[11px]")}>
            2 hrs, 7 mins to next rebase
          </p>
        </div>

        {!isSmallScreen && (
          <Grid container item className={tw("pl-[7%]")}>
            <TableContainer>
              <Table aria-label="Available bonds">
                <TableHead>
                  <TableRow>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="center"
                    >
                      Bond
                    </TableCell>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="left"
                    >
                      Price
                    </TableCell>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="left"
                    >
                      ROI
                    </TableCell>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="right"
                    >
                      Purchased
                    </TableCell>
                    <TableCell
                      className={tw("font-mons! text-[15px]! text-[#BCBCBC]!")}
                      align="right"
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bonds.map((bond) => (
                    <BondTableData key={bond.name} bond={bond} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}

        {isSmallScreen && (
          <Box className="ohm-card-container">
            <Grid container item spacing={2}>
              {bonds.map((bond) => (
                <Grid item xs={12} key={bond.name}>
                  <BondDataCard key={bond.name} bond={bond} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </div>
    </Dashboard>
  );
}

export default ChooseBond;
