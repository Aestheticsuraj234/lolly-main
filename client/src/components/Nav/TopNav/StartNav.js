import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Toolbar, useMediaQuery, IconButton } from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

import { NavLink } from "react-router-dom";
import { setDrawer, toggleDrawer } from "../../../redux/actions/layout";
import lollyLogo from "../../../assets/lolly-logo.jpeg";

const useStyles = makeStyles((theme) => ({
  lollyLogo: {
    height: "25px",
    width:"120px",
    padding: theme.spacing(0, 1),
    [theme.breakpoints.up("md")]: {
      height: "25px",
    },
  },
  toolbar: {
    paddingRight: "0px",
  },
  iconButton: {
    backgroundColor: "black",
    color: "white",
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: "black",
      color: "white",
    },
    "&:focus": {
      outline: "white",
    },
  },
}));

const StartNav = ({ mobile }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();
  const isMinScreenLg = useMediaQuery(theme.breakpoints.up("lg"));

  useEffect(() => {
    if (!mobile) dispatch(setDrawer(isMinScreenLg));
  });

  return (
    <Toolbar
      classes={{
        gutters: classes.toolbar,
      }}
    >
      <IconButton
        aria-label="open drawer"
        edge="start"
        className={classes.iconButton}
        onClick={() => dispatch(toggleDrawer())}
      >
        <MenuIcon />
      </IconButton>
      <NavLink to="/">
        <img
          src={lollyLogo}
          className={classes.lollyLogo}
          alt="YouTube logo"
        />
      </NavLink>
    </Toolbar>
  );
};

export default StartNav;
