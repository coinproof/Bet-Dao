import { useMediaQuery } from "@material-ui/core";
import CssBaseline from "@material-ui/core/CssBaseline";
import { makeStyles, ThemeProvider } from "@material-ui/core/styles";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useHistory,
  useLocation,
} from "react-router-dom";
import Messages from "./components/Messages/Messages";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
// import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import { storeQueryParameters } from "./helpers/QueryParameterHelper";
import useBonds from "./hooks/Bonds";
import useGoogleAnalytics from "./hooks/useGoogleAnalytics";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";
import useTheme from "./hooks/useTheme";
import { useAddress, useWeb3Context } from "./hooks/web3Context";
import {
  calculateUserBondDetails,
  loadAccountDetails,
} from "./slices/AccountSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { calcBondDetails } from "./slices/BondSlice";
import "./style.scss";
import { dark as darkTheme } from "./themes/dark.js";
// import { Bond, ChooseBond, Presale, Stake, TreasuryDashboard } from "./views";
// import NotFound from "./views/404/NotFound";
// import BetSlip from "./views/Betslip/Betslip";
// import Calculator from "./views/Calculator/Calculator";
// import CreateEvent from "./views/CreateEvent/CreateEvent";
// import History from "./views/CreateEvent/History";
// import Page2 from "./views/CreateEvent/Page2";
// import Page3 from "./views/CreateEvent/Page3";
// import Page4 from "./views/CreateEvent/Page4";
// import SelfHelp from "./views/SelfHelp/SelfHelp";
// import ValidatePage2 from "./views/ValidateEvents/Page2";
// import ValidateEvents from "./views/ValidateEvents/ValidateEvents";

import {
  REUIBetSlip,
  REUIStake,
  REUIBond,
  REUIChooseBond,
  REUIOverview,
} from "./re-ui/pages";
import Dashboard from "./re-ui/layouts/dashboard";

// 😬 Sorry for all the console logging
const DEBUG = false;

// 🛰 providers
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");
// 🔭 block explorer URL
// const blockExplorer = targetNetwork.blockExplorer;

const drawerWidth = 280;
const transitionDuration = 969;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: transitionDuration,
    }),
    height: "100%",
    overflow: "auto",
    marginLeft: drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: transitionDuration,
    }),
    marginLeft: 0,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
}));

