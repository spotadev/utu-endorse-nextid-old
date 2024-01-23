import React from 'react'
import { useGlobalStateContext } from '../../../../App';
import ProofPayloadResponse, { nextIdProofService } from '../../../../services/next-id/nextIdProofService';
import appStyle from '../../../../App.module.css';

export default function LinkXTwitter() {

  const {
    xHandle, setXHandle,
    xProofPayloadResponse, setXProofPayloadResponse,
    setPublicKey
  } = useGlobalStateContext();

  const next = async () => {
    if (xHandle) {
      const xProofPayloadResponse: ProofPayloadResponse =
        await nextIdProofService.getNextIdProofPayload('twitter', xHandle, setPublicKey);

      console.log('xProofPayloadResponse', xProofPayloadResponse);
      setXProofPayloadResponse(xProofPayloadResponse);
    }
  }

  if (!xProofPayloadResponse) {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 1:</span> Enter your X Handle - PENDING
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
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 1:</span> Enter your X Handle - DONE
      </div>
    );
  }
}