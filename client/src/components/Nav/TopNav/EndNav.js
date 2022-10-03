import React,{useState, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Toolbar, IconButton, Hidden, Tooltip } from "@material-ui/core";
import {setAuth, setChannelInfo,setIsLogin} from "../../../redux/actions/channel"
import axios from "axios";
import {
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Apps as AppsIcon,
  Notifications as NotificationsIcon,
} from "@material-ui/icons";
import {ReactComponent as ConnectWallet} from '../../../assets/connect-wallet.svg'
import { setMobileSearch } from "../../../redux/actions/layout";
import NavUserMenuBtn from "./NavUserMenuBtn";
import NavVidMenuBtn from "./NavVidMenuBtn";
import SignInBtn from "../../SignInBtn";
import MetaMaskOnboarding from "@metamask/onboarding"
import { svg } from "caniuse-lite/data/features";
import Web3 from "web3"
const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingLeft: "0px",
    paddingRight:"9px",
    backgroundColor:"black",
    color:"white",
  },
  walletBtn: {
   padding: "0.2rem",
   width: "23px",
   height: "25px",
  },
  walletText: {
    margin: "10px 1px",
    fontSize: "smaller",
    cursor: "pointer",
  },
  iconButton: {
    backgroundColor: "black",
    color:"white",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "black",
      color:"white",
    },
    "&:focus": {
      outline: "white",
    }
  }
}));


const NavBar = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(({ channel }) => channel.isAuth);
  const id = useSelector(({ channel }) => channel.id);
  const isLogin = useSelector(({ channel }) => channel.isLogin);
  const classes = useStyles();
  const theme = useTheme();

  const [walletStatus,setWalletStatus] = useState("CONNECT WALLET")
  const [accountAddress, setAccountAddress] = useState(null);
  let signature = null
  let message = "Signature message in wallet";
  const onboarding = new MetaMaskOnboarding();

  // const isMetaMaskInstalled = () => {
  //   const { ethereum } = window;
  //   return Boolean(ethereum && ethereum.isMetaMask);
  // };


  // useEffect(()=> {
  //   debugger
  //   connectWallet()
  //   if (accountAddress === null) {
  //     setWalletStatus("CONNECT WALLET")
  //   } 
  //   if (isAuth) {
  //     setWalletStatus("CONNECTED")
  //   }
  //   // walletConnect()
  // },[isAuth])

  useEffect(() => {
     id === null && connectWallet()
    if (id === null) {
      setWalletStatus("CONNECT WALLET")
  } else {
    setWalletStatus("CONNECTED")
  }
  },[isAuth])

  const setConnected = () => {
   setWalletStatus("CONNECTED")
  }

  async function connectWallet() {
    try {
    if (window.ethereum) {
      await window.ethereum.send("eth_requestAccounts");
      window.web3 = new Web3(window.ethereum);
      let accounts = await window.web3.eth.getAccounts();
      let account = accounts[0];
      dispatch(setIsLogin(true))
      setAccountAddress(account)
      walletStatus ==="CONNECT WALLET" && setConnected()
    }
  }
  catch (err) {
    setWalletStatus("CONNECT WALLET")
  }
  }
  async function signMessage() {
    signature = await window.web3.eth.personal.sign(message, accountAddress);
    // dispatch(setAuth(true))
      // dispatch(setChannelInfo({
      //   id: accountAddress, 
      // }))
    console.log("Signature: " + signature);
  }

  const installMetaMask = () => {
    onboarding.startOnboarding();
  }

  // async function getAccount() {
  //   const accounts = await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //   });
  //   const account = accounts[0];
  //   return account;
  // }

  // const walletConnect = () => {
  //   if (
  //     typeof window !== "undefined" &&
  //     typeof window.ethereum !== "undefined"
  //   ) {
  //     getAccount().then((response) => {
  //       setAccountAddress(response);
  //       if (response) {
  //         dispatch(setAuth(true))
  //         dispatch(setChannelInfo({
  //           id: response,
  //         }))
  //       }});
  //   } else {
  //     console.log("error");
  //   }
  // };
  
  return (
    <Toolbar
      classes={{
        gutters: classes.toolbar,
      }}
    >
      <>
        <Hidden smUp>
          <IconButton
            onClick={() => dispatch(setMobileSearch(true))}
            size={theme.breakpoints.up("md") ? "small" : "medium"}
            className={classes.iconButton}
          >
            <SearchIcon />
          </IconButton>
        </Hidden>
        <Tooltip title="Create">
          <NavVidMenuBtn />
        </Tooltip>
        <Hidden smDown>
        
        {!isAuth && (
          <Tooltip title="Notifications">
            <IconButton className={classes.iconButton}>
              <NotificationsIcon />
            </IconButton>
          </Tooltip>
        )}
        </Hidden>

        {/* {isAuth && <NavUserMenuBtn />} */}
        {/* {isAuth || isLogin && (
          <SignInBtn  size={theme.breakpoints.up("md") ? "medium" : "large"} />
        )} */}

        <Tooltip title={`${walletStatus}`} >
          <div style={{display:"flex",marginLeft: "1rem",alignItems:"center",cursor:"pointer",border:"1px solid white",borderRadius: "5px",padding:"2px 2px", marginRight: "1rem"}}>
            <ConnectWallet className={classes.walletBtn}/>
            <p className={classes.walletText} onClick={()=> {
              !window.ethereum && installMetaMask()
              walletStatus === "CONNECTED" && !isAuth && signMessage()
              walletStatus === "CONNECT WALLET" && connectWallet()

            }}>{!window.ethereum ? 'Install Metamask': walletStatus}</p>
          </div>
        </Tooltip>
        {isAuth && <NavUserMenuBtn />}
      </>
    </Toolbar>
  );
};

export default NavBar;