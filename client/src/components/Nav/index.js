import React from "react";
import TopNav from "./TopNav";
import { makeStyles } from "@material-ui/core/styles";
import {useLocation} from "react-router-dom"

import SideNav from "./SideNav";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor:"#222327",
    color:"white",
    display: "flex",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    overflow: "hidden",
  },
  subBackground: {
    backgroundColor: "#1E1240",
  },
  toolbar: {
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
}));
const NavBar = ({ children }) => {
  const classes = useStyles();
  const location = useLocation()
  console.log("location", location.pathname)
  return (
    <div className={classes.root}>
      <TopNav />
      <SideNav />
      <div className={`${classes.content} ${location.pathname === "/subscriptions" && classes.subBackground}`}>
        <div className={classes.toolbar} />
        {children}
      </div>
    </div>
  );
};

export default NavBar;
