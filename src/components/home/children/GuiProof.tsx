import React from 'react'

export default function GuiProof(props: any) {
  const proof = props.proof;

  const formatTimestamp = (timestamp: string) => {
    const timestampNumber = parseInt(timestamp, 10);
    const date = new Date(timestampNumber * 1000);
    return date.toLocaleString();
  };

  return (
    <>
      <div>
        <span style={{ display: 'inline-block', width: '90px', fontWeight: 'bold' }}>
          {proof.platform}:
        </span>
        <span>
          &nbsp;{proof.identity}
        </span>
      </div>
      <div>
        <span style={{ width: '34%' }}>
          Created: {formatTimestamp(proof.created_at)}
        </span>
      </div>
    </>
  );
}