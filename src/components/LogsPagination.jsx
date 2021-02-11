import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import firebase from "firebase/app";
import "firebase/analytics";
import 'firebase/database';
import { firebaseConfig } from "./firebaseConfig";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
  logbox: {
    border: "1px solid #4040402e",
    width: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 40,
    alignItems: "flex-start",
    margin: 13,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    color: "#4c4c4c"
  },
  mainbox:{
    height: 385,
    overflow: "hidden",
    width: 523,
    border: "1px solid #4040402e",
    overflowY: "scroll",
    marginTop: 10
  },
  statisticsbox: {
    textAlign: "left",
    marginLeft: 15,
    border: "1px solid #4040402e",
    padding: 10,
    width: 110,
    color: "#4c4c4c",
    backgroundColor: "rgba(0, 0, 0, 0.08)",
  },
  maincontainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  },
  appcontainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    maxWidth: 690,
    border: "1px solid #4040402e",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 20,
    backgroundColor: "rgba(0, 0, 0, 0.03)",
    marginTop: 20
  },
  statisticsheader: {
    textAlign: "center",
    paddingBottom:10
  },
  info: {
    color:"#37df0d"
  },
  warning: {
    color: "#b9ad03"
  },
  error: {
    color:"#fa0303"
  }
}));

function LogsPagination() {
  const classes = useStyles();
  const [page, setPage] = useState(1);
  const [pageTotal, setPageTotal] = useState(0);
  const [pageData, setPageData] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const [infoNum, setInfoNum] = useState(0);
  const [warningNum, setWarningNum] = useState(0);
  const [errorNum, setErrorNum] = useState(0);
  !firebase.apps.length ? firebase.initializeApp(firebaseConfig) : firebase.app()
  const refData = firebase.database().ref().child("data");

  const handleSetPages = useCallback(() => {
    if(firstRender){
      refData.child("logs").on("value", (snapshot) => {
        setPageTotal(snapshot.val().length);
      });
      refData.child("logs").orderByValue().limitToFirst(1).on("value", (snapshot) => {
      const data = JSON.stringify(snapshot.val(), null, 2);
      setPageData(data);
      });
      console.log("handleSetPages ", JSON.parse(pageData));
      setFirstRender(false);
    };
  }, [refData, pageData, firstRender]);

  useEffect(() =>{
     let info = 0;
     let warning = 0;
     let error = 0;
     handleSetPages();
      pageData && JSON.parse(pageData).map((item) => {
        if(item.message.split(" ").includes("INFO")) {
         info++;
        }
        if(item.message.split(" ").includes("WARN")) {
          warning++;
        }
        if(item.message.split(" ").includes("ERROR")) {
         error++;
        }
        return null;
      });
       setInfoNum(info);
       setWarningNum(warning);
       setErrorNum(error);
  },[handleSetPages, pageData, page]);

  const handleChange = (event, value) => {
    setPage(value);
    console.log("value", value);
    refData.child("logs").orderByValue().limitToFirst(value+1).on("value", (snapshot) => {
    const data = JSON.stringify(snapshot.val(), null, 2);
    setPageData(data);
    });
  };

  return (
    <div className={classes.root}>
      <div className={classes.appcontainer}>
        <div className={classes.maincontainer}>
          <div className={classes.mainbox}>
            {pageData && JSON.parse(pageData).map((item , index) => (
              <div key={index} className={classes.logbox}>
                <Typography><span>Date:</span> {item.date}</Typography>
                <Typography><span>Severity:</span> {item.severity}</Typography>
                <Typography><span>Message:</span>{item.message}</Typography>
              </div>
            ))}
          </div>
          <Pagination count={pageTotal} page={page} onChange={handleChange} />
        </div>
        <div className={classes.statisticsbox}>
          <div className={classes.statisticsheader}>- statistics -</div>
          <div><span>INFO:</span><span className={classes.info}>{infoNum}</span></div>
          <div><span>WARNING:</span><span className={classes.warning}>{warningNum}</span></div>
          <div><span>ERROR:</span><span className={classes.error}>{errorNum}</span></div>
        </div>
      </div>
    </div>
  );
}

export default LogsPagination;
