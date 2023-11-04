import appStyle from '../App.module.css';

import { useAccount } from "wagmi";
import ProofPayloadResponse, { nextIdProofService } from '../services/next-id/nextIdProofService';
import { useGlobalStateContext } from '../App';
import { nextIdCheckAvatarService } from '../services/next-id/nextIdCheckAvatarService';
import { useEffect } from 'react';
import { avatarStatusResponseHelper } from '../helpers/avatar-status-response/avatarStatusResponseHelper';


export default function GetNextIdProofPayload() {
  const {
    xHandle, setXHandle,
    proofPayloadResponse, setProofPayloadResponse,
    avatarStatusResponse, setAvatarStatusResponse,
    setPublicKey,
    xProofVerified,
    setXProofVerified
  } = useGlobalStateContext();

  const { isConnected } = useAccount();

  const next = async () => {
    if (xHandle) {
      const platform = 'twitter';

      const avatarStatusResponse =
        await nextIdCheckAvatarService.getAvatarStatus(xHandle, platform);

      console.log('avatarStatusResponse', avatarStatusResponse);

      const xHandleLinkedToUniversalID =
        avatarStatusResponseHelper.hasHandle(avatarStatusResponse, xHandle, platform);

      console.log('xHandleLinkedToUniversalID', xHandleLinkedToUniversalID);

      setXProofVerified(xHandleLinkedToUniversalID);
      setAvatarStatusResponse(avatarStatusResponse);

      if (!xHandleLinkedToUniversalID) {

        const proofPayloadResponse: ProofPayloadResponse =
          await nextIdProofService.getNextIdProofPayload(xHandle, setPublicKey);

        console.log('proofPayloadResponse', proofPayloadResponse);
        setProofPayloadResponse(proofPayloadResponse);
      }
    }
  }

  // useEffect(() => {
  // }, []);

  if (xProofVerified) {
    return (
      <div >
        <span style={{ fontWeight: 'bold' }}>Step 2: </span>
        Submit X Handle - X handle is already linked to your Universal ID
      </div >
    );
  }

  if (!isConnected) {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 2: </span>
        Submit X Handle - PENDING
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
    return (
      <div >
        <span style={{ fontWeight: 'bold' }}>Step 2:</span> Submit X Handle - DONE
      </div >
    );
  }
}