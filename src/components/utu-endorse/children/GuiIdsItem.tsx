import { useGlobalStateContext } from "../../../App";
import { IdsItem, Proof } from "../../../services/next-id/nextIdCheckAvatarService";
import GuiProof from "../../shared/GuiProof";

export default function GuiIdsItem(props: any) {

  const idsItem: IdsItem = props.idsItem;
  const proofs: Proof[] = idsItem.proofs;

  const {
    setIdsItemToEndorse
  } = useGlobalStateContext();

  const endorse = (idsItem: IdsItem) => {
    setIdsItemToEndorse(idsItem);
  }

  if (idsItem) {
    return (
      <div style={{ paddingTop: '20px', wordWrap: 'break-word' }}>
        <div>
          <span>next.id DID:</span>
          &nbsp;&nbsp;
          <span>{idsItem?.avatar}</span>
          &nbsp;&nbsp;
          <button onClick={() => { endorse(idsItem) }}>Endorse</button>
        </div>
        {
          proofs.map((proof, index) => (
            <GuiProof proof={proof} />
          ))
        }
      </div>
    );
  }
  return null;
}