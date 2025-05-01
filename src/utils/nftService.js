exports.getMetadataUrl = async (certificate) => {
    return `https://ipfs.io/ipfs/fakehash/${certificate.verificationId}`;
  };
  
  exports.mintNFT = async (walletAddress, metadataUrl) => {
    return `token-${Math.floor(Math.random() * 100000)}`;
  };
  