import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import clsx from "clsx";
import { ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  active: {
    backgroundColor: "#222327",
    color: "white",
    "&:hover": { backgroundColor: "#222327"},
  },
  ListBackground: {
   "&:hover" :{ backgroundColor: "#222327"},
  },
  icon: {
    padding: theme.spacing(0, 1),    
    color:"#626366",
    fontSize: "1.2rem"
  },
  iconActive: {
    color: "white",
  },
  text: {
    color: "#626366" /* blue colors for links too */,
    textDecoration: "none" /* no underline */,
    textAlign: "center",
    "&:hover": {
      color: "inherit" /* blue colors for links too */,
      textDecoration: "none" /* no underline */,
    },
  },
  img_h: {
    width: "60px",
    height: "60px",
  },
}));
const CircleItem = ({ children, title }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div
      style={{
        width: "80px",
        height: "80px",
      }}
    >
      {children}
    </div>
    <div>{title}</div>
  </div>
);
const NavItem = ({ to, title,icon, onClick, disableActive, type }) => {
  const classes = useStyles();
  const location = useLocation();
  const isActive =
    location.pathname === "/trending"
      ? location.pathname + location.search === to
      : location.pathname === to;
  // const Icon = icon;
  // console.log(icon)
  
  const Item =
    type === "secondary" ? (
      <CircleItem title={title}>
      {/* <FontAwesomeIcon icon={icon}></FontAwesomeIcon> */}
      <img
          className={classes.img_h}
          src={icon}
          alt={"logo"}
      />
      </CircleItem>
    ) : (
      <ListItem
        button
        onClick={onClick}
        className={isActive ? `${classes.active} ${classes.ListBackground}` : classes.ListBackground}
      >
        <ListItemIcon
          className={clsx(classes.icon, {
            [classes.iconActive]: isActive && !disableActive,
          })}
        >
        <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
        </ListItemIcon>
        <ListItemText primary={title} />
      </ListItem>
    );
  return to ? (
     <NavLink to={to} className={isActive ? `${classes.active} ${classes.text}` : classes.text}>
      {Item}
    </NavLink>
  ) : (
    <> {Item} </>
  );
};

export default NavItem;
