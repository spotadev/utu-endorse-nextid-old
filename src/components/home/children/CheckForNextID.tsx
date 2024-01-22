import React from 'react'
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { IdsItem, Platform, Proof, nextIdCheckAvatarService } from "../../../services/next-id/nextIdCheckAvatarService";
import { useGlobalStateContext } from "../../../App";
import { avatarStatusResponseHelper } from "../../../helpers/avatar-status-response/avatarStatusResponseHelper";
import GuiProof from "../../shared/show-next-id/children/GuiProof";
import GuiPlatform from "./GuiPlatform";
import ShowNextId from '../../shared/show-next-id/ShowNextId';

export default function CheckForNextID() {

  const {
    setAvatarStatusResponse,
    setXProofVerified,
  } = useGlobalStateContext();

  const { address, isConnected } = useAccount();

  const [proofs, setProofs] = useState<Proof[]>([]);
  const [idsItem, setIdsItem] = useState<IdsItem | null>(null);
  const [platforms, setPlatforms] = useState<Platform[]>([]);

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

  useEffect(() => {
    const getAvatarStatusResponse = async (address: string) => {
      const platform = 'ethereum';
      const exact = true;

      // This is a network call
      const avatarStatusResponse =
        await nextIdCheckAvatarService.getAvatarStatus(address, platform, exact);

      console.log('avatarStatusResponse', avatarStatusResponse);
      setAvatarStatusResponse(avatarStatusResponse);

      // as we have "exact = true" it means we just need to check if the ethereum proof for the
      // connected wallet address is valid.  Also as we create the DID using the wallet we expect
      // the signature of the avatar and the signature of the wallet address to be the same and 
      // that there will only be one avatar (idsItem) returned.

      const idsItems: IdsItem[] = avatarStatusResponse.ids;

      if (idsItems.length > 1) {
        // We need to later loop through each IdsItem and retrieve the idsItem where 
        // the signatures of the avatar and ethereum address are the same.
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
      }
      else {
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

  }, [address]);

  if (isConnected) {
    if (proofs.length > 0) {
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
    else {
      return (
        <>
          <div>
            You do not yet have a next.ID associated with your wallet address.
            Click the button below to do so.
            <p>
              <button>Create next.ID avatar and add your wallet address to it</button>
            </p>
          </div>
          <br />
          <hr />
          <br />
          <div>
            <span style={{ fontWeight: 'bold' }}>Create Next.id and Link Platform:</span>
          </div>
          {platforms.map((platform, index) => (
            <div key={platform.name} style={{ paddingTop: '20px' }}>
              <GuiPlatform platform={platform} />
            </div>
          ))}
        </>
      );
    }
  }
  else {
    return 'You need to connect your wallet before you can see your next.ID';
  }
}
