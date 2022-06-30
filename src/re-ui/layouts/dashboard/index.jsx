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
import { useHistory, useRouteMatch, NavLink, Link } from "react-router-dom";
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
import {
  BsCircleFill,
  BsBoxArrowUpRight,
  BsFillQuestionCircleFill,
} from "react-icons/bs";
import {
  WalletAddress,
  connectWallet,
  sbetBalance,
  betBalance,
  ValidationPoints,
} from "src/hooks/web3Context";
import OverViewpng from "./../../../assets/overview.png";
import bond from "./../../../assets/bond.png";
import docs from "./../../../assets/docs.png";
import stake from "./../../../assets/stake.png";
import betlogo from "./../../../assets/betswamplogo.png";
let TOP = {top:'0px'}
const index = ({ children }) => {
  const { connect, disconnect, connected, web3, chainID } = useWeb3Context();

  const isMobile = useMediaQuery({ maxWidth: "768px" });
  const history = useHistory();
  const xd = useRouteMatch();
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState("paper");
  const [bets, setBets] = useState(0);
  const [busd, setbusd] = useState(0);
  const [betprice, setBetPrice] = useState(0);
  const [sbets, setSbets] = useState(0);
  const [address, setAddress] = useState("");
  const [valdation, setValidation] = useState(0);
  const [fill, setFill] = useState(0);
  // const [active, setActive] = useState();
  const [slideCount, setSlideCount] = useState({
    top: "0px",
  })
  

  useEffect(() => {
    const init = async () => {
      const add = await connectWallet();
      if (add) {
        const address = await WalletAddress();
        setAddress(address);
      }
      const sbal = await sbetBalance();
      setSbets(sbal / 10 ** 18);

      const bal = await betBalance();
      setBets(bal / 10 ** 18);

      const valpoints = await ValidationPoints();
      console.log("Validation Points", valpoints);
      setValidation(valpoints);
    };
    init();
    // API_call();
  }, []);

  const API_call = async () => {
    axios
      .get("https://api.coingecko.com/api/v3/coins/betswamp")
      .then(function (response) {
        setBetPrice(response.data.market_data.current_price.usd);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);

  

  const [sidebar, setSidebar] = useState(!isMobile);
  const [current, setCurrent] = useState("bet slip");
  const [btnText, setBtnText] = useState("Wallet");
  const pendingTransactions = useSelector((state) => {
    return state.pendingTransactions;
  });

  const slicing = (address) => {
    const first = address.slice(0, 4);
    const second = address.slice(38);
    return first + "..." + second;
  };
  const totalprice = Number(betprice * bets) + Number(sbets * betprice);

  useEffect(() => {
    // if (pendingTransactions && pendingTransactions.length > 0) {
    //   setBtnText("In Progress");
    // } else if (connected) {
    //   setBtnText("disconnect");
    // }
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
    {
      title: "Decentralized betting",
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

  // setInterval(() => {
  //   const path = window.location.pathname;
  //   if (path == "/bonds") {
  //     setActive(1);
  //   } else if (path == "/stake") {
  //     setActive(2);
  //   } else {
  //     setActive(3);
  //   }
  // }, 100);

  const handleSlide = async(num) => {
    if (num === 1) {
      TOP = {top:'0px'}
    } else if (num === 2){
      TOP = {top:'75px'}
    }else if(num === 3){
      TOP = {top:'150px'}
    }
  }

  console.log("SlideCount",TOP)
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
          <a
            href="https://betswamp.com/app"
            target="_blank"
            rel="noreferrer"
            className={tw("cursor-pointer")}
            // onClick={() => history.push("/betSlip")}
          >
            MARKET
          </a>

          <p
            className={tw("cursor-pointer uppercase")}
            onClick={handleClickOpen("paper")}
          >
            {btnText}
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
              <div id="address" style={{ display: "flex" }}>
                <BsCircleFill color="green" />
                &nbsp;{slicing(address)}
              </div>
              <div id="buyBet">
                <a
                  href="https://pancakeswap.finance/swap"
                  style={{ display: "flex" }}
                >
                  BUY BETS&nbsp;&nbsp;
                  <BsBoxArrowUpRight />
                </a>
              </div>
            </div>
            <div id="bal">
              <p>TOTAL BALANCE</p>
              <h3>${totalprice}</h3>
            </div>
            <div id="horCard">
              <div className="walletCard">
                <div id="betImg">
                  <img src={logoPng} alt="" />
                </div>
                <div id="walletCardBody">
                  <div id="infoA">
                    <h4>BETSWAMP V1</h4>
                    <p>
                      $2.36<span>+20.2%</span>
                    </p>
                  </div>
                  <div id="infoB">
                    <h4>{bets} BETS</h4>
                    <p>${bets * totalprice}</p>
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
                    <p>
                      $2.36<span>+20.2%</span>
                    </p>
                  </div>
                  <div id="infoB">
                    <h4>{sbets} sBETS</h4>
                    <p>${sbets * totalprice}</p>
                  </div>
                </div>
              </div>
              {/* <div className="walletCard">
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
              </div> */}
              <div className="validHead">
                <p>
                  VALIDATION POINTS
                  <br />
                  <span>Lock your sBETS to earn more validation points.</span>
                </p>
                <BsFillQuestionCircleFill />
              </div>
              <div className="validPoint">
                <p>TOTAL VALIDATION POINTS EARNED</p>
                <br />
                <h3>{valdation}</h3>
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
            <ul className="rirusidebar">
              <li
                className={window.location.pathname === "/" ? "firstList" : ""}
                onClick={() => handleSlide(1)}
              >
                <NavLink to="/" className="sideLink">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 29 25"
                    fill="#0F0F0F"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12.0455 16.9545H16.9545M22.4773 23.0909C23.2025 23.0909 23.9207 22.9481 24.5907 22.6705C25.2608 22.393 25.8696 21.9862 26.3824 21.4733C26.8953 20.9605 27.3021 20.3517 27.5796 19.6816C27.8572 19.0116 28 18.2934 28 17.5682C28 16.8429 27.8572 16.1248 27.5796 15.4547C27.3021 14.7847 26.8953 14.1759 26.3824 13.663C25.8696 13.1502 25.2608 12.7434 24.5907 12.4658C23.9207 12.1883 23.2025 12.0455 22.4773 12.0455C21.0126 12.0455 19.6078 12.6273 18.5721 13.663C17.5364 14.6987 16.9545 16.1035 16.9545 17.5682C16.9545 19.0329 17.5364 20.4376 18.5721 21.4733C19.6078 22.509 21.0126 23.0909 22.4773 23.0909V23.0909ZM12.0455 5.90909H16.9545H12.0455ZM1.61364 15.1136C1.61364 15.1136 6.52273 3.45455 7.13636 2.22727C7.75 1 8.97727 1 9.59091 1C10.2045 1 12.0455 1 12.0455 3.45455V16.9545L1.61364 15.1136ZM6.52273 23.0909C5.79747 23.0909 5.07932 22.9481 4.40927 22.6705C3.73922 22.393 3.1304 21.9862 2.61757 21.4733C2.10474 20.9605 1.69794 20.3517 1.42039 19.6816C1.14285 19.0116 1 18.2934 1 17.5682C1 16.8429 1.14285 16.1248 1.42039 15.4547C1.69794 14.7847 2.10474 14.1759 2.61757 13.663C3.1304 13.1502 3.73922 12.7434 4.40927 12.4658C5.07932 12.1883 5.79747 12.0455 6.52273 12.0455C7.98745 12.0455 9.39217 12.6273 10.4279 13.663C11.4636 14.6987 12.0455 16.1035 12.0455 17.5682C12.0455 19.0329 11.4636 20.4376 10.4279 21.4733C9.39217 22.509 7.98745 23.0909 6.52273 23.0909V23.0909ZM27.3864 15.1136C27.3864 15.1136 22.4773 3.45455 21.8636 2.22727C21.25 1 20.0227 1 19.4091 1C18.7955 1 16.9545 1 16.9545 3.45455V16.9545L27.3864 15.1136Z"
                      stroke="#BCBCBC"
                      stroke-width="2"
                    />
                  </svg>

                  <span>OVERVIEW</span>
                </NavLink>
              </li>
              <li
                className={
                  window.location.pathname.includes("/bonds") === true
                    ? "secondList"
                    : ""
                }
                onClick={() => handleSlide(2)}
              >
                <NavLink to="/bonds" className="sideLink">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 30 40"
                    fill={"#FFF"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0 35V5C0 3.67392 0.526784 2.40215 1.46447 1.46447C2.40215 0.526784 3.67392 0 5 0H25C26.3261 0 27.5979 0.526784 28.5355 1.46447C29.4732 2.40215 30 3.67392 30 5V32.5C30 33.163 29.7366 33.7989 29.2678 34.2678C28.7989 34.7366 28.163 35 27.5 35H2.5C2.5 35.663 2.76339 36.2989 3.23223 36.7678C3.70107 37.2366 4.33696 37.5 5 37.5H28.75C29.0815 37.5 29.3995 37.6317 29.6339 37.8661C29.8683 38.1005 30 38.4185 30 38.75C30 39.0815 29.8683 39.3995 29.6339 39.6339C29.3995 39.8683 29.0815 40 28.75 40H5C3.67392 40 2.40215 39.4732 1.46447 38.5355C0.526784 37.5979 0 36.3261 0 35ZM27.5 5C27.5 4.33696 27.2366 3.70107 26.7678 3.23223C26.2989 2.76339 25.663 2.5 25 2.5H5C4.33696 2.5 3.70107 2.76339 3.23223 3.23223C2.76339 3.70107 2.5 4.33696 2.5 5V32.5H27.5V5ZM7.5 23.125C7.5 22.935 7.53 22.7525 7.5775 22.58C7.94 22.855 8.32 23.105 8.71 23.33C10.6273 24.4204 12.7943 24.9958 15 25C17.455 25 19.6575 24.2675 21.29 23.3275C21.68 23.1025 22.06 22.8525 22.4225 22.58C22.4725 22.755 22.5 22.935 22.5 23.125C22.5 23.875 22.045 24.5 21.675 24.9C21.1962 25.3992 20.6461 25.8247 20.0425 26.1625C18.7425 26.91 16.9675 27.5 15 27.5C13.2321 27.4955 11.4952 27.0348 9.9575 26.1625C9.35323 25.8256 8.80224 25.401 8.3225 24.9025C7.955 24.5 7.5 23.875 7.5 23.125ZM7.5775 17.58C7.52629 17.7571 7.5002 17.9406 7.5 18.125C7.5 18.875 7.955 19.5025 8.325 19.9C8.8038 20.3992 9.35395 20.8246 9.9575 21.1625C11.2575 21.91 13.0325 22.5 15 22.5C16.97 22.5 18.745 21.91 20.0425 21.1625C20.6925 20.7875 21.255 20.3575 21.6775 19.9025C22.045 19.5025 22.5 18.8775 22.5 18.1275C22.5 17.9423 22.4739 17.7579 22.4225 17.58C22.06 17.855 21.68 18.105 21.29 18.33C19.3727 19.4205 17.2057 19.9959 15 20C12.7941 19.9951 10.627 19.4189 8.71 18.3275C8.31704 18.1026 7.93878 17.8529 7.5775 17.58ZM10 12.5C10 11.9675 10.315 11.38 11.2075 10.8625C12.1025 10.3425 13.435 10 15 10C16.565 10 17.8975 10.3425 18.7925 10.8625C19.685 11.38 20 11.9675 20 12.5C20 13.0325 19.685 13.62 18.7925 14.1375C17.8975 14.6575 16.565 15 15 15C13.435 15 12.1025 14.6575 11.2075 14.1375C10.315 13.62 10 13.0325 10 12.5ZM15 7.5C13.1125 7.5 11.32 7.9075 9.9525 8.7C8.585 9.495 7.5 10.7825 7.5 12.5C7.5 14.2175 8.585 15.505 9.9525 16.3C11.32 17.0925 13.1125 17.5 15 17.5C16.8875 17.5 18.68 17.0925 20.0475 16.3C21.415 15.505 22.5 14.2175 22.5 12.5C22.5 10.7825 21.415 9.495 20.0475 8.7C18.68 7.9075 16.8875 7.5 15 7.5Z"
                      fill="white"
                    />
                  </svg>

                  <span>BOND</span>
                </NavLink>
              </li>
              <li
                className={
                  window.location.pathname.includes("/stake") === true
                    ? "thirdList"
                    : ""
                }
                onClick={() => handleSlide(3)}
              >
                <NavLink to="/stake" className="sideLink">
                  <svg
                    width="25"
                    height="25"
                    viewBox="0 0 30 30"
                    fill={"#FFF"}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M23.3856 14.8982C26.9818 14.8982 29.8972 13.242 29.8972 11.199C29.8972 9.15595 26.9818 7.49976 23.3856 7.49976C19.7894 7.49976 16.874 9.15595 16.874 11.199C16.874 13.242 19.7894 14.8982 23.3856 14.8982Z"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M23.4852 17.0262C18.8279 17.0262 16.9736 15.0744 16.9736 13.9438V18.7868C16.9736 20.8304 19.8891 22.4841 23.4852 22.4841C27.085 22.4841 30.0005 20.8304 30.0005 18.7868V14.0601C30.0005 15.1925 28.1444 17.0262 23.4852 17.0262Z"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M23.4852 24.5088C19.3191 24.5088 16.9736 22.6321 16.9736 21.5015V26.2994C16.9736 28.343 19.8891 29.9986 23.4852 29.9986C27.085 29.9986 30.0005 28.343 30.0005 26.2994V21.4434C30.0005 22.5739 27.6531 24.5088 23.4852 24.5088Z"
                      fill="white"
                    />
                    <path
                      d="M7.38154 7.39841C11.4582 7.39841 14.7631 5.74222 14.7631 3.69921C14.7631 1.65619 11.4582 0 7.38154 0C3.30483 0 0 1.65619 0 3.69921C0 5.74222 3.30483 7.39841 7.38154 7.39841Z"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.61591 9.52645C2.33803 9.52645 0.234375 7.57466 0.234375 6.44409V11.287C0.234375 13.3307 3.53985 14.9843 7.61591 14.9843C11.6957 14.9843 14.9993 13.3307 14.9993 11.287V6.56034C14.9993 7.69278 12.8938 9.52645 7.61591 9.52645Z"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.61591 17.0093C2.893 17.0093 0.234375 15.1325 0.234375 14.002V18.7999C0.234375 20.8435 3.53985 22.4991 7.61591 22.4991C11.6957 22.4991 14.9993 20.8435 14.9993 18.7999V13.9438C14.9993 15.0744 12.3369 17.0093 7.61591 17.0093Z"
                      fill="white"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7.61591 24.5088C2.893 24.5088 0.234375 22.6321 0.234375 21.5015V26.2994C0.234375 28.343 3.53985 29.9986 7.61591 29.9986C11.6957 29.9986 14.9993 28.343 14.9993 26.2994V21.4434C14.9993 22.5739 12.3369 24.5088 7.61591 24.5088Z"
                      fill="white"
                    />
                  </svg>

                  <span>STAKE</span>
                </NavLink>
              </li>
              <hr />
              <li>
                <div className="sideLink">
                  <img src={betlogo} width={25} />
                  <a
                    href="https://betswamp.com/app"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <span>DECENTRALIZED BETTING</span>
                  </a>
                </div>
              </li>
              <hr />
              <li>
                <div className="sideLink">
                  <img src={docs} width={20}/>
                  <a href="https://bet-swamp.gitbook.io/betswamp-v.2.0/" target="_blank" rel="noreferrer">
                  <span>&nbsp;DOCS</span></a>
                </div>
              </li>
              <li className="slide" style={TOP}></li>
            </ul>
            {/* {sidebarData.map(({ title, icon, path, special }) => (
              <div
                onClick={() => {
                  setCurrent(path);
                  setSidebar(false);
                  path && history.push(Array.isArray(path) ? path[0] : path);
                }}
                className={tw(
                  "w-full h-[80px] flex pl-[13%] items-center gap-4 cursor-pointer transition-all ease-in-out duration-500 ",
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
                      borderLeft: "5px solid #FF4003",
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
            ))} */}
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
