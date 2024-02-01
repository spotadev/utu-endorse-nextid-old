import React from 'react'
import { useGlobalStateContext } from '../../../../App';
import ProofPayloadResponse, { nextIdProofService } from '../../../../services/next-id/nextIdProofService';
import appStyle from '../../../../App.module.css';

export default function CaptureXHandle() {

  const {
    githubHandle, setGithubHandle,
    githubProofPayloadResponse, setGithubProofPayloadResponse,
    setPublicKey
  } = useGlobalStateContext();

  const next = async () => {
    if (githubHandle) {
      const platform = 'github';
      const handle = githubHandle;

      const response: { proofPayloadResponse: ProofPayloadResponse, publicKey: string } =
        await nextIdProofService.getNextIdProofPayload(platform, handle);

      setPublicKey(response.publicKey);
      setGithubProofPayloadResponse(response.proofPayloadResponse);
      console.log('response.proofPayloadResponse', response.proofPayloadResponse);
    }
  }

  if (!githubProofPayloadResponse) {
    return (
      <div style={{ paddingTop: '20px' }}>
        <span style={{ fontWeight: 'bold' }}>Step 1:</span> Enter your Github Handle - PENDING
        &nbsp;&nbsp;
        <input
          className={appStyle.input}
          placeholder="Github Handle (mandatory)"
          value={githubHandle ? githubHandle : ''} onChange={(event) => setGithubHandle(event.target.value)} />
        &nbsp;&nbsp;
        <button disabled={githubHandle?.length == 0} className={appStyle.button} onClick={next}>Next</button>
      </div>
    );
  }
  else {
    return (
      <div style={{ paddingTop: '20px' }}>
        <span style={{ fontWeight: 'bold' }}>Step 1:</span> Enter your Github Handle - DONE
      </div>
    );
  }
}