
import React from 'react'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi';

export default function Web3ModalButtons() {

  const { open, close } = useWeb3Modal()
  const { address, isConnected } = useAccount();


  if (isConnected) {
    return (
      <>
        <div>
          <span style={{ fontWeight: 'bold' }}>Wallet Address:</span>
        </div>
        <div style={{ paddingTop: '20px' }}>
          ${address}
        </div>
        <div style={{ paddingTop: '20px' }}>
          <button onClick={() => open()}>Disconnect Wallet</button>
        </div >
      </>
    );
  }
  else {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 1: </span>
        Connect to Wallet - PENDING
        &nbsp;&nbsp;
        <button onClick={() => open()}>Connect / Disconnect Wallet</button>
        &nbsp;&nbsp;
        <button onClick={() => open({ view: 'Networks' })}>Select Network</button>
      </div>
    )
  }
}