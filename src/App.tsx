import appStyle from './App.module.css';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import Buttons from './components/Buttons';
import GetNextIdProofPayload from './components/GetNextIdProofPayload';
import Information from './components/Information';
import PostTweetInstructions from './components/PostTweetInstructions';
import ShowProofHere from './components/ShowProofHere';
import ShowProofOnWeb3Bio from './components/ShowProofOnWeb3Bio';

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
        <span style={{ fontWeight: 'bold' }}>Demo using Next.id, Linked in and UTU Trust</span>
        <br /><br />
        <Information />
        <hr />
        <Buttons />
        <hr />
        <GetNextIdProofPayload />
        <hr />
        <PostTweetInstructions />
        <hr />
        <ShowProofHere />
        <hr />
        <ShowProofOnWeb3Bio />
        <hr />
        <div style={{ backgroundColor: 'pink' }}>
          NOTE: This in progress - next.id and UTU Trust not yet integrated but will soon be.
        </div>
      </div>
    </WagmiConfig>
  );
}

export default App;
