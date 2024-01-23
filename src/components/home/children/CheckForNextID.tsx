import React from 'react'
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { IdsItem, Platform, Proof, nextIdCheckAvatarService } from "../../../services/next-id/nextIdCheckAvatarService";
import { useGlobalStateContext } from "../../../App";
import { avatarStatusResponseHelper } from "../../../helpers/avatar-status-response/avatarStatusResponseHelper";
import GuiProof from "../../shared/show-next-id/children/GuiProof";
import GuiPlatform from "./GuiPlatform";
import ShowNextId from '../../shared/show-next-id/ShowNextId';
import ProofPayloadResponse, { nextIdProofService } from '../../../services/next-id/nextIdProofService';
import { signMessage } from '@wagmi/core'
import { RecoverPublicKeyParameters, hashMessage, recoverPublicKey } from 'viem'
import { nextIdVerifyService } from '../../../services/next-id/nextIdVerifyService';

export default function CheckForNextID() {

  const {
    setAvatarStatusResponse,
    setXProofVerified,
  } = useGlobalStateContext();

  const { address, isConnected } = useAccount();

  const [proofs, setProofs] = useState<Proof[]>([]);
  const [idsItem, setIdsItem] = useState<IdsItem | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [walletEthereumVerified, setWalletEthereumVerified] = useState<boolean>(false);

  const setPlatformVerifiedStates = (proofs: Proof[]) => {
    for (let proof of proofs) {

      // @todo need to add github
      switch (proof.platform) {
        case 'twitter':
          setXProofVerified(true);
          break;
      }
    }
  }

  const createAvatarWithEthereumAddress = async () => {
    const platform = 'ethereum';
    const handle = address;

    if (!handle) {
      return new Error('Wallet is not connected');
    }

    const response: { proofPayloadResponse: ProofPayloadResponse, publicKey: string } =
      await nextIdProofService.getNextIdProofPayload(platform, handle);

    const proofPayloadResponse = response.proofPayloadResponse;
    const publicKey = response.publicKey;

    const verifiedProof =
      await nextIdVerifyService.verifyEthereumProof(proofPayloadResponse, publicKey, address);

    setWalletEthereumVerified(verifiedProof);
  }

  useEffect(() => {
    const getAvatarStatusResponse = async (address: string) => {
      const platform = 'ethereum';
      const exact = true;

      // This is a network call
      const avatarStatusResponse =
        await nextIdCheckAvatarService.getAvatarStatus(address, platform, exact);

      console.log('avatarStatusResponse', avatarStatusResponse);
      setAvatarStatusResponse(avatarStatusResponse);

      const idsItems: IdsItem[] = avatarStatusResponse.ids;

      if (idsItems.length > 1) {
        // We need to later loop through each IdsItem and retrieve the idsItem where the 
        // avatar signature is the same as the ethereum address signature.  I think we need to
        // call the proofchain service to get this info.  We may have more than one itsItem 
        // if this sotware was not used to create the avatar. Currently this software allows
        // only adding one etheruem address to the DID and that address is the address of
        // the wallet.  To add another wallet address which is not the connected wallet address
        // one would need to have the private key of that other address. Or you would need to
        // add both addresses to your wallet and do some signing with one of the addresses
        // and store the signature and payload in storage.  Then you would need to connect to the 
        // other wallet address and do some signing with that on the same payload. Then you would 
        // need to send both signatures in the extra field of the proof service.
        throw new Error('Not expecting multiple avatars for the same ethereum wallet address');
      }

      if (idsItems.length == 0) {
        setPlatformVerifiedStates([]);
        setProofs([]);
        setIdsItem(null);
        return;
      }

      const foundIdsItem = idsItems[0];
      const validProofs = avatarStatusResponseHelper.getValidProofs(foundIdsItem);

      const _hasValidEthereumProof =
        avatarStatusResponseHelper.hasValidEthereumProof(validProofs, address);

      if (_hasValidEthereumProof) {
        setPlatformVerifiedStates(foundIdsItem.proofs);
        setProofs(validProofs);
        setIdsItem(foundIdsItem);
        setWalletEthereumVerified(true);
      }
      else {
        setWalletEthereumVerified(false);
        return;
      }

      const supportedPlatforms = ['twitter', 'github'];

      const platformsNeedToConnectTo: Platform[] =
        avatarStatusResponseHelper.getPlatformsNeedToConnectTo(
          idsItem, supportedPlatforms);

      console.log('platformsNeedToConnectTo', platformsNeedToConnectTo);
      setPlatforms(platformsNeedToConnectTo);
    }

    if (address) {
      getAvatarStatusResponse(address);
    }
  }, [address, walletEthereumVerified]);


  const getIsConnectedAndWalletEthereumVerifiedJSX = () => {
    return (
      <>
        <ShowNextId title='Your next.id DID' idsItem={idsItem} />
        <br /><hr /><br />
        <div>
          <span style={{ fontWeight: 'bold' }}>Link Platform:</span>
        </div>
        {platforms.map((platform, index) => (
          <div key={platform.name} style={{ paddingTop: '20px' }}>
            <GuiPlatform platform={platform} />
          </div>
        ))}
      </>
    );
  }

  const getIsConnectedAndNotWalletEthereumVerifiedJSX = () => {
    return (
      <>
        <div>
          You do not yet have a next.ID associated with your wallet address.
          Click the button below to do so.
          <p>
            <button onClick={createAvatarWithEthereumAddress}>
              Create next.ID avatar and add your wallet address to it
            </button>
          </p>
        </div>
      </>
    );
  }

  const getIsNotConnectedJSX = () => {
    if (!isConnected) {
      return 'You need to connect your wallet before you can see your next.ID';
    }
    return '';
  }

  const getJSX = () => {
    if (isConnected && walletEthereumVerified) {
      return getIsConnectedAndWalletEthereumVerifiedJSX();
    }
    else if (isConnected && !walletEthereumVerified) {
      return getIsConnectedAndNotWalletEthereumVerifiedJSX();
    }
    else if (!isConnected) {
      return getIsNotConnectedJSX();
    }
  }

  return (
    <>
      {getJSX()}
    </>
  );
}