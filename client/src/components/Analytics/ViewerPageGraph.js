import React, { useEffect, useState } from "react";
import "./styles.css"
import {MonthArray} from "./StaticData";
import ReactTooltip from "react-tooltip";
import axios from "axios";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "../../config";

const ViewerPageGraph = () => {

    const [graphProgress, setGraphProgress] = useState(100)
    const [monthArray, setMonthArray] = useState([]);
    const channelID = useSelector(({ channel }) => channel.id);
    const api = axios.create({
        withCredentials: true,
        baseURL: BACKEND_URL,
        params: {
            channelID,
        },
    });



    useEffect(() => {
        window.addEventListener("resize", () => {
            window.innerWidth < 400 ? setGraphProgress(60) : window.innerWidth < 540 ? setGraphProgress(80) :
                window.innerWidth < 636 ? setGraphProgress(90) : setGraphProgress(100)
        })
        async function loadData() {
            let resData = await api.post(`/api/channels/getMonthlyViews`,{channelID});
            console.log("This is monthly views result --> ",resData)
            if(resData.data.monthlyData.length === 0){
                // setMonthArray(MonthArray)
            }else{
                setMonthArray(resData.data.monthlyData);
            }
        }  
        loadData();
        return () => {
            window.removeEventListener("resize", () => console.log("removed"))
        }
    },[])
    return (<>
        <div className="graph">
            <h3>Monthly Views</h3>
            <p>Past 30 days</p>
            <div className="monthly-graph">
                <div className="amount-stats">
                    <p>100K</p>
                    <p>50K</p>
                    <p>10K</p>
                    <p>0</p>
                </div>
                {monthArray.map((month, key) => {
                    return <div className="stat"><div className="months">

                        <ReactTooltip className="tool-tip" id={`${key}`} place="left" effect="solid" textColor="black" backgroundColor="white">
                            Expenes<br></br>${month.numberOfViews * 1000}
                        </ReactTooltip>
                        <div className="progress" style={{ height: `${(month.numberOfViews * graphProgress) / 100}px` }}></div>
                        <div className="hover-details" >{month.id}</div>
                        <div className="hover-circle-parent" style={{ marginBottom: `${month.numberOfViews - 4}px` }}>
                            <div className="hover-circle-child" data-tip data-for={`${key}`} ></div>
                        </div>
                        {/* </Tooltip> */}
                    </div>
                        <p>{month.month}</p>
                    </div>
                })}
            </div>
            <div className="bottom-border"></div>
        </div>
    </>)
}

export default ViewerPageGraph;