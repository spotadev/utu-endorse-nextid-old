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

  const getIdsItemWithSameEthereumAddressAsWallet = (idsItems: IdsItem[], address: string) => {
    const lowerCaseAddress = address.toLowerCase();

    for (let idsItem of idsItems) {
      for (let proof of idsItem.proofs) {
        console.log('proof', proof);
        if (proof.platform === 'ethereum' && proof.identity === lowerCaseAddress) {
          return idsItem;
        }
      }
    }
    return null;
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

      if (idsItems.length == 0) {
        setPlatformVerifiedStates([]);
        setProofs([]);
        setIdsItem(null);
        return;
      }

      const idsItem = getIdsItemWithSameEthereumAddressAsWallet(idsItems, address);

      if (idsItem == null) {
        throw new Error('Unexpected Error: could not find IdsItem with wallet address proof:' +
          address);
      }

      const validProofs = avatarStatusResponseHelper.getValidProofs(idsItem);

      const _hasValidEthereumProof =
        avatarStatusResponseHelper.hasValidEthereumProof(validProofs, address);

      if (_hasValidEthereumProof) {
        setPlatformVerifiedStates(idsItem.proofs);
        setProofs(validProofs);
        setIdsItem(idsItem);
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