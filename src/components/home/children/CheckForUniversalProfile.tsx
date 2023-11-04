import { useEffect } from "react";
import { useAccount } from "wagmi";



export default function CheckForUniversalProfile() {

  const { address, isConnected } = useAccount();

  useEffect(() => {

  }, [address]);

  if (isConnected) {

    return (
      <>
        Connected
      </>
    );
  }
  else {
    return '';
  }
}
