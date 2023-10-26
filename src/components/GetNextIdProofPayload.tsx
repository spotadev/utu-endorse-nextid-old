import appStyle from '../App.module.css';

import { useAccount } from "wagmi";
import ProofPayloadResponse, { nextIdProofService } from '../services/next-id/nextIdProofService';
import { useGlobalStateContext } from '../App';


export default function GetNextIdProofPayload() {
  const {
    xHandle, setXHandle,
    proofPayloadResponse, setProofPayloadResponse,
    publicKey, setPublicKey
  } = useGlobalStateContext();

  const { isConnected } = useAccount();

  const next = async () => {
    if (xHandle) {
      const proofPayloadResponse: ProofPayloadResponse =
        await nextIdProofService.getNextIdProofPayload(xHandle, setPublicKey);

      setProofPayloadResponse(proofPayloadResponse);
    }
  }

  if (!isConnected) {
    return (
      <div>
        Step 2: Submit X Handle - PENDING
      </div>
    );
  }
  else if (isConnected && !proofPayloadResponse) {
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