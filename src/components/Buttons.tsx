
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi';

export default function Buttons() {

  const { open, close } = useWeb3Modal()
  const { address, isConnected } = useAccount();


  if (isConnected) {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 1:</span> Connected to Wallet - DONE
        <br /><br />
        Wallet Address: ${address}
        <br /><br />
        <button onClick={() => open()}>Disconnect Wallet</button>
      </div>
    );
  }
  else {
    return (
      <div>
        Step 1: Connect to Wallet - PENDING
        &nbsp;&nbsp;
        <button onClick={() => open()}>Connect / Disconnect Wallet</button>
        &nbsp;&nbsp;
        <button onClick={() => open({ view: 'Networks' })}>Select Network</button>
      </div>
    )
  }
}