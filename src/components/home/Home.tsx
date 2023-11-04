import CheckForNextID from "./children/CheckForNextID";
import Web3ModalButtons from "./children/Web3ModalButtons";

export default function Home() {

  return (
    <>
      <Web3ModalButtons />
      <br />
      <hr />
      <br />
      <CheckForNextID />
      <br />
      <hr />
    </>
  );
}