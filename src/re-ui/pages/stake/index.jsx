import { Skeleton } from "@material-ui/lab";
import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import ArrowButton from "src/re-ui/components/ArrowButton";
import Info from "src/re-ui/resources/svgs/info";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { tw } from "twind/style";
import { trim } from "../../../helpers";
import { error } from "../../../slices/MessagesSlice";
import { changeApproval, changeStake } from "../../../slices/StakeThunk";
import DashboardLayout from "../../layouts/dashboard";
import { ethers } from "ethers";

const Stake = () => {
  const dispatch = useDispatch();
  const { provider, address, connected, connect, chainID } = useWeb3Context();

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");

  const isAppLoading = useSelector((state) => state.app.loading);
  const currentIndex = useSelector((state) => {
    return state.app.currentIndex;
  });
  const fiveDayRate = useSelector((state) => {
    return state.app.fiveDayRate;
  });
  const ohmBalance = useSelector((state) => {
    return state.account.balances && state.account.balances.ohm;
  });
  const oldSohmBalance = useSelector((state) => {
    return state.account.balances && state.account.balances.oldsohm;
  });
  const sohmBalance = useSelector((state) => {
    return state.account.balances && state.account.balances.sohm;
  });
  const fsohmBalance = useSelector((state) => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const wsohmBalance = useSelector((state) => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const stakeAllowance = useSelector((state) => {
    return state.account.staking && state.account.staking.ohmStake;
  });
  const unstakeAllowance = useSelector((state) => {
    return state.account.staking && state.account.staking.ohmUnstake;
  });
  const stakingRebase = useSelector((state) => {
    return state.app.stakingRebase;
  });
  const stakingAPY = useSelector((state) => {
    return state.app.stakingAPY;
  });
  const stakingTVL = useSelector((state) => {
    return state.app.stakingTVL;
  });

  const pendingTransactions = useSelector((state) => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(ohmBalance);
    } else {
      setQuantity(sohmBalance);
    }
  };

  const onSeekApproval = async (token) => {
    console.log({ address, token, provider, networkID: chainID });
    await dispatch(
      changeApproval({ address, token, provider, networkID: chainID })
    );
  };

  const onChangeStake = async (action) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(quantity) || quantity === 0 || quantity === "" || !quantity) {
      // eslint-disable-next-line no-alert
      return dispatch(error("Please enter a value!"));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity, "gwei");
    if (
      action === "stake" &&
      gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))
    ) {
      return dispatch(error("You cannot stake more than your BETS balance."));
    }

    if (
      action === "unstake" &&
      gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))
    ) {
      return dispatch(
        error("You cannot unstake more than your sBETS balance.")
      );
    }

    await dispatch(
      changeStake({
        address,
        action,
        value: quantity.toString(),
        provider,
        networkID: chainID,
      })
    );
  };

  const hasAllowance = useCallback(
    (token) => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance]
  );

  let modalButton = [];

  modalButton.push(
    <button
      className={tw(
        "py-5 bg-white rounded-[10px] flex justify-center items-center px-4 text-[12px] font-extrabold uppercase text-black min-w-[170px] max-w-[250px] w-full"
      )}
      onClick={connect}
      key={1}
    >
      Connect Wallet
    </button>
  );

  const changeView = (event, newView) => {
    setView(newView);
  };

  const trimmedBalance = Number(
    [sohmBalance, fsohmBalance, wsohmBalance]
      .filter(Boolean)
      .map((balance) => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4)
  );
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  const nextRewardValue = trim(
    (stakingRebasePercentage / 100) * trimmedBalance,
    4
  );

  const stakesData = [
    {
      title: "STAKED BALANCE",
      value: "0.001  BETS",
    },
    {
      title: "UNSTAKED BALANCE",
      value: "0.001  BETS",
    },
    {
      title: "EXPECTED REWARD",
      value: "0.001  BETS",
    },
    {
      title: "ROI",
      value: "0.001  BETS",
    },
    {
      title: "DURATION",
      value: "0.001  BETS",
    },
  ];

  return (
    <DashboardLayout>
      <div className={tw("bg-[#0F0F0F] font-mons rounded-[10px]")}>
        <div
          className={tw(
            "flex items-center flex-col justify-between font-mons p-7 border-b-2 gap-5 border-[#2C2B2B] sm:flex-row px-4"
          )}
        >
          <div
            className={tw(
              "flex flex-col gap-2 uppercase font-mons items-center sm:items-start"
            )}
          >
            <p
              className={tw(
                "text-[#BCBCBC] font-normal text-[12px] flex gap-3 items-center"
              )}
            >
              TOTAL VALUE DEPOSITED
              <div>
                <Info />
              </div>
            </p>
            <p className={tw("font-bold text-[16px]")}>
              {stakingTVL ? (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(stakingTVL)
              ) : (
                <Skeleton width="150px" />
              )}
            </p>
          </div>

          <div
            className={tw(
              "flex flex-col gap-2 uppercase font-mons items-center"
            )}
          >
            <p className={tw("text-[#BCBCBC] font-normal text-[12px]")}>APY</p>
            <p className={tw("font-bold text-[16px]")}>
              {stakingAPY ? (
                <>{new Intl.NumberFormat("en-US").format(trimmedStakingAPY)}%</>
              ) : (
                <Skeleton width="150px" />
              )}
            </p>
          </div>

          <div
            className={tw(
              "flex flex-col gap-2 uppercase items-center sm:items-end"
            )}
          >
            <p className={tw("text-[#BCBCBC] font-normal text-[12px]")}>
              Current Index
            </p>
            <p className={tw("font-normal text-[16px]")}>
              {currentIndex ? (
                <>{trim(currentIndex, 1)} BETS</>
              ) : (
                <Skeleton width="150px" />
              )}
            </p>
          </div>
        </div>
        {!address ? (
          <div
            className={`stake-wallet-notification ${tw(
              "font-mons flex flex-col items-center gap-5 py-10"
            )}`}
          >
            <div className="wallet-menu" id="wallet-menu">
              {modalButton}
            </div>
            <p>Connect your wallet to stake BETS</p>
          </div>
        ) : (
          <>
            <div
              className={tw(
                "flex flex-col items-center justify-between gap-4 font-mons p-4 pb-0 border-b-2 border-[#2C2B2B] "
              )}
            >
              <div
                className={tw(
                  "flex w-full flex-col uppercase font-mons gap-2 px-4"
                )}
              >
                <p className={tw("text-[#BCBCBC] font-normal text-[11px]")}>
                  STAKE (1,1)
                </p>
                <p className={tw("text-[#BCBCBC] font-normal text-[11px]")}>
                  2 hrs, 7 mins to next rebase
                </p>
              </div>
              <div className={tw("flex w-full justify-center uppercase gap-4")}>
                <button
                  className={tw(
                    "uppercase py-3 border-b-4 px-3 focus:outline-none outline-none transition-border duration-500",
                    view === 0 ? "border-[#FF4003]" : "border-transparent"
                  )}
                  onClick={setView.bind(this, 0)}
                >
                  Stake
                </button>
                <button
                  className={tw(
                    "uppercase py-3 px-3 border-b-4 focus:outline-none  outline-none transition-border duration-500",
                    view === 1 ? "border-[#FF4003]" : "border-transparent"
                  )}
                  onClick={setView.bind(this, 1)}
                >
                  UnStake
                </button>
              </div>
            </div>
            <div
              className={tw(
                "flex flex-col gap-7 justify-between font-mons p-7 items-center sm:items-start px-4"
              )}
            >
              <div className={tw("flex gap-4 uppercase font-mons")}>
                <p
                  className={tw(
                    "text-[#BCBCBC] font-normal text-[12px] w-[200px]"
                  )}
                >
                  Your Balance
                </p>
                <p className={tw("font-bold text-[16px]")}>
                  {isAppLoading ? (
                    <Skeleton width="80px" />
                  ) : (
                    <>{trim(ohmBalance, 4) || 0} BETS</>
                  )}
                </p>
              </div>
              <div className={tw("flex gap-4 uppercase font-mons")}>
                <p
                  className={tw(
                    "text-[#BCBCBC] font-normal text-[12px] w-[200px]"
                  )}
                >
                  Your Staked Balance
                </p>
                <p className={tw("font-bold text-[16px]")}>
                  {isAppLoading ? (
                    <Skeleton width="80px" />
                  ) : (
                    <>{trimmedBalance} sBETS</>
                  )}
                </p>
              </div>
              <div className={tw("flex gap-4 uppercase font-mons")}>
                <p
                  className={tw(
                    "text-[#BCBCBC] font-normal text-[12px] w-[200px]"
                  )}
                >
                  Next Reward Amount
                </p>
                <p className={tw("font-bold text-[16px]")}>
                  {isAppLoading ? (
                    <Skeleton width="80px" />
                  ) : (
                    <>{nextRewardValue} sBETS</>
                  )}
                </p>
              </div>

              <div className={tw("flex gap-4 uppercase font-mons")}>
                <p
                  className={tw(
                    "text-[#BCBCBC] font-normal text-[12px] w-[200px]"
                  )}
                >
                  Next Reward Yield
                </p>
                <p className={tw("font-bold text-[16px]")}>
                  {isAppLoading ? (
                    <Skeleton width="80px" />
                  ) : (
                    <>{stakingRebasePercentage}%</>
                  )}
                </p>
              </div>

              <div className={tw("flex gap-4 uppercase font-mons")}>
                <p
                  className={tw(
                    "text-[#BCBCBC] font-normal text-[12px] w-[200px]"
                  )}
                >
                  ROI (5-Day Rate)
                </p>
                <p className={tw("font-bold text-[16px]")}>
                  {isAppLoading ? (
                    <Skeleton width="80px" />
                  ) : (
                    <>{trim(fiveDayRate * 100, 4)}%</>
                  )}
                </p>
              </div>
            </div>
            <div
              className={tw("flex items-center justify-between font-mons p-7")}
            >
              <div
                className={tw(
                  "flex uppercase justify-between font-mons bg-[#151515] rounded-[10px] gap-2 py-5 px-2 max-w-[250px] w-full"
                )}
              >
                <input
                  type="text"
                  className={tw("bg-transparent max-w-[190px] truncate px-2")}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <p
                  onClick={setMax}
                  className={tw("text-[#AAAAAA] cursor-pointer pr-2")}
                >
                  MAX
                </p>
              </div>

              {view === 0 ? (
                address && hasAllowance("ohm") ? (
                  <ArrowButton
                    disabled={isPendingTxn(pendingTransactions, "staking")}
                    onClick={() => {
                      onChangeStake("stake");
                    }}
                  >
                    {txnButtonText(
                      pendingTransactions,
                      "staking",
                      "Stake BETS"
                    )}
                  </ArrowButton>
                ) : (
                  <ArrowButton
                    disabled={isPendingTxn(
                      pendingTransactions,
                      "approve_staking"
                    )}
                    onClick={() => {
                      onSeekApproval("ohm");
                    }}
                  >
                    {txnButtonText(
                      pendingTransactions,
                      "approve_staking",
                      "Approve"
                    )}
                  </ArrowButton>
                )
              ) : address && hasAllowance("sohm") ? (
                <ArrowButton
                  disabled={isPendingTxn(pendingTransactions, "unstaking")}
                  onClick={() => {
                    onChangeStake("unstake");
                  }}
                >
                  {txnButtonText(
                    pendingTransactions,
                    "unstaking",
                    "Unstake BETS"
                  )}
                </ArrowButton>
              ) : (
                <ArrowButton
                  disabled={isPendingTxn(
                    pendingTransactions,
                    "approve_unstaking"
                  )}
                  onClick={() => {
                    onSeekApproval("sohm");
                  }}
                >
                  {txnButtonText(
                    pendingTransactions,
                    "approve_unstaking",
                    "Approve"
                  )}
                </ArrowButton>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Stake;
