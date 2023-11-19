import { ethers } from "ethers"


const getEthereumAddress = (identifier: string) => {
  return ethers.id(identifier).slice(0, 40 + 2)
}

export const nextIdHelper = {
  getEthereumAddress,
};