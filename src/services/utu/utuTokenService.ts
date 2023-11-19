import { ethers } from "ethers";
import uttAbi from "../../contracts/UTT.abi.json";

const utuTokenContractAddress =
  process.env.REACT_APP_UTU_TOKEN_CONTRACT_ADDRESS;

const polygonChainId =
  process.env.REACT_APP_POLYGON_CHAIN_ID

const getBalance = async () => {
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
  const userAddress = signer.getAddress();

  const uttContract =
    new ethers.Contract(utuTokenContractAddress, uttAbi.abi, ethersProvider);

  const walletUTTBalance = await uttContract.balanceOf(userAddress);
  return walletUTTBalance;
}

export const utuTokenService = {
  getBalance,
};