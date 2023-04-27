import { ethers } from 'ethers'

export default function WalletConnect(props) {

    function ReadWallet() {
        const splitWallet = props.walletInfo.address.split('');
        const walletString = splitWallet[0] + splitWallet[1]+ splitWallet[3] + splitWallet[4] + 
            '...' + splitWallet[38] + splitWallet[39] + splitWallet[40] + splitWallet[41]
        return walletString
    }

    return (
        <div className={'walletconnect'}>
            <button onClick={props.getAccount}>
                {props.walletInfo.address ? ReadWallet() :  'Connect Wallet'}
            </button>

        </div>
    )
}