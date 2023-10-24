import { useAccount } from "wagmi"

export default function ConnectInfo() {
  const { address, isConnecting, isDisconnected } = useAccount()

  if (isConnecting) {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Status: </span>
        Connecting ...
      </div>);
  }
  else if (isDisconnected) {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Status: </span>
        Disconnected
      </div>);
  }
  else {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Status: </span>
        Connected.
        <div style={{ marginTop: '10px' }}>
          <span style={{ fontWeight: 'bold' }}>Wallet Address: </span>
          {address}
        </div>
      </div>);
  }
}