import WalletConnect from './WalletConnect'


export default function Header(props) {

    return (
        <div className="header">
            <h1>Pmkn Farm</h1>

            <WalletConnect 
                getAccount={props.getAccount} 
                walletInfo={props.walletInfo} 
            />          
        </div>
    )
}