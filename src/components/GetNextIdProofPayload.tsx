import appStyle from '../App.module.css';

import { useAccount } from "wagmi";
import ProofPayloadResponse, { nextIdProofService } from '../services/next-id/nextIdProofService';
import { useGlobalStateContext } from '../App';
import { nextIdCheckAvatarService } from '../services/next-id/nextIdCheckAvatarService';
import { useEffect } from 'react';


export default function GetNextIdProofPayload() {
  const {
    xHandle, setXHandle,
    proofPayloadResponse, setProofPayloadResponse,
    avatarStatusResponse, setAvatarStatusResponse,
    setPublicKey
  } = useGlobalStateContext();

  const { isConnected } = useAccount();

  const next = async () => {
    if (xHandle) {
      const proofPayloadResponse: ProofPayloadResponse =
        await nextIdProofService.getNextIdProofPayload(xHandle, setPublicKey);

      setProofPayloadResponse(proofPayloadResponse);
    }
  }

  useEffect(() => {
    const getAvatarStatusResponse = async (xHandle: string) => {
      const avatarStatusResponse = await nextIdCheckAvatarService.getAvatarStatus(xHandle);
      console.log('avatarStatusResponse', avatarStatusResponse);
      setAvatarStatusResponse(avatarStatusResponse);
    };

    if (xHandle) {
      (async () => {
        await getAvatarStatusResponse(xHandle);
      })();
    }
  }, []);

  if (!isConnected) {
    return (
      <div>
        Step 2: Submit X Handle - PENDING
      </div>
    );
  }
  else if (isConnected && !proofPayloadResponse && !avatarStatusResponse) {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 2:</span> Submit X Handle - PENDING
        &nbsp;&nbsp;
        <input
          className={appStyle.input}
          placeholder="X / Twitter Handle (mandatory)"
          value={xHandle ? xHandle : ''} onChange={(event) => setXHandle(event.target.value)} />
        &nbsp;&nbsp;
        <button disabled={xHandle?.length == 0} className={appStyle.button} onClick={next}>Next</button>
      </div>
    );
  }
  else {
    <div >
      <span style={{ fontWeight: 'bold' }}>Step 2:</span> Submit X Handle - DONE
    </div >
  }
}