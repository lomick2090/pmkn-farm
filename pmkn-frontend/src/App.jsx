import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import Header from './components/Header'
import pmknTokenABI from './ABIs/pmknTokenABI.json'
import pmknFarmABI from './ABIs/pmknFarmABI.json'
import StakeUnit from './components/StakeUnit'
import wtbnb from './ABIs/wtbnb.json'

export default function App() {
    const [provider, setProvider] = useState(new ethers.providers.Web3Provider(window.ethereum));
    const [walletInfo, setWalletInfo] = useState({});
    const [pmknAddress, setPmknAddress] = useState();
    const [pmknFarmAddress, setPmknFarmAddress] = useState();
    const [pmknContract, setPmknContract] = useState();
    const [pmknFarmContract, setPmknFarmContract] = useState();
    const [wtbnbContract, setWtbnbContract] = useState();
 

    async function initialize() {
        const pmknAddy = '0x5Ebaa6d5DbB574d1A211Fa8e8ea55feF6D308bCb'
        const pmknFarmAddy = '0xd2F05d6eE6dB5Ed62bc7629D957f37042221db4C'
        const wtbnbAddy = '0xC9eB79875f9A0cA52aA14068FA2307D54De76fC0'

        setPmknAddress(pmknAddy)
        setPmknFarmAddress(pmknFarmAddy)
        setPmknContract(new ethers.Contract(pmknAddy, pmknTokenABI, provider))
        setPmknFarmContract(new ethers.Contract(pmknFarmAddy, pmknFarmABI, provider))
        setWtbnbContract(new ethers.Contract(wtbnbAddy, wtbnb, provider))
    }

    useEffect(() => {
        initialize()
        
    }, [])

    async function connectWallet() {
        setProvider(new ethers.providers.Web3Provider(window.ethereum))
        const accounts = await provider.send('eth_requestAccounts', [])
        const signer = provider.getSigner()


        setWalletInfo(prevInfo => {
            return {
                ...prevInfo,
                address: accounts[0],
                signer,
            }
        })
    }

    async function handleStake(amount) {
        const signedFarm = pmknFarmContract.connect(walletInfo.signer)
        const tx = await signedFarm.stake(amount, { gasLimit: 200000})
        const yo = await tx.wait()
        connectWallet()
    }

    async function handleUnstake(amount) {
        const signedFarm = pmknFarmContract.connect(walletInfo.signer)
        const tx = await signedFarm.unstake(amount, { gasLimit: 200000})
        const yo = await tx.wait()
        connectWallet()

    }

    async function handleWithdraw() {
        const signedFarm = pmknFarmContract.connect(walletInfo.signer);
        const tx = await signedFarm.withdrawYield()
        const yo = await tx.wait()
        connectWallet()
    }

    provider.provider.on('chainChanged', () => {
        window.location.reload()
    })

    provider.provider.on("accountsChanged", () => {
        connectWallet();
    })

    return (
        <div>
            <Header 
                getAccount={connectWallet} 
                walletInfo={walletInfo} 
            />
            {wtbnbContract && walletInfo.address
                &&
                <div className='farmunits'>
                    <StakeUnit
                        token={wtbnbContract}
                        provider={provider}
                        handleStake={handleStake}
                        walletInfo={walletInfo}
                        farmContract={pmknFarmContract}
                        handleWithdraw={handleWithdraw}
                        handleUnstake={handleUnstake}
                    />
                    <StakeUnit
                        token={pmknContract}
                        provider={provider}
                        handleStake={handleStake}
                        walletInfo={walletInfo}
                        farmContract={pmknFarmContract}
                        handleWithdraw={handleWithdraw}
                        handleUnstake={handleUnstake}
                    />
                    <StakeUnit
                        token={wtbnbContract}
                        provider={provider}
                        handleStake={handleStake}
                        walletInfo={walletInfo}
                        farmContract={pmknFarmContract}
                        handleWithdraw={handleWithdraw}
                        handleUnstake={handleUnstake}
                    />
                </div>
            }
        </div>
    )  
}