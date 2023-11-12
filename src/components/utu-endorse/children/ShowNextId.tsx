import { useGlobalStateContext } from "../../../App";
import GuiProof from "../../shared/GuiProof";

export default function UtuEndorse() {

  const {
    idsItemToEndorse
  } = useGlobalStateContext();

  return (
    <div style={{ paddingTop: '20px' }}>
      <div style={{ color: 'green', fontWeight: 'bold' }}>
        <span>next.id DID:</span>
      </div>
      <div style={{ wordWrap: 'break-word' }}>
        {idsItemToEndorse?.avatar}
      </div>
      {
        idsItemToEndorse?.proofs.map((proof, index) => (
          <GuiProof proof={proof} />
        ))
      }
    </div>
  );
}