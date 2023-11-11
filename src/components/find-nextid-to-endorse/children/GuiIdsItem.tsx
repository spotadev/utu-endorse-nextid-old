import { useNavigate } from "react-router-dom";
import { useGlobalStateContext } from "../../../App";
import { IdsItem, Proof } from "../../../services/next-id/nextIdCheckAvatarService";
import GuiProof from "../../shared/GuiProof";

export default function GuiIdsItem(props: any) {

  const navigate = useNavigate();
  const idsItem: IdsItem = props.idsItem;
  const index = props.index;
  const proofs: Proof[] = idsItem.proofs;


  const {
    setIdsItemToEndorse
  } = useGlobalStateContext();

  const endorse = (idsItem: IdsItem) => {
    setIdsItemToEndorse(idsItem);
    navigate('/utuEndorse')
  }

  if (idsItem) {
    return (
      <div style={{ paddingTop: '20px', backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
        <div style={{}}>
          <span>next.id DID:</span>
        </div>
        <div style={{ wordWrap: 'break-word' }}>
          {idsItem?.avatar}
        </div>
        {
          proofs.map((proof, index) => (
            <GuiProof proof={proof} />
          ))
        }
        <button onClick={() => { endorse(idsItem) }}>Endorse</button>
      </div>
    );
  }
  return null;
}