import React from "react";
import { useDispatch,useSelector } from "react-redux";

import { List, useMediaQuery, useTheme } from "@material-ui/core";
import { Home as HomeIcon, Whatshot as TrendingIcon } from "@material-ui/icons";
import { faHome,faCompass,faChartLine,faPlayCircle,faCog} from '@fortawesome/free-solid-svg-icons'
import NavItem from "../NavItem";
import { toggleDrawer } from "../../../redux/actions/layout";

const MainNavMenu = () => {
  const theme = useTheme();
  const id = useSelector(({ channel }) => channel.id);
  const isMinScreenMd = useMediaQuery(theme.breakpoints.up("md"));
  const dispatch = useDispatch();
  const handleItemClick = () => {
    if (!isMinScreenMd) {
      dispatch(toggleDrawer(isMinScreenMd));
    }
  };

  return (
    <List style={{paddingTop: "40px"}}>
      {[
        {
          title: "Home",
          icon: faHome,
          path: "/",
        },
        {
          title: "Explore",
          icon: faCompass,
          path: "/trending",
        },
        {
          title: "Creator Rewards",
          icon: faChartLine,
          path: "/subscriptions",
        },
        {
          title: "Your Videos",
          icon: faPlayCircle,
          path: `/channel/${id}`,
        },
        {
          title: "Settings",
          icon: faCog,
          path: "/history",
        }
      ].map((item, index) => {
        return (
          <React.Fragment key={index}>
            <NavItem
              to={item.path}
              title={item.title}
              icon={item.icon}
              onClick={handleItemClick}
            />
          </React.Fragment>
        );
      })}
    </List>
  );
};

export default MainNavMenu;