function App() {
  useGoogleAnalytics();
  useSegmentAnalytics();
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const location = useLocation();
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const history = useHistory();
  const { connect, hasCachedProvider, provider, chainID, connected } =
    useWeb3Context();
  const address = useAddress();

  const [walletChecked, setWalletChecked] = useState(false);

  const isAppLoading = useSelector((state) => state.app.loading);
  const isAppLoaded = useSelector(
    (state) => typeof state.app.marketPrice != "undefined"
  ); // Hacky way of determining if we were able to load app Details.
  const { bonds } = useBonds();
  async function loadDetails(whichDetails) {
    // NOTE (unbanksy): If you encounter the following error:
    // Unhandled Rejection (Error): call revert exception (method="balanceOf(address)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)
    // it's because the initial provider loaded always starts with chainID=1. This causes
    // address lookup on the wrong chain which then throws the error. To properly resolve this,
    // we shouldn't be initializing to chainID=1 in web3Context without first listening for the
    // network. To actually test rinkeby, change setChainID equal to 4 before testing.
    let loadProvider = provider;

    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && connected) {
      loadAccount(loadProvider);
    }
  }

  const loadApp = useCallback(
    (loadProvider) => {
      dispatch(loadAppDetails({ networkID: chainID, provider: loadProvider }));
      bonds.map((bond) => {
        dispatch(
          calcBondDetails({
            bond,
            value: null,
            provider: loadProvider,
            networkID: chainID,
          })
        );
      });
    },
    [connected]
  );

  const loadAccount = useCallback(
    (loadProvider) => {
      dispatch(
        loadAccountDetails({
          networkID: chainID,
          address,
          provider: loadProvider,
        })
      );
      bonds.map((bond) => {
        dispatch(
          calculateUserBondDetails({
            address,
            bond,
            provider,
            networkID: chainID,
          })
        );
      });
    },
    [connected]
  );

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
      });
    } else {
      // then user DOES NOT have a wallet
      setWalletChecked(true);
    }

    // We want to ensure that we are storing the UTM parameters for later, even if the user follows links
    storeQueryParameters();
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      loadDetails("app");
    }
  }, [walletChecked]);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (connected) {
      loadDetails("account");
    }
  }, [connected]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  let themeMode =
    theme === "light" ? darkTheme : theme === "dark" ? darkTheme : darkTheme;

  useEffect(() => {
    themeMode = theme === "light" ? darkTheme : darkTheme;
  }, [theme]);

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);
  const path = useMemo(
    () => window.location.pathname,
    [window.location.pathname]
  );

  return (
    <Router>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Messages />

        <Switch>
          {/* Re-ui pages */}

          <Route exact path={["/dashboard", "/"]} component={REUIOverview} />

          <Route path="/stake" component={REUIStake} />
          <Route path="/betslip" component={REUIBetSlip} />
          <Route exact path="/bonds">
            <REUIChooseBond />
          </Route>

          {bonds.map((bond) => {
            return (
              <Route exact key={bond.name} path={`/bonds/${bond.name}`}>
                <REUIBond bond={bond} />
              </Route>
            );
          })}
          {/* {isAppLoading && <LoadingSplash />} */}

          {/* <Route
            path="/"
            render={({ match }) => {
              return (
                <div
                  className={`app ${isSmallerScreen && "tablet"} ${
                    isSmallScreen && "mobile"
                  } light`}
                >
                  {path === "/" ? null : (
                    <TopBar
                      theme={theme}
                      toggleTheme={toggleTheme}
                      handleDrawerToggle={handleDrawerToggle}
                    />
                  )}
                  {path === "/" ? null : (
                    <nav className={classes.drawer}>
                      {isSmallerScreen ? (
                        <NavDrawer
                          mobileOpen={mobileOpen}
                          handleDrawerToggle={handleDrawerToggle}
                        />
                      ) : (
                        <Sidebar />
                      )}
                    </nav>
                  )}

                  <div
                    className={`${path === "/" ? null : classes.content} ${
                      isSmallerScreen && classes.contentShift
                    }`}
                  >
                    <Switch>
                      <Route exact path="/dashboard">
                        <TreasuryDashboard />
                      </Route>
                      <Route path="/stake">
                        <Stake />
                      </Route>
                     
                      <Route exact path="/">
                        <Redirect to="dashboard" />
                      </Route>
                      <Route path="/presale">
                        <Presale />
                      </Route>
                      <Route path="/calculator">
                        <Calculator />
                      </Route>
                      <Route path="/bonds">
                        {bonds.map((bond) => {
                          return (
                            <Route
                              exact
                              key={bond.name}
                              path={`/bonds/${bond.name}`}
                            >
                              <Bond bond={bond} />
                            </Route>
                          );
                        })}
                        <ChooseBond />
                      </Route>
                      <Route path="/betslip">
                        <BetSlip />
                      </Route>
                      <Route path="/createevent">
                        <CreateEvent />
                      </Route>
                      <Route path="/createevent_history">
                        <History />
                      </Route>
                      <Route path="/createevent_page2">
                        <Page2 />
                      </Route>
                      <Route path="/createevent_page3">
                        <Page3 />
                      </Route>
                      <Route path="/createevent_page4">
                        <Page4 />
                      </Route>
                      <Route path="/validateevents">
                        <ValidateEvents />
                      </Route>
                      <Route path="/validateevent_page2">
                        <ValidatePage2 />
                      </Route>
                      <Route path="/selfhelp">
                        <SelfHelp />
                      </Route>

                      <Route component={NotFound} />
                    </Switch>
                  </div>
                </div>
              );
            }}
          /> */}
        </Switch>
      </ThemeProvider>
    </Router>
  );
}

export default App;
