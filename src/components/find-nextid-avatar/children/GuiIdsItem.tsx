import { useNavigate } from "react-router-dom";
import { useGlobalStateContext } from "../../../App";
import { IdsItem, Proof } from "../../../services/next-id/nextIdCheckAvatarService";
import GuiProof from "../../shared/show-next-id/children/GuiProof";

export default function GuiIdsItem(props: any) {

  const {
    setIdsItem,
  } = useGlobalStateContext();

  const navigate = useNavigate();
  const idsItem: IdsItem = props.idsItem;
  const index = props.index;
  const proofs: Proof[] = idsItem.proofs;

  const utuEndorse = (idsItem: IdsItem) => {
    setIdsItem(idsItem);
    navigate('/utu-endorse');
  }

  const giveSignal = (idsItem: IdsItem) => {
    setIdsItem(idsItem);
    navigate('/give-signal')
  }

  const getSignal = (idsItem: IdsItem) => {
    setIdsItem(idsItem);
    navigate('/get-signal')
  }

  if (idsItem) {
    return (
      <div style={{ paddingTop: '20px', backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#ffffff' }}>
        <div style={{ fontWeight: 'bold' }}>
          <span>next.id DID:</span>
        </div>
        <div style={{ wordWrap: 'break-word' }}>
          {idsItem?.avatar}
        </div>
        {
          proofs.map((proof, index) => (
            <div key={proof.identity} style={{ paddingTop: '20px' }}>
              <GuiProof proof={proof} index={index} />
            </div>
          ))
        }
        <div style={{ paddingTop: '20px' }}>
          <button onClick={() => { utuEndorse(idsItem) }}>UTU Endorse</button>
          &nbsp;&nbsp;
          <button onClick={() => { giveSignal(idsItem) }}>Give UTU Signal</button>
          &nbsp;&nbsp;
          <button onClick={() => { getSignal(idsItem) }}>Get UTU Signal</button>
        </div>
      </div>
    );
  }
  return null;
}