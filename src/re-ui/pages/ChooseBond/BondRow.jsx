import { trim } from "../../../helpers";
import BondLogo from "../../../components/BondLogo";
import {
  Box,
  Button,
  Link,
  Paper,
  TableRow,
  TableCell,
  SvgIcon,
  Slide,
} from "@material-ui/core";
import { ReactComponent as ArrowUp } from "../../../assets/icons/arrow-up.svg";
import { NavLink } from "react-router-dom";
import "./choosebond.scss";
import { Skeleton } from "@material-ui/lab";
import useBonds from "src/hooks/Bonds";
import { tw } from "twind";

export function BondDataCard({ bond }) {
  const { loading } = useBonds();
  const isBondLoading = !bond.bondPrice ?? true;

  return (
    <Slide direction="up" in={true}>
      <Paper id={`${bond.name}--bond`} className="bond-data-card ohm-card">
        <div className={`bond-pair ${tw("font-mons! flex gap-2")}`}>
          <BondLogo bond={bond} />
          <div className={`bond-name ${tw("font-mons! flex flex-col gap-2")}`}>
            <p className={tw("font-mons! text-[14px]!")}>{bond.displayName}</p>
            {bond.isLP && (
              <div className={tw("font-mons! text-[12px]! text-[#05FF69]!")}>
                <Link href={bond.lpUrl} target="_blank">
                  <p className={tw("font-mons! text-[12px]! text-[#05FF69]!")}>
                    View Contract
                    <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
                  </p>
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className={`data-row ${tw("font-mons! text-[13.5px]")}`}>
          <p>Price</p>
          <p className="bond-price">
            <>
              {isBondLoading ? (
                <Skeleton width="50px" />
              ) : (
                trim(bond.bondPrice, 2)
              )}
            </>
          </p>
        </div>

        <div className={`data-row ${tw("font-mons! text-[13.5px]")}`}>
          <p>ROI</p>
          <p>
            {isBondLoading ? (
              <Skeleton width="50px" />
            ) : (
              `${trim(bond.bondDiscount * 100, 2)}%`
            )}
          </p>
        </div>

        <div className={`data-row ${tw("font-mons! text-[13.5px]")}`}>
          <p>Purchased</p>
          <p>
            {isBondLoading ? (
              <Skeleton width="80px" />
            ) : (
              new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
                minimumFractionDigits: 0,
              }).format(bond.purchased)
            )}
          </p>
        </div>
        <Link component={NavLink} to={`/re-ui/bonds/${bond.name}`}>
          <button
            className={tw(
              "py-4 bg-white rounded-[10px] font-mons flex justify-center items-center px-5 text-[12px] font-extrabold uppercase text-black w-full"
            )}
          >
            Bond {bond.displayName}
          </button>
        </Link>
      </Paper>
    </Slide>
  );
}

export function BondTableData({ bond }) {
  // Use BondPrice as indicator of loading.
  const isBondLoading = !bond.bondPrice ?? true;
  // const isBondLoading = useSelector(state => !state.bonding[bond]?.bondPrice ?? true);

  return (
    <TableRow id={`${bond.name}--bond`}>
      <TableCell
        style={{ display: "flex", alignItems: "center" }}
        align="left"
        className="bond-name-cell"
      >
        <BondLogo bond={bond} />
        <div className="bond-name">
          <p className={tw("font-mons! text-[13px]!")}>{bond.displayName}</p>
          {bond.isLP && (
            <Link
              style={{ marginTop: "3px" }}
              color="primary"
              href={bond.lpUrl}
              target="_blank"
            >
              <p
                className={tw("font-mons! text-[12px]! text-[#05FF69]")}
                variant="body1"
              >
                View Contract
                <SvgIcon component={ArrowUp} htmlColor="#A3A3A3" />
              </p>
            </Link>
          )}
        </div>
      </TableCell>
      <TableCell align="left">
        <p className={tw("font-mons! text-[13px]!")}>
          <>
            <span className="currency-icon">$</span>
            {isBondLoading ? (
              <Skeleton width="50px" />
            ) : (
              trim(bond.bondPrice, 2)
            )}
          </>
        </p>
      </TableCell>
      <TableCell className={tw("font-mons! text-[13px]!")} align="left">
        {isBondLoading ? <Skeleton /> : `${trim(bond.bondDiscount * 100, 2)}%`}
      </TableCell>
      <TableCell className={tw("font-mons! text-[13px]!")} align="right">
        {isBondLoading ? (
          <Skeleton />
        ) : (
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(bond.purchased)
        )}
      </TableCell>
      <TableCell>
        <Link component={NavLink} to={`/re-ui/bonds/${bond.name}`}>
          <button
            className={tw(
              "py-3 bg-white rounded-[10px] font-mons flex justify-center items-center px-5 text-[12px] font-extrabold uppercase text-black"
            )}
          >
            Bond
          </button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
