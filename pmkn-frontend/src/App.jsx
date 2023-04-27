import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import WalletConnect from './components/WalletConnect'
import pmknTokenABI from './ABIs/pmknTokenABI.json'
import pmknFarmABI from './ABIs/pmknFarmABI.json'

export default function App() {
    const [provider, setProvider] = useState(new ethers.providers.Web3Provider(window.ethereum));
    const [walletInfo, setWalletInfo] = useState({});
    const [pmknAddress, setPmknAddress] = useState();
    const [pmknFarmAddress, setPmknFarmAddress] = useState();
    const [pmknContract, setPmknContract] = useState()
    const [pmknFarmContract, setPmknFarmContract] = useState()
 

    async function initialize() {
        setPmknAddress('0x5Ebaa6d5DbB574d1A211Fa8e8ea55feF6D308bCb')
        setPmknFarmAddress('0xd2F05d6eE6dB5Ed62bc7629D957f37042221db4C')
        setPmknContract(new ethers.Contract(pmknAddress, pmknTokenABI, provider))
        setPmknFarmContract(new ethers.Contract(pmknFarmAddress, pmknFarmABI, provider))
    }

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

    provider.provider.on('chainChanged', () => {
        window.location.reload()
    })

    provider.provider.on("accountsChanged", () => {
        getAccount()
    })


    return (
        <div>
            <WalletConnect getAccount={connectWallet} walletInfo={walletInfo} />
        </div>
    )  
}