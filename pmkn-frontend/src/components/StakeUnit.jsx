import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function StakeUnit(props) {
    const [input, setInput] = useState('')
    const [tokenName, setName] = useState()
    const [userBalance, setUserBalance] = useState({
        walletBalance: '',
        contractBalance: '',
        allowance: ''
    }) 

    const connectedFarmContract = props.farmContract.connect(props.provider)
    const connectedTokenContract = props.token.connect(props.provider)

    useEffect(() => {
        setup()
    }, [props.walletInfo])

    function handleChange(e) {
        const {value} = e.target
        setInput(value)
    }

    async function setup() {
        const tokenName =  await connectedTokenContract.name()
        const walletBalance = await connectedTokenContract.balanceOf(props.walletInfo.address)
        const contractBalance = await connectedFarmContract.stakingBalance(props.walletInfo.address)
        const allowance = await connectedTokenContract.allowance(props.walletInfo.address, props.farmContract.address)
        setName(tokenName)
        setUserBalance(() => {
            return {
                walletBalance: ethers.utils.formatEther(walletBalance),
                contractBalance: ethers.utils.formatEther(contractBalance),
                allowance: ethers.utils.formatEther(allowance)
            }
        })
    }


    async function handleAllow() {
        //const MAX_UNIT = ethers.BigNumber.from(2 ** 256 -1)
        const signedToken = props.token.connect(props.walletInfo.signer)
        const tx = await signedToken.approve(props.farmContract.address, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
        const yo = await tx.wait();
        setup();
    }

    return (
        <div className="stakeunit">
            <h1>{tokenName}</h1>
            <div>Wallet Balance: {parseFloat(userBalance.walletBalance).toFixed(6)}</div>
            <div>Amount Staked: {parseFloat(userBalance.contractBalance).toFixed(6)}</div>
            <br />
            <div>
                <input type="number" value={input} onChange={handleChange} /> 
            </div>
            <div>
                {(userBalance.allowance == 0.0) ?
                    <div>
                        <br />
                        <button onClick={handleAllow}>Approve Token</button>
                    </div>
                    :
                    <div>
                        <button onClick={() => props.handleStake(ethers.utils.parseEther(input))}>Stake</button>
                        <button onClick={() => props.handleUnstake(ethers.utils.parseEther(input))}>Unstake</button>
                    
                        <br />
                        <button onClick={() => props.handleStake(ethers.utils.parseEther(userBalance.walletBalance))}>Stake Max</button>
                        <button onClick={() => props.handleUnstake(ethers.utils.parseEther(userBalance.contractBalance))}>Unstake Max</button>
                    </div>
                }
                {(userBalance.contractBalance > 0 )
                    &&
                    <div>

                        <button onClick={props.handleWithdraw}>Claim Yield</button>
                    </div>
                }
            </div>

        </div>
    )
}