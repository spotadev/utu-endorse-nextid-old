
import { useWeb3Modal } from '@web3modal/wagmi/react'

export default function Buttons() {
  // 4. Use modal hook
  const { open } = useWeb3Modal()

  return (
    <div>
      <button onClick={() => open()}>Connect / Disconnect Wallet</button>
      <br /><br />
      <button onClick={() => open({ view: 'Networks' })}>Select Network</button>
    </div>
  )
}