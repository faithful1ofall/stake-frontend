import React, {useContext, useState} from "react";
import BlockchainContext from "../context/BlockchainContext";

import DisplayContext from "../context/DisplayContext";

import TimeLeftField from "./UserPanel/TimeLeftField";

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';



export default function UserPanel() {
    const blockchainContext = useContext(BlockchainContext);
    const displayContext = useContext(DisplayContext);
    const { web3, accounts, stakerContract, depositTokenContract, stakerContract1, depositTokenContract1 } = blockchainContext;
    const {userDetails, userDetails1, refreshUserDetails, onInputNumberChange, isNonZeroNumber, toast} = displayContext;

    const [inputStake, setInputStake] = useState('');
    const [inputUnstake, setInputUnstake] = useState('');
    const [inputStake1, setInputStake1] = useState('');
    const [inputUnstake1, setInputUnstake1] = useState('');


    async function deposit() {
        if (!isNonZeroNumber(inputStake)) {
            toast.error('No amount entered.');
            return;
        }
        if (parseFloat(inputStake) > parseFloat(userDetails["depositTokenBalance"])) {
            console.log(typeof inputStake);
            toast.error("Not enough balance.");
            return;
        }
        toast.dismiss();
        let amount = web3.utils.toWei(inputStake.toString());
        try {
            toast.info('Please approve transaction 1 of 2 (allowance)...', {position: 'top-left', autoClose: false});
            await depositTokenContract.methods.approve(stakerContract.options.address, amount.toString()).send({ from: accounts[0] });
            toast.dismiss();
            toast.info('Please approve transaction 2 of 2 (staking)...', {position: 'top-left', autoClose: false});
            await stakerContract.methods.deposit(amount).send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        setInputStake("");
        await refreshUserDetails();
    }
    async function deposit1() {
        if (!isNonZeroNumber(inputStake1)) {
            toast.error('No amount entered.');
            return;
        }
        if (parseFloat(inputStake1) > parseFloat(userDetails1["depositTokenBalance"])) {
            console.log(typeof inputStake1);
            toast.error("Not enough balance.");
            return;
        }
        toast.dismiss();
        let amount = web3.utils.toWei(inputStake1.toString());
        try {
            toast.info('Please approve transaction 1 of 2 (allowance)...', {position: 'top-left', autoClose: false});
            await depositTokenContract1.methods.approve(stakerContract1.options.address, amount.toString()).send({ from: accounts[0] });
            toast.dismiss();
            toast.info('Please approve transaction 2 of 2 (staking)...', {position: 'top-left', autoClose: false});
            await stakerContract1.methods.deposit(amount).send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        setInputStake1("");
        await refreshUserDetails();
    }
    
      
    async function withdraw() {
        if (!isNonZeroNumber(inputUnstake)) {
            toast.error('No amount entered.');
            return;
        }
        if (parseFloat(inputUnstake) > parseFloat(userDetails["deposited"])) {
            toast.error("Can't unstake more than staked.");
            return;
        }
        toast.dismiss();
        let amount = web3.utils.toWei(inputUnstake.toString());
        toast.info('Please approve transaction...', {position: 'top-left', autoClose: false});
        try {
            await stakerContract.methods.withdraw(amount).send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        setInputUnstake("");
        await refreshUserDetails();
    }
    async function withdraw1() {
        if (!isNonZeroNumber(inputUnstake1)) {
            toast.error('No amount entered.');
            return;
        }
        if (parseFloat(inputUnstake1) > parseFloat(userDetails1["deposited"])) {
            toast.error("Can't unstake more than staked.");
            return;
        }
        toast.dismiss();
        let amount = web3.utils.toWei(inputUnstake1.toString());
        toast.info('Please approve transaction...', {position: 'top-left', autoClose: false});
        try {
            await stakerContract1.methods.withdraw(amount).send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        setInputUnstake1("");
        await refreshUserDetails();
    }
    
    async function claim() {
        toast.dismiss();
        toast.info('Please approve transaction...', {position: 'top-left', autoClose: false});
        try {
            await stakerContract.methods.claim().send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        await refreshUserDetails();
    }
    async function claim1() {
        toast.dismiss();
        toast.info('Please approve transaction...', {position: 'top-left', autoClose: false});
        try {
            await stakerContract1.methods.claim().send({ from: accounts[0] });
        } finally {
            toast.dismiss();
        }
        await refreshUserDetails();
    }


    function numberToFixed(n) {
        if (n === undefined)
            return n;
        return parseFloat(n).toFixed(6);
    }
    

    const CardKeyValue = (props) => (
        <>
        <div className="card-key-value">
            <div>
            {props.label}
            </div>
            <div>
            {props.value}
            </div>
        </div><hr/>
        </>
    );

    const RewardsPhaseFinished = (props) => (
        <>
        <div className="two-line-label">
            <div>Staking reward period finished</div>
            <div>Please check back later for the next phase</div>
        </div><hr/>
        </>
    );

    const RewardsPhaseActive = (props) => (
        <>

            <TimeLeftField />

            
           
            <CardKeyValue label="Your staked" value={numberToFixed(userDetails["deposited"])} />
            
        </>
    );
    const RewardsPhaseActive1 = (props) => (
        <>

            <TimeLeftField />

            
           
            <CardKeyValue label="Your staked" value={numberToFixed(userDetails1["deposited1"])} />
            
        </>
    );
    const tokenAddress = '0xB90b2fc43601714e4828cEB9090196b00C3d60C1';
    const tokenSymbol = 'MUT';
    const tokenDecimals = 18;
    const tokenImage = 'http://placekitten.com/200/300';

    async function addTokenFunction() {
    try {
      // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded =await window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20', // Initially only supports ERC20, but eventually more!
          options: {
            address: tokenAddress, // The address that the token is at.
            symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
            decimals: tokenDecimals, // The number of decimals in the token
            image: tokenImage, // A string url of the token logo
          },
        },
      });
      
    
      if (wasAdded) {
        console.log('Thanks for your interest!');
      } else {
        console.log('Your loss!');
      }
    } catch (error) {
      console.log(error);
    }
    }
    return (
        <>
            <Container className="square inner-container" >
                <br/>
                <div className="two-line-label">
            <div>Stake MUT Earn MUT</div>
            </div>
            <CardKeyValue label="Estimated Apr in %"  value={  150.23+"%"} ></CardKeyValue> 
                {isNonZeroNumber(userDetails["rewardPerDay"])? <RewardsPhaseActive /> : <RewardsPhaseFinished/>}
                <br/><br/>
                <div className="label-above-button">
                    Available {userDetails["depSymbol"]} balance to stake: {userDetails["depositTokenBalance"]}
                </div>
                <div className="input-button-container">
                    <div>
                        <Form.Control placeholder="Amount" value={inputStake} onChange={(e) => {onInputNumberChange(e, setInputStake)}}/>
                    </div>
                    <div>
                        <OverlayTrigger
                        placement="right"
                        overlay={userDetails["pending"] > 0 ? <Tooltip >The Actual APR will be varied with the TVL and the time to staking</Tooltip> : <></>}>
                            <Button onClick={deposit} >Stake</Button>
                        </OverlayTrigger>
                    </div>
                </div><br/>

                <div className="label-above-button">
                    {userDetails["depSymbol"]} staked: {userDetails["deposited"]}
                </div>
                <div className="input-button-container">
                    <div>
                        <Form.Control disabled placeholder="Amount" value={inputUnstake} onChange={(e) => {onInputNumberChange(e, setInputUnstake)}}/>
                    </div>
                    <div>
                        <OverlayTrigger
                        placement="right"
                        overlay={userDetails["pending"] > 0 ? <Tooltip ></Tooltip> : <></>}>
                            <Button type="button" disabled onClick={withdraw} >Unstake</Button>
                        </OverlayTrigger>
                    </div>
                </div><br/>

               
                <div className="button-stretch">
                    <Button type="button" disabled onClick={claim} >Claim rewards</Button>
                </div>
                <br/>
                </Container>



                <Container className="square inner-container" >
                <br/>
                <div className="two-line-label">
            <div>Stake MUT-CET LP Earn MUT</div>
            </div>
            <CardKeyValue label="Estimated Apr in %"  value={  80.23+"%"} ></CardKeyValue> 
                {isNonZeroNumber(userDetails1["rewardPerDay1"])? <RewardsPhaseActive1 /> : <RewardsPhaseFinished/>}
                <br/><br/>
                <div className="label-above-button">
                    Available {userDetails1["depSymbol1"]} balance to stake: {userDetails1["depositTokenBalance1"]}
                </div>
                <div className="input-button-container">
                    <div>
                        <Form.Control placeholder="Amount" value={inputStake1} onChange={(e) => {onInputNumberChange(e, setInputStake1)}}/>
                    </div>
                    <div>
                        <OverlayTrigger
                        placement="right"
                        overlay={userDetails1["pending1"] > 0 ? <Tooltip >The Actual APR will be varied with the TVL and the time to staking</Tooltip> : <></>}>
                            <Button onClick={deposit1} >Stake LP</Button>
                        </OverlayTrigger>
                    </div>
                </div><br/>

                <div className="label-above-button">
                    {userDetails1["depSymbol1"]} staked: {userDetails1["deposited1"]}
                </div>
                <div className="input-button-container">
                    <div>
                        <Form.Control disabled placeholder="Amount" value={inputUnstake1} onChange={(e) => {onInputNumberChange(e, setInputUnstake1)}}/>
                    </div>
                    <div>
                        <OverlayTrigger
                        placement="right"
                        overlay={userDetails1["pending"] > 0 ? <Tooltip ></Tooltip> : <></>}>
                            <Button type="button" disabled onClick={withdraw1} >Unstake</Button>
                        </OverlayTrigger>
                    </div>
                </div><br/>

               
                <div className="button-stretch">
                    <Button type="button" disabled onClick={claim1} >Claim rewards for LP</Button>
                </div>
                <div className="button-stretch">
                    <br/><Button type="button" onClick={addTokenFunction} >Add MUT to Metamask</Button><br/>
                </div>
                <br/>
                </Container>
        </>
    )
}