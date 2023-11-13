import { useEffect, useState } from "react";

export default function ShowTestEthereumAddress() {

  const [testEthereumAddress, setTestEthereumAddress] = useState<string | null>(null);

  useEffect(() => {
    const _showTestEthereumAddress = process.env.REACT_APP_SHOW_TEST_ETHEREUM_ADDRESS;

    if (_showTestEthereumAddress) {
      const _testEthereumAddress = process.env.REACT_APP_TEST_ETHEREUM_ADDRESS;

      if (_testEthereumAddress) {
        setTestEthereumAddress(_testEthereumAddress);
      }
    }
  }, []);

  if (testEthereumAddress) {
    return (
      <>
        <div style={{ paddingTop: '20px', paddingBottom: '20px', color: 'maroon' }}>
          You can use this ethereum wallet address for testing purposes:
          <br /><br />
          {testEthereumAddress}
        </div>
      </>
    );
  }
  else {
    return null;
  }
}