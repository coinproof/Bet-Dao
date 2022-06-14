import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useMediaQuery } from "react-responsive";
import { useHistory, useRouteMatch } from "react-router-dom";
import { useUpdateEffect } from "react-use";
import { useWeb3Context } from "src/hooks/web3Context";
import Books from "src/re-ui/resources/svgs/books";
import Coins from "src/re-ui/resources/svgs/coins";
import Goggles from "src/re-ui/resources/svgs/goggles";
import { css, tw } from "twind/style";
import logoPng from "../../resources/imgs/logo.png";
import logo2Png from "../../resources/imgs/logo2.png";
import Docs from "../../resources/svgs/docs";
import "./home.css";
import {BsCircleFill, BsBoxArrowUpRight, BsFillQuestionCircleFill} from 'react-icons/bs'

const index = ({ children }) => {
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();

  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const history = useHistory();
  const xd = useRouteMatch();
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);

  console.log(xd);

  const [sidebar, setSidebar] = useState(!isMobile);
  const [current, setCurrent] = useState("bet slip");
  const [btnText, setBtnText] = useState("Wallet");
  const pendingTransactions = useSelector((state) => {
    return state.pendingTransactions;
  });

  useEffect(() => {
    if (pendingTransactions && pendingTransactions.length > 0) {
      setBtnText("In Progress");
    } else if (connected) {
      setBtnText("disconnect");
    }
  }, [connected, pendingTransactions]);

  const sidebarData = [
    {
      title: "Overview",
      icon: <Goggles />,
      path: ["/dashboard", "/"],
    },
    {
      title: "Bond",
      icon: <Books />,
      path: ["/bonds"],
    },
    {
      title: "Stake",
      icon: <Coins />,
      path: ["/stake"],
    },
    // {
    //   title: "bet slip",
    //   icon: <BetSlip />,
    //   path: "/betslip",
    // },
    // {
    //   title: "Create Event",
    //   icon: <CreateEvent />,
    //   path: "/createevent",
    // },
    // {
    //   title: "validate events",
    //   icon: <Validate />,
    //   path: "/validateevents",
    // },
    // {
    //   title: "self help",
    //   icon: <SelfHelp />,
    //   path: "/selfhelp",
    // },
    // {
    //   title: "bETSWAMP DOA",
    //   icon: <Doa />,
    // },
    {
      title: "Decentralised betting",
      icon: (
        <img
          src={logo2Png}
          style={{ zoom: 0.8, position: "relative", left: "-4px" }}
        />
      ),
      path: ["/betslip"],
      special: true,
    },
    {
      title: "Docs",
      icon: <Docs />,
      path: "",
    },
  ];

  useUpdateEffect(() => {
    if (sidebar) setSidebar(false);
  }, [isMobile]);

  useEffect(() => {
    console.log(xd.path);
    setCurrent(xd.path);
  }, [xd]);

  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <section className={tw("w-full min-h-screen flex flex-col relative")}>
      <header
        className={tw(
          "min-h-[85px] z-10! max-h-[85px] flex justify-between px-[5%] items-center font-rhd bg-[#0F0F0F] sticky top-0"
        )}
      >
        <img className={tw("h-[55px]")} src={logoPng} />
        <div
          className={tw(
            "flex max-w-[200px] w-full justify-between items-center"
          )}
        >
          <p
            className={tw("cursor-pointer")}
            // onClick={() => history.push("/betSlip")}
          >
            BETS
          </p>
          <p
            className={tw("cursor-pointer uppercase")}
            onClick={() =>
              pendingTransactions.length
                ? null
                : btnText === "disconnect"
                ? disconnect()
                : connect()
            }
          >
            {btnText}
          </p>
          <p
            className={tw("cursor-pointer uppercase")}
            onClick={handleClickOpen("paper")}
          >
            Popup
          </p>

          <p
            onClick={setSidebar.bind(this, !sidebar)}
            className={tw("relative -top-[1px] cursor-pointer block md:hidden")}
          >
            <MenuIcon />
          </p>
        </div>
      </header>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        {/* <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle> */}
        <DialogContent dividers={scroll === "paper"}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <div className="topBar">
              <div id="address" style={{display:"flex"}}><BsCircleFill color="green"/>&nbsp;0x3244...2646</div>
              <div id="buyBet">
                <a href="#" style={{display:"flex"}}>BUY BETS&nbsp;&nbsp;<BsBoxArrowUpRight/></a>
              </div>
            </div>
            <div id="bal">
              <p>TOTAL BALANCE</p>
              <h3>$3000</h3>
            </div>
            <div id="horCard">
              <div className="walletCard">
                <div id="betImg">
                  <img src={logoPng} alt="" />
                </div>
                <div id="walletCardBody">
                  <div id="infoA">
                    <h4>BETSWAMP V2</h4>
                    <p>$2.36<span>+20.2%</span></p>
                  </div>
                  <div id="infoB">
                    <h4>250 BETS</h4>
                    <p>$2000</p>
                  </div>
                </div>
              </div>
              <div className="walletCard">
                <div id="betImg">
                  <img src={logoPng} alt="" />
                </div>
                <div id="walletCardBody">
                  <div id="infoA">
                    <h4>BETSWAMP V2</h4>
                    <p>$2.36<span>+20.2%</span></p>
                  </div>
                  <div id="infoB">
                    <h4>250 BETS</h4>
                    <p>$2000</p>
                  </div>
                </div>
              </div>
              <div className="walletCard">
                <div id="betImg">
                  <img src={logoPng} alt="" />
                </div>
                <div id="walletCardBody">
                  <div id="infoA">
                    <h4>BETSWAMP V2</h4>
                    <p>$2.36<span>+20.2%</span></p>
                  </div>
                  <div id="infoB">
                    <h4>250 BETS</h4>
                    <p>$2000</p>
                  </div>
                </div>
              </div>
              <div className="validHead">
                <p>VALIDATION POINTS<br/><span>Lock your sBETS to earn more validation points.</span></p>
                <BsFillQuestionCircleFill/>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        {/* <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleClose}>Subscribe</Button>
        </DialogActions> */}
      </Dialog>
      <div className={tw("flex flex-1 relative")}>
        <nav
          className={tw(
            "w-[290px] flex flex-col fixed justify-between  overflow-auto  z-10 left-0 md:fixed bg-[#0F0F0F] md:left-0 bootom-0 ",
            !sidebar && "left-[-290px]",
            css({
              "&": {
                transition: "0.4s all ease-out",
                height: "calc(100vh - 105px)",
                bottom: "0",
              },
            })
          )}
        >
          <div>
            {sidebarData.map(({ title, icon, path, special }) => (
              <div
                onClick={() => {
                  setCurrent(path);
                  setSidebar(false);
                  path && history.push(Array.isArray(path) ? path[0] : path);
                }}
                className={tw(
                  "w-full h-[80px] flex pl-[13%] items-center gap-4 cursor-pointer transition-all duration-500 ",
                  css({
                    "& svg": { zoom: 0.6 },
                  }),
                  special &&
                    css({
                      "&": {
                        margin: "30px 0px",
                        borderBottom: "1px",
                        borderTop: "1px",
                        borderColor: "#2B2A2A",
                        borderStyle: "solid",
                      },
                    }),
                  path.includes(current) &&
                    css({
                      "& svg path": { fill: "#FF4003", stroke: "#FF4003" },
                      borderLeft: "2px solid #FF4003",
                      backgroundColor: "#0A0A0A",
                    })
                )}
              >
                <div
                  style={{
                    width: "35px",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  {icon}
                </div>
                <p
                  className={tw(
                    "font-mons text-[13px] uppercase",
                    path.includes(current) && "font-bold"
                  )}
                >
                  {title}
                </p>
              </div>
            ))}
          </div>
          <p
            className={tw("font-mons text-[13px] uppercase text-center pb-14")}
          >
            VERSION 2.0
          </p>
        </nav>
        <div
          className={tw(
            "w-[290px] flex h-full flex-col absolute top-85 left-0 md:relative bg-[#0F0F0F] md:left-0",
            !sidebar && "left-[-290px]",
            css({
              "&": {
                transition: "0.4s all ease-out",
              },
            })
          )}
        />
        <div
          className={tw(
            "flex-1 p-5 flex flex-col gap-4 relative md:filter-none",
            sidebar && "filter blur-md"
          )}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default index;
