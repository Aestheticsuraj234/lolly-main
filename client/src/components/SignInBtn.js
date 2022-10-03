import React from "react";
import { blue } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import { AccountCircle as AccountIcon } from "@material-ui/icons";
import urlJoin from "url-join";
import { useSelector } from "react-redux";

import { BACKEND_URL } from "../config";

const handleClick = () => {
  window.location.assign(urlJoin(BACKEND_URL, "/api/auth/google"));
};

const useStyles = makeStyles((theme) => ({
  signButton: {
    color: blue[800],
    borderColor: blue[800],
    borderRadius: "3px",
  },
}));

const SignInBtn = ({ size }) => {
  const classes = useStyles();
  const isAuth = useSelector(({ channel }) => channel.isAuth);
  return (
    <Button
      size={size}
      variant="outlined"
      className={classes.signButton}
      startIcon={<AccountIcon />}
      onClick={handleClick}
    >
      Sign In
    </Button>
  );
};

export default SignInBtn;
