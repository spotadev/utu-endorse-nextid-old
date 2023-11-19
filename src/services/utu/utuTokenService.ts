import { ethers } from "ethers";
import uttAbi from "../../contracts/UTT.abi.json";

const utuTokenContractAddress =
  process.env.REACT_APP_UTU_TOKEN_CONTRACT_ADDRESS;

const polygonChainId =
  process.env.REACT_APP_POLYGON_CHAIN_ID;

const getUttContract = async () => {
  if (!polygonChainId) {
    throw new Error('REACT_APP_POLYGON_CHAIN_ID missing from env file');
  }

  if (!utuTokenContractAddress) {
    throw new Error('REACT_APP_UTU_TOKEN_CONTRACT_ADDRESS missing from env file');
  }

  const provider: any = window.ethereum;
  const polygonChainIdHex = ethers.toQuantity(polygonChainId);

  await provider.request({
    method: "wallet_switchEthereumChain",
    params: [{ chainId: polygonChainIdHex }]
  });

  const ethersProvider = new ethers.BrowserProvider(provider);
  const signer = await ethersProvider.getSigner();
  const connectedAddress = signer.getAddress();

  const uttContract =
    new ethers.Contract(utuTokenContractAddress, uttAbi.abi, ethersProvider);

  return { uttContract, connectedAddress };
}

const getBalance = async () => {
  const { uttContract, connectedAddress } = await getUttContract();
  const walletUTTBalance = await uttContract.balanceOf(connectedAddress);
  return walletUTTBalance;
}

const endorse = async (
  targetAddress: string,
  amountToEndorse: number,
  transactionId: number
) => {
  const { uttContract, connectedAddress } = await getUttContract();
  const utuBalance = await uttContract.balanceOf(connectedAddress);

  if (Number(utuBalance) < Number(amountToEndorse)) {
    throw new Error("Insufficient UTU tokens");
  }

  const transaction = await uttContract.endorse(
    targetAddress,
    String(amountToEndorse),
    transactionId
  );

  await transaction.wait();
  return transaction;
}

export const utuTokenService = {
  getBalance,
  endorse
};