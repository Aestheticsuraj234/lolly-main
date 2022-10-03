import React, { useEffect, useState } from "react";
import "./styles.css"
// import { rewardData } from "./StaticData"
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import { useMoralis } from "react-moralis";
import Moralis from "moralis";
// import { useMoralisQuery } from "react-moralis";
// attributes.accounts[0]

const CreatorRewards = () => {

    const [lastThreeTansfer,setLastThreeTransfer] = useState([])
    const [lastThreeRecieve,setLastThreeRecieve] = useState([])
    const login = async () => {
        const user = await Moralis.authenticate({signingMessage: "Log in using Moralis" })
    }
      
    const getData = async()=>{

        const currentUser = Moralis.User.current();
        console.log("thsi is user ->", currentUser.attributes.accounts[0])
        console.log("Current user is : ", )
        let query1 = new Moralis.Query("EthTransactions")
        let query2 = new Moralis.Query("EthTransactions")
        query1.equalTo("from_address",currentUser.attributes.accounts[0])
        query2.equalTo("to_address",currentUser.attributes.accounts[0])
        query1.limit(3)
        query2.limit(3)
        const res1 = await query1.find()
        const res2 = await query2.find()
        setLastThreeTransfer(res1)
        setLastThreeRecieve(res2)
        console.log("this si res", res1)
        console.log("this si res", res2)
    }
    useEffect(()=>{
          login()
    },[])
    
    // when account will be changed
    window.ethereum.on("accountsChanged",(accounts)=>{
        console.log("accounts i schanged")
        getData()
    })
    // when network will be changed
    window.ethereum.on('chainChanged', chainId => {
        console.log("chain i schanged")
        getData()
    })

    return (<>
        <div className="rewards">
            <h3>Creator Reward History</h3>
            <p>Past 6 months</p>
            <div className="reward-history">
                {
                    
                    lastThreeTansfer.map((reward, key) => {
                        // return <ul className={reward.isWithdrawed ? "is-deposited" : ""}>
                        // return(
                        //     <ul className ="is-deposited" >
                        //         <li className="date">{reward.attributes.createdAt}</li>
                        //         <li className="time">{reward.attributes.createdAt}</li>
                        //         <li className="amount">{reward.attributes.decimal.value.$numberDecimal} ETH</li>
                        //         {/* <li className="status">{reward.isWithdrawed}</li> */}
                        //     </ul>)
                        return(
                            <ul className ="is-deposited" >
                                <li className="date">{reward.createdAt.toLocaleDateString()}</li>
                                <li className="time">{reward.createdAt.toLocaleTimeString()}</li>
                                <li className="amount">{Web3.utils.fromWei(reward.attributes.value,"ether")} ETH</li>
                                <li className="status">{reward.attributes.confirmed? "sent": ""}</li>
                            </ul>)

                    })
                }
                {   lastThreeRecieve.map((reward, key) => {
                        return(
                            <ul className ="is-deposited" >
                                <li className="date">{reward.createdAt.toLocaleDateString()}</li>
                                <li className="time">{reward.createdAt.toLocaleTimeString()}</li>
                                <li className="amount">{Web3.utils.fromWei(reward.attributes.value,"ether")} ETH</li>
                                <li className="status">{reward.attributes.confirmed? "recieved": ""}</li>
                            </ul>)

                    })
                }
                
            </div>
            
        </div>
    </>)
}

export default CreatorRewards;
