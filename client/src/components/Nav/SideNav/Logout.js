import React from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { List, useMediaQuery, useTheme } from "@material-ui/core";
import { Whatshot as TrendingIcon } from "@material-ui/icons";
import { faSignOutAlt} from '@fortawesome/free-solid-svg-icons'
import NavItem from "../NavItem";
import { toggleDrawer } from "../../../redux/actions/layout";
import {setAuth, setChannelInfo} from "../../../redux/actions/channel"
import { useSelector } from "react-redux";
import {logoutChannel} from "../../../redux/actions/channel"

function Logout() {
    const theme = useTheme();
    const isMinScreenMd = useMediaQuery(theme.breakpoints.up("md"));
    const dispatch = useDispatch();
    const isAuth = useSelector(({ channel }) => channel.isAuth);
    const handleItemClick = () => {
      
    logoutChannel()(dispatch)
      if (!isMinScreenMd) {
        dispatch(toggleDrawer(isMinScreenMd));
      }
    };
  
    return (
      <List style={{position:"absolute",bottom:"10px",width:"100%"}}>
        {[
          {
            title: "Logout",
            icon: faSignOutAlt,
            path: "/sdfsd",
          }
        ].map((item, index) => {
          return (
            <React.Fragment key={index}>
       { isAuth && <NavItem
                to={item.path}
                title={item.title}
                icon={item.icon}
                onClick={handleItemClick}
              />}
            </React.Fragment>
          );
        })}
      </List>
    );
  };

export default Logout