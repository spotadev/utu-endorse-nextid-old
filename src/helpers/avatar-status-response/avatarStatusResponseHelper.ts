import AvatarStatusResponse, { IdsItem, Platform, Proof } from "../../services/next-id/nextIdCheckAvatarService";


const hasHandle = (avatarStatusResponse: AvatarStatusResponse, handle: string, platform: string) => {
  const idsItems = avatarStatusResponse.ids;

  for (let idsItem of idsItems) {
    const proofs = idsItem.proofs;

    for (let proof of proofs) {

      // the call for showing proof passes a handle in the request but returns handles whicn 
      // partially match e.g if request handle 'cat' then it will also return 'category'
      if (proof.platform === platform && proof.identity === handle) {
        return true;
      }
    }
  }

  return false;
}

// returns all proofs in this IdsItem which are valid
const getValidProofs = (foundIdsItem: IdsItem) => {
  return [];
}

const hasValidEthereumProof = (validProofs: Proof[], address: string) => {
  return true;
}



// Not needed with exact=true
// const getIdsItem = (handle: string, platform: string, idItems: IdsItem[]): IdsItem | null => {
//   let foundIdsItem: IdsItem | null = null;

//   for (let idsItem of idItems) {
//     let proofs: Proof[] = idsItem.proofs;
//     let validProofs = [];

//     for (let proof of proofs) {
//       if (proof.is_valid) {
//         validProofs.push(proof);

//         if (proof.platform === platform && proof.identity === handle) {
//           foundIdsItem = idsItem;
//         }
//       }
//     }

//     // only included valid proofs
//     if (foundIdsItem) {
//       foundIdsItem.proofs = validProofs;
//       break;
//     }
//   }

//   return foundIdsItem;
// }

const getPlatformsNeedToConnectTo =
  (idsItem: IdsItem | null, supportedPlatforms: string[]): Platform[] => {
    let proofs: Proof[] = []

    if (idsItem) {
      proofs = idsItem?.proofs;
    }

    const platforms: Platform[] = [];

    for (let supportedPlatform of supportedPlatforms) {

      let found = false;

      for (let proof of proofs) {
        if (supportedPlatform === proof.platform) {
          found = true;
        }
      }

      if (!found) {
        platforms.push({
          name: supportedPlatform, url: `/link/platform/${supportedPlatform}`
        });
      }
    }

    return platforms;
  }

export const avatarStatusResponseHelper = {
  hasHandle,
  getValidProofs,
  hasValidEthereumProof,
  getPlatformsNeedToConnectTo
}
