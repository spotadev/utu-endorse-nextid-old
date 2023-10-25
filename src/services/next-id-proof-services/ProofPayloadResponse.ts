
export class ProofPayloadResponse {

  constructor(
    public success: boolean,
    public walletAddressOrSignedSecretInvalid: boolean,
    public jwtToken: string
  ) { }
}