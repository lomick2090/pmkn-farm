import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function StakeUnit(props) {
    const [input, setInput] = useState('')
    const [tokenName, setName] = useState()
    const [userBalance, setUserBalance] = useState()

    const connectedFarmContract = props.farmContract.connect(props.walletInfo.signer)
    const connectedTokenContract = props.token.connect(props.provider)

    useEffect(() => {
        setup()
    }, [props.walletInfo])

    function handleChange(e) {
        const {value} = e.target
        setInput(value)
    }

    async function setMax() {
        setInput(userBalance)
    }

    async function setup() {
        const tokenName =  await connectedTokenContract.name()
        const walletBalance = await connectedTokenContract.balanceOf(props.walletInfo.address)
        setName(tokenName)
        setUserBalance(ethers.utils.formatEther(walletBalance))
    }

    return (
        <div className="stakeunit">
            <h1>{tokenName}</h1>
            <p>Balance: {parseFloat(userBalance).toFixed(6)}</p>
            <div>
                <input type="number" value={input} onChange={handleChange} /> 
                <button onClick={setMax}>Max</button>
            </div>
            <br />
            <button onClick={() => props.handleStake(ethers.utils.parseEther(input))}>Stake</button>

        </div>
    )
}