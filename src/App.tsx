import appStyle from './App.module.css';

import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'

import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import Buttons from './components/Web3ModalButtons';
import GetNextIdProofPayload from './components/GetNextIdProofPayload';
import Information from './components/Information';
import PostTweetInstructions from './components/PostTweetInstructions';
import ShowProofHere from './components/ShowProofHere';
import ShowProofOnWeb3Bio from './components/ShowProofOnWeb3Bio';
import { createContext, useContext, useState } from 'react';
import ProofPayloadResponse from './services/next-id/nextIdProofService';
import AvatarStatusResponse from './services/next-id/nextIdCheckAvatarService';
import Web3ModalButtons from './components/Web3ModalButtons';

// =================================================================================================
// Start: Create Global Context

export type GlobalState = {
  xHandle: string | null;
  setXHandle: (c: string) => void;
  proofPayloadResponse: ProofPayloadResponse | null;
  setProofPayloadResponse: (c: ProofPayloadResponse) => void;
  publicKey: string | null;
  setPublicKey: (c: string) => void;
  avatarStatusResponse: AvatarStatusResponse | null;
  setAvatarStatusResponse: (c: AvatarStatusResponse) => void;
  xProofVerified: boolean;
  setXProofVerified: (c: boolean) => void;
};

export const SharedDataContext = createContext<GlobalState>({
  xHandle: null,
  setXHandle: () => { },
  proofPayloadResponse: null,
  setProofPayloadResponse: () => { },
  publicKey: null,
  setPublicKey: (c: string) => { },
  avatarStatusResponse: null,
  setAvatarStatusResponse: (c: AvatarStatusResponse) => { },
  xProofVerified: false,
  setXProofVerified: (c: boolean) => { }
});

export const useGlobalStateContext = () => {
  return useContext(SharedDataContext);
};

// End: Create Global Context
// =================================================================================================

// =================================================================================================
// Start: Configure web3modal

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


// End: Configure web3modal
// =================================================================================================

function App() {
  const [xHandle, setXHandle] = useState<string | null>(null);
  const [proofPayloadResponse, setProofPayloadResponse] = useState<ProofPayloadResponse | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [avatarStatusResponse, setAvatarStatusResponse] = useState<AvatarStatusResponse | null>(null);
  const [xProofVerified, setXProofVerified] = useState<boolean>(false);

  return (
    <SharedDataContext.Provider value={{
      xHandle, setXHandle,
      proofPayloadResponse, setProofPayloadResponse,
      publicKey, setPublicKey,
      avatarStatusResponse, setAvatarStatusResponse,
      xProofVerified, setXProofVerified
    }}>
      <WagmiConfig config={wagmiConfig}>
        <div className={appStyle.centeredPage}>
          <span style={{ fontWeight: 'bold' }}>Demo using Next.id, X (Twitter) and UTU Trust</span>
          <br /><br />
          <Information />
          <hr />
          <Web3ModalButtons />
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
    </SharedDataContext.Provider>
  );
}

export default App;
