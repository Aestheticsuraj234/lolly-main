import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { List, ListItem, ListItemText } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

import '../../index.css'

import NavItem from "./NavItem";
import categoryIcons from "../categoryIcons";

const useStyles = makeStyles((theme) => ({
  title: {
    padding: theme.spacing(0, 1),
    fontSize: "1em",
    fontWeight: 500,
    color: grey[600],
  },
  bestOfYoutubeIcon: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    zIndex:"10"
  },
  root_h: {
    display: "flex",
    overflowX: "auto",
    justifyContent: "center",
    flexWrap:"wrap"
  },
  spacing_h: { display:"flex",flexDirection:"column",justifyContent:"space-evenly",margin: "1em", backgroundColor:"black",width:"15vw",height:"19vh",borderRadius:"9px" },
  img_h: {
    width: "24px",
    height: "24px",
    borderRadius: "100%",
  },
}));

const SideCategoryMenu = () => {
  const classes = useStyles();
  return (
    <List>
      <ListItem>
        <ListItemText
          classes={{ primary: classes.title }}
        />
      </ListItem>
      {categoryIcons.map((item, index) => {
        return (
          <NavItem
            key={index}
            to={`/trending?category=${index}`}
            title={item.title}
            icon={() => (
              <img
                className={classes.bestOfYoutubeIcon}
                src={item.icon}
                alt={item.title + " logo"}
              />
            )}
          />
        );
      })}
    </List>
  );
};

const HorizontalCategoryMenu = () => {
  const classes = useStyles();
  return (
    <div className={classes.root_h}>
      {categoryIcons.map((item, index) => {
        return (
          <div className={classes.spacing_h} id="explore-resp">
            <NavItem
              key={index}
              to={`/trending?category=${index}`}
              title={item.title}
              type="secondary"
              icon={item.icon}
            />
          </div>
        );
      })}
    </div>
  );
};

export { SideCategoryMenu, HorizontalCategoryMenu };
