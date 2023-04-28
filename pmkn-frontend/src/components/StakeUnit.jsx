import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function StakeUnit(props) {
    const [input, setInput] = useState()
    const [tokenName, setName] = useState()
    const [userBalance, setUserBalance] = useState()

    const connectedContract = props.token.connect(props.provider)

    useEffect(() => {
        setup()
    }, [])

    async function setup() {
        const tokenName =  await connectedContract.name()
        const walletBalance = await connectedContract.balanceOf(props.walletInfo.address)
        setName(tokenName)
        setUserBalance(ethers.utils.formatEther(walletBalance))
    }

    return (
        <div className="stakeunit">
            <h1>{tokenName}</h1>
            <p>Balance: {parseFloat(userBalance).toFixed(6)}</p>
            <div>
                <input type="number" /> 
                <button>Max</button>
            </div>
            <br />
            <button onClick={() => props.handleStake(input)}>Stake</button>

        </div>
    )
}