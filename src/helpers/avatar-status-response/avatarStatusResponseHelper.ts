import AvatarStatusResponse, { IdsItem, Proof } from "../../services/next-id/nextIdCheckAvatarService";


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

const getIdsItem = (handle: string, platform: string, idItems: IdsItem[]): IdsItem | null => {

  for (let idsItem of idItems) {
    let proofs: Proof[] = idsItem.proofs;

    for (let proof of proofs) {

      if (proof.platform === platform && proof.identity === handle && proof.is_valid) {
        return idsItem;
      }
    }
  }

  return null;
}

const getProofs = (avatarStatusResponse: AvatarStatusResponse, platform: string, handle: string) => {
  let proofsToRender: Proof[] = [];

  const idItems: IdsItem[] = avatarStatusResponse.ids;
  const matchingIdItem = getIdsItem(handle, platform, idItems);

  if (matchingIdItem) {
    let proofs: Proof[] = matchingIdItem.proofs;

    for (let proof of proofs) {
      if (proof.is_valid) {
        proofsToRender.push(proof);
      }
    }
  }

  return proofsToRender;
}

export const avatarStatusResponseHelper = {
  hasHandle,
  getProofs
}