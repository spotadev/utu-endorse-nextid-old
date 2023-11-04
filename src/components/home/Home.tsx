import CheckForUniversalProfile from "./children/CheckForUniversalProfile";
import Web3ModalButtons from "./children/Web3ModalButtons";

export default function Home() {

  return (
    <>
      <Web3ModalButtons />
      <CheckForUniversalProfile />
    </>
  );
}