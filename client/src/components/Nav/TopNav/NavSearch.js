import React, { useState } from "react";
import { grey } from "@material-ui/core/colors";
import { makeStyles } from "@material-ui/core/styles";
import { InputBase, Tooltip } from "@material-ui/core";
import { Search as SearchIcon } from "@material-ui/icons";
import { withRouter } from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  searchButton: {
    color: grey[700],
    backgroundColor: grey[500],
    "&:hover": {
      //you want this to be the same as the backgroundColor above
      backgroundColor: grey[500],
    },
    "&:focus": {
      outline: "none",
    },
    borderLeftStyle: "solid",
    borderLeftWidth: "1px",
    borderLeftColor: grey[300],

    borderRadius: 0,
  },
  border: {
    borderColor: grey[700],
    borderStyle: "solid",
    borderWidth: "1px",
    borderRadius: 3,
  },
  searchForm: {
    display: 'grid',
    gridTemplateColumns: '10% 90%',
    // backgroundColor: "#222329",
    width: "40%",
    padding: "0.2rem",
    [theme.breakpoints.only('lg')]: {
      marginLeft: '3rem',
      },
      [theme.breakpoints.only('md')]: {
        marginLeft: '3.5rem',
      },
      [theme.breakpoints.only('sm')]: {
        marginLeft: '8rem',
      },
  },
  input: {
    padding: theme.spacing(0, 1),
    color: "white"
  },
}));

const MiddleNav = ({ history }) => {
  const [searchValue, setSearch] = useState("");
  const classes = useStyles();



  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  return (
    <div className={`${classes.searchForm} ${classes.border}`} >
         <Tooltip title="Search">
            {/* <Button
              disableRipple
              size=""
              type="submit"
              className={classes.searchButton}
              onClick={handleSearch}
              aria-label="search"
            >
            </Button> */}
            <SearchIcon fontSize="small" style={{fill:"white"}} />
          </Tooltip>
      <InputBase
        fullWidth
        value={searchValue}
        onChange={handleSearchChange}
        // className={classes.border}
        classes={{
          input: classes.input,
        }}
        placeholder="Search a video"
        inputProps={{ "aria-label": "search" }}
      />
    </div>
  );
};

export default withRouter(MiddleNav);
