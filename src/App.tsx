import React from 'react'
import appStyle from './App.module.css';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react'
import { WagmiConfig } from 'wagmi'
import { polygonMumbai, arbitrum, mainnet } from 'wagmi/chains'
import { createContext, useContext, useState } from 'react';
import ProofPayloadResponse from './services/next-id/nextIdProofService';
import AvatarStatusResponse from './services/next-id/nextIdCheckAvatarService';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import LinkXTwitter from './components/link-platform/x-twitter/LinkXTwitter';
import LinkGithub from './components/link-platform/github/LinkGithub';
import About from './components/about/About';

import { IdsItem } from "./services/next-id/nextIdCheckAvatarService";
import FindNextIdAvatar from './components/find-nextid-avatar/FindNextIdAvatar';
import GiveSignal from './components/signal/give-signal/GiveSignal';
import UtuEndorse from './components/signal/utu-endorse/UtuEndorse';
import GetSignal from './components/signal/get-signal/GetSignal';

// =================================================================================================
// Start: Create Global Context

export type GlobalState = {
  xHandle: string | null;
  setXHandle: (c: string) => void;
  githubHandle: string | null;
  setGithubHandle: (c: string) => void;
  xProofPayloadResponse: ProofPayloadResponse | null;
  setXProofPayloadResponse: (c: ProofPayloadResponse) => void;
  githubProofPayloadResponse: ProofPayloadResponse | null;
  setGithubProofPayloadResponse: (c: ProofPayloadResponse) => void;
  publicKey: string | null;
  setPublicKey: (c: string) => void;
  avatarStatusResponse: AvatarStatusResponse | null;
  setAvatarStatusResponse: (c: AvatarStatusResponse) => void;
  xProofVerified: boolean;
  setXProofVerified: (c: boolean) => void;
  githubProofVerified: boolean;
  setGithubProofVerified: (c: boolean) => void;
  idsItem: IdsItem | null;
  setIdsItem: (c: IdsItem | null) => void;
  idsItems: IdsItem[];
  setIdsItems: (c: IdsItem[]) => void;
  findPlatform: string;
  setFindPlatform: (c: string) => void;
  findHandle: string;
  setFindHandle: (c: string) => void;
  utuBearerToken: string | null;
  setUtuBearerToken: (c: string) => void;
};

export const SharedDataContext = createContext<GlobalState>({
  xHandle: null,
  setXHandle: () => { },
  githubHandle: null,
  setGithubHandle: () => { },
  xProofPayloadResponse: null,
  setXProofPayloadResponse: () => { },
  githubProofPayloadResponse: null,
  setGithubProofPayloadResponse: () => { },
  publicKey: null,
  setPublicKey: (c: string) => { },
  avatarStatusResponse: null,
  setAvatarStatusResponse: (c: AvatarStatusResponse) => { },
  xProofVerified: false,
  setXProofVerified: (c: boolean) => { },
  githubProofVerified: false,
  setGithubProofVerified: (c: boolean) => { },
  idsItem: null,
  setIdsItem: (c: IdsItem | null) => { },
  idsItems: [],
  setIdsItems: () => { },
  findPlatform: '',
  setFindPlatform: (c: string) => { },
  findHandle: '',
  setFindHandle: (c: string) => { },
  utuBearerToken: null,
  setUtuBearerToken: (c: string) => { }
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
const chains = [polygonMumbai, mainnet, arbitrum]

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
  const [githubHandle, setGithubHandle] = useState<string | null>(null);
  const [xProofPayloadResponse, setXProofPayloadResponse] = useState<ProofPayloadResponse | null>(null);
  const [githubProofPayloadResponse, setGithubProofPayloadResponse] = useState<ProofPayloadResponse | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [avatarStatusResponse, setAvatarStatusResponse] = useState<AvatarStatusResponse | null>(null);
  const [xProofVerified, setXProofVerified] = useState<boolean>(false);
  const [githubProofVerified, setGithubProofVerified] = useState<boolean>(false);
  const [idsItem, setIdsItem] = useState<IdsItem | null>(null);
  const [idsItems, setIdsItems] = useState<IdsItem[]>([]);
  const [findPlatform, setFindPlatform] = useState<string>("");
  const [findHandle, setFindHandle] = useState<string>("");
  const [utuBearerToken, setUtuBearerToken] = useState<string | null>("");

  return (
    <SharedDataContext.Provider value={{
      xHandle, setXHandle,
      githubHandle, setGithubHandle,
      xProofPayloadResponse, setXProofPayloadResponse,
      githubProofPayloadResponse, setGithubProofPayloadResponse,
      publicKey, setPublicKey,
      avatarStatusResponse, setAvatarStatusResponse,
      xProofVerified, setXProofVerified,
      githubProofVerified, setGithubProofVerified,
      idsItem, setIdsItem,
      idsItems, setIdsItems,
      findPlatform, setFindPlatform,
      findHandle, setFindHandle,
      utuBearerToken, setUtuBearerToken
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
              <Route path="/find-next-id-avatar" element={<FindNextIdAvatar />} />
              <Route path="/utu-endorse" element={<UtuEndorse />} />
              <Route path="/give-signal" element={<GiveSignal />} />
              <Route path="/get-signal" element={<GetSignal />} />
            </Routes>
          </BrowserRouter>
        </div>
      </WagmiConfig>
    </SharedDataContext.Provider>
  );
}

export default App;
