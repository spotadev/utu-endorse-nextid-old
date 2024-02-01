import React, { useState } from 'react';
import { useGlobalStateContext } from "../../../../App";
import appStyle from '../../../../App.module.css';
import ProofPayloadResponse, { nextIdProofService } from '../../../../services/next-id/nextIdProofService';
import { signMessage } from '@wagmi/core';
import { hashMessage, recoverPublicKey } from 'viem';
import exportFromJSON from "export-from-json";
import { ec as EC } from 'elliptic';
import { nextIdVerifyService } from '../../../../services/next-id/nextIdVerifyService';
import { useNavigate } from 'react-router-dom';

export default function GenerateJsonFileForGist() {

  const navigate = useNavigate();

  const {
    githubHandle,
    githubProofPayloadResponse,
    setGithubProofPayloadResponse,
    publicKey,
    setPublicKey,
    githubProofVerified,
    setGithubProofVerified
  } = useGlobalStateContext();

  const [gistId, setGistId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const navigateToHome = () => {
    setTimeout(() => {
      navigate('/');
    }, 4000);
  };

  const verify = async () => {
    if (gistId) {
      if (!githubProofPayloadResponse || !githubHandle || !publicKey) {
        const errrorMessage =
          'Expecting all of these to be populated: ' +
          `proofPayloadResponse: ${githubProofPayloadResponse}, ` +
          `githubHandle: ${githubHandle}, publicKey: ${publicKey}`;

        throw new Error(errrorMessage);
      }

      const uuid = githubProofPayloadResponse?.uuid;
      const createdAt = githubProofPayloadResponse?.created_at;

      try {
        await nextIdVerifyService.verifyGithubProof(githubHandle, publicKey, gistId, uuid, createdAt);
        setGithubProofVerified(true);
        navigateToHome();
      }
      catch (error) {
        setGithubProofVerified(false);
        setErrorMessage(
          'the gist did not pass validation. The github handle was not added to your next.id DID');
      }
    }
  }

  const downloadJsonFile = async () => {
    if (githubHandle) {
      const response: { proofPayloadResponse: ProofPayloadResponse, publicKey: string } =
        await nextIdProofService.getNextIdProofPayload('github', githubHandle);

      const proofPayloadResponse = response.proofPayloadResponse;
      console.log('proofPayloadResponse', proofPayloadResponse);
      setGithubProofPayloadResponse(proofPayloadResponse);

      // Steps - we need to recover the public key so we can get the file name of the json file
      const message = proofPayloadResponse.sign_payload;
      const signature = await signMessage({ message: message });
      const messageHash = hashMessage(message);

      const uncompressedRecoveredPublicKey = await recoverPublicKey({
        hash: messageHash,
        signature: signature
      })

      console.log('message', message);
      console.log('signature', signature);
      console.log('messageHash', messageHash);
      console.log('uncompressedRecoveredPublicKey', uncompressedRecoveredPublicKey);

      // The above public key is a long one that is not in compressed format - we can know that 
      // for it starts with:  0x04
      //
      // The long key looks like:
      // 0x0492d05e7a3b772333bd9c695900e9703afc797a4afe2a15feba81263311c397b47406fe9b775d6f3b468c0a9f4f68e3b6e332809347b534838ad4e249160551ed
      //
      // Compressed public keys start with 0x03 and look like:
      // 0x03947957e8a8785b6520b96c1c0d70ae9cf59835eec18f9ac920bbf5733413366a

      const uncompressedRecoveredPublicKeyWithoutPrefix = uncompressedRecoveredPublicKey.slice(2);

      const ec = new EC('secp256k1');
      const pubPoint = ec.keyFromPublic(uncompressedRecoveredPublicKeyWithoutPrefix, 'hex').getPublic();

      // Get the compressed public key as a hex string.
      const compressedPublicKey = pubPoint.encodeCompressed('hex');
      console.log('compressedPublicKey', compressedPublicKey);

      const data = proofPayloadResponse;
      const fileName = '0x' + compressedPublicKey;
      const exportType = exportFromJSON.types.json;

      // This downloads the file
      exportFromJSON({ data, fileName, exportType });

      /** 
      This is nyk's filename: 
      
      0x03947957e8a8785b6520b96c1c0d70ae9cf59835eec18f9ac920bbf5733413366a.json
      
      This is mine:

      0x0492d05e7a3b772333bd9c695900e9703afc797a4afe2a15feba81263311c397b47406fe9b775d6f3b468c0a9f4f68e3b6e332809347b534838ad4e249160551ed.json

      After converting my file to compressed looks like:

      0x0392d05e7a3b772333bd9c695900e9703afc797a4afe2a15feba81263311c397b4.json

      The beginning of both the long and short version is the same apart from the prefix so it is
      hardly worth using the library.
      */

      /**
          {
            "post_content": {
              "default": "{\n\t\"version\": \"1\",\n\t\"comment\": \"Here's an NextID proof of this Github account.\",\n\t\"comment2\": \"To validate, base64.decode the signature, and recover pubkey from it using sign_payload with ethereum personal_sign algo.\",\n\t\"persona\": \"0x0392d05e7a3b772333bd9c695900e9703afc797a4afe2a15feba81263311c397b4\",\n\t\"github_username\": \"javaspeak\",\n\t\"sign_payload\": \"{\\\"action\\\":\\\"create\\\",\\\"created_at\\\":\\\"1706699415\\\",\\\"identity\\\":\\\"javaspeak\\\",\\\"platform\\\":\\\"github\\\",\\\"prev\\\":\\\"sJnG5FiWP7VdvwdBVqRskiHyB1R0PFUiYjsHF9bYBm5kvRz09w0JNkmG/ewnplZ2gjobo4pvOyzZMDXo2TcXIQA=\\\",\\\"uuid\\\":\\\"0d65c2c5-cefa-43bb-8725-6bb54b1baa7f\\\"}\",\n\t\"signature\": \"%SIG_BASE64%\",\n\t\"created_at\": \"1706699415\",\n\t\"uuid\": \"0d65c2c5-cefa-43bb-8725-6bb54b1baa7f\"\n}"
            },
            "sign_payload": "{\"action\":\"create\",\"created_at\":\"1706699415\",\"identity\":\"javaspeak\",\"platform\":\"github\",\"prev\":\"sJnG5FiWP7VdvwdBVqRskiHyB1R0PFUiYjsHF9bYBm5kvRz09w0JNkmG/ewnplZ2gjobo4pvOyzZMDXo2TcXIQA=\",\"uuid\":\"0d65c2c5-cefa-43bb-8725-6bb54b1baa7f\"}",
              "uuid": "0d65c2c5-cefa-43bb-8725-6bb54b1baa7f",
                "created_at": "1706699415"
          }
          */

      /**
      {
        "version": "1",
        "comment": "Here's an NextID proof of this Github account.",
        "comment2": "To validate, base64.decode the signature, and recover pubkey from it using sign_payload with ethereum personal_sign algo.",
        "persona": "0x03947957e8a8785b6520b96c1c0d70ae9cf59835eec18f9ac920bbf5733413366a",
        "github_username": "nykma",
        "sign_payload": "{\"action\":\"create\",\"created_at\":\"1647329242\",\"identity\":\"nykma\",\"platform\":\"github\",\"prev\":null,\"uuid\":\"ea7279e4-b00c-4447-b784-c8f45895fdc8\"}",
        "signature": "p4kb/P2uuKCU40zZTs+jk6/ARAO5ZcXErvJU/8oXNVt3+b6SUzpauBW6wNT2N8fwQeXYGgFHCTEGon4qZbK3IQE=",
        "created_at": "1647329242",
        "uuid": "ea7279e4-b00c-4447-b784-c8f45895fdc8"
      }
       */
    }
  }

  const getDownloadJsonFileJSX = () => {
    return (
      <div>
        <span style={{ fontWeight: 'bold' }}>Step 2: </span>
        Generate json file and paste gist link - PENDING
        <div style={{ paddingTop: '20px' }}>
          Github has a cut down version of Github repositories called Gist Repositories.
        </div>
        <div style={{ paddingTop: '20px' }}>
          See here for further information about Gist Repositories:
          <br /><br />
          <a href="https://www.youtube.com/watch?v=xl004KsPKGE" target="_new">Youtube: What is GitHub Gist? Let's learn!</a>
          <br /><br />
          <a href="https://gist.github.com/" target="_new">https://gist.github.com/</a>
        </div>
        <div style={{ paddingTop: '20px' }}>
          Press the Download button to generate a json file which you can add to a gist repository.
          Note you will be prompted by your wallet to sign content.
        </div>
        <div style={{ paddingTop: '20px' }}>
          <button className={appStyle.button} onClick={downloadJsonFile}>Download json file</button>
        </div>
        <div style={{ paddingTop: '20px' }}>
          One you have downloaded the json file, add it to a gist repository on github and then
          paste the url of your gist in the box below and press verify.
        </div>
        <div style={{ paddingTop: '20px' }}>
          <input
            style={{ width: '250px' }}
            className={appStyle.input}
            placeholder="Gist Number"
            value={gistId} onChange={(event) => setGistId(event.target.value)} />
          &nbsp;&nbsp;
          <button className={appStyle.button} disabled={githubHandle?.length == 0}
            onClick={verify}>Verify</button>
        </div>
      </div>
    );
  }

  if (githubProofPayloadResponse && !githubProofVerified) {
    return getDownloadJsonFileJSX();
  }
  else if (githubProofVerified) {
    return (
      <>
        <span style={{ fontWeight: 'bold' }}>Step 2: </span>
        Generate json file and paste gist link - Handle added successfully to next.id DID
        <br /><br />
        .... Redirecting to home page in 4 seconds where you will see your DID.
      </>
    );
  }
  else {
    return getDownloadJsonFileJSX();
  }
}