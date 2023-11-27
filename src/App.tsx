import React from 'react'
import appStyle from './App.module.css';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { arbitrum, mainnet } from 'wagmi/chains'
import { createContext, useContext, useState } from 'react';
import ProofPayloadResponse from './services/next-id/nextIdProofService';
import AvatarStatusResponse from './services/next-id/nextIdCheckAvatarService';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import LinkXTwitter from './components/link-platform/x-twitter/LinkXTwitter';
import LinkGithub from './components/link-platform/github/LinkGithub';
import About from './components/about/About';

import { IdsItem } from "./services/next-id/nextIdCheckAvatarService";
import FindNextIdToEndorseOrComment from './components/find-nextid-to-endorse/FindNextIdToEndorseOrComment';
import UtuComment from './components/utu-comment/UtuComment';
import UtuEndorse from './components/utu-endorse/UtuEndorse';
import SignalFeedback from './components/signal-feedback/SignalFeedback';

// =================================================================================================
// Start: Create Global Context

export type GlobalState = {
  xHandle: string | null;
  setXHandle: (c: string) => void;
  xProofPayloadResponse: ProofPayloadResponse | null;
  setXProofPayloadResponse: (c: ProofPayloadResponse) => void;
  publicKey: string | null;
  setPublicKey: (c: string) => void;
  avatarStatusResponse: AvatarStatusResponse | null;
  setAvatarStatusResponse: (c: AvatarStatusResponse) => void;
  xProofVerified: boolean;
  setXProofVerified: (c: boolean) => void;
  idsItem: IdsItem | null;
  setIdsItem: (c: IdsItem) => void;
  findPlatform: string;
  setFindPlatform: (c: string) => void;
  findHandle: string;
  setFindHandle: (c: string) => void;
};

export const SharedDataContext = createContext<GlobalState>({
  xHandle: null,
  setXHandle: () => { },
  xProofPayloadResponse: null,
  setXProofPayloadResponse: () => { },
  publicKey: null,
  setPublicKey: (c: string) => { },
  avatarStatusResponse: null,
  setAvatarStatusResponse: (c: AvatarStatusResponse) => { },
  xProofVerified: false,
  setXProofVerified: (c: boolean) => { },
  idsItem: null,
  setIdsItem: (c: IdsItem) => { },
  findPlatform: '',
  setFindPlatform: (c: string) => { },
  findHandle: '',
  setFindHandle: (c: string) => { },
});

export const useGlobalStateContext = () => {
  return useContext(SharedDataContext);
};

// End: Create Global Context
// =================================================================================================

// =================================================================================================
// Start: Configure web3modal

const environment = process.env.REACT_APP_ENVIRONMENT;
console.log('environment', environment);

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
  const [xProofPayloadResponse, setXProofPayloadResponse] = useState<ProofPayloadResponse | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [avatarStatusResponse, setAvatarStatusResponse] = useState<AvatarStatusResponse | null>(null);
  const [xProofVerified, setXProofVerified] = useState<boolean>(false);
  const [idsItem, setIdsItem] = useState<IdsItem | null>(null);
  const [findPlatform, setFindPlatform] = useState<string>("");
  const [findHandle, setFindHandle] = useState<string>("");

  return (
    <SharedDataContext.Provider value={{
      xHandle, setXHandle,
      xProofPayloadResponse, setXProofPayloadResponse,
      publicKey, setPublicKey,
      avatarStatusResponse, setAvatarStatusResponse,
      xProofVerified, setXProofVerified,
      idsItem, setIdsItem,
      findPlatform, setFindPlatform,
      findHandle, setFindHandle
    }}>
      <WagmiConfig config={wagmiConfig}>
        <div className={appStyle.centeredPage}>
          <BrowserRouter>
            <span style={{ fontWeight: 'bold' }}>Next.id / UTU Endorse</span>
            <br /><br />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/link/platform/twitter" element={<LinkXTwitter />} />
              <Route path="/link/platform/github" element={<LinkGithub />} />
              <Route path="/about" element={<About />} />
              <Route path="/findNextIdToEndorseOrComment" element={<FindNextIdToEndorseOrComment />} />
              <Route path="/utuEndorse" element={<UtuEndorse />} />
              <Route path="/utuComment" element={<UtuComment />} />
              <Route path="/signalFeedback" element={<SignalFeedback />} />
            </Routes>
          </BrowserRouter>
        </div>
      </WagmiConfig>
    </SharedDataContext.Provider>
  );
}

export default App;
