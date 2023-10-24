interface EthereumProvider {
  request: (args: { method: string, params?: any[] }) => Promise<any>;
}

export const getSelectedAddress = async (): Promise<string | null> => {
  const provider = window.ethereum as EthereumProvider | undefined;

  if (provider) {
    const accounts = await provider.request({ method: 'eth_requestAccounts' });

    if (accounts.length > 0) {
      const selectedAddress = accounts[0];
      return selectedAddress;
    }

    return null;
  }
  else {
    return null;
  }
}

export const getPublicKey = async (selectedAddress: string): Promise<string | null> => {
  const provider = window.ethereum as EthereumProvider | undefined;

  if (provider) {
    const publicKey =
      provider.request({ method: 'eth_getEncryptionPublicKey', params: [selectedAddress] });

    return publicKey;
  }
  else {
    return null;
  }
}