import appStyle from './App.module.css';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import ConnectInfo from './components/ConnectInfo';
import Sign from './components/Sign';
import Buttons from './components/Buttons';

// 1. Get projectId
const projectId = process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID;
console.log('projectId', projectId);

if (!projectId) {
  throw new Error('Please copy .env.sample to .env and set variables');
}

// 2. Create wagmiConfig
const chains = [mainnet, arbitrum]

const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata: metadata })

// 3. Create modal
createWeb3Modal({ wagmiConfig, projectId, chains })

// Required because of bug:
// https://github.com/WalletConnect/walletconnect-monorepo/issues/3165
// localStorage.clear();

function App() {
  return (
    <WagmiConfig config={wagmiConfig}>
      <div className={appStyle.centeredPage}>
        <span style={{ fontWeight: 'bold' }}>Demo using next.id and UTU Trust</span>
        <br /><br />
        This example is about connecting to your wallet using web3modal and creating
        a next.id Universal Profile where your linkedin handle is associated with your
        wallet address on chain.
        <br /><br />
        This example will also allow you to endorse a trust.id Universal Profile with
        the UTU Trust network (Web of Trust).
        <br /><br />
        Note that next.id is a decentralised ID aggregator while UTU Trust is web of trust.
        Combine both of these together and it gets sexy.
        <br /><br />
        See <a href="https://next.id">https://next.id</a>
        <br />
        See <a href="https://utu.io">https://utu.io</a>
        <br /><br />
        <Buttons />
        <br /><br />
        <ConnectInfo />
        <br /><br />
        <Sign />
        NOTE: This in progress - next.id and UTU Trust not yet integrated but will soon be.
      </div>
    </WagmiConfig>
  );
}

export default App;
