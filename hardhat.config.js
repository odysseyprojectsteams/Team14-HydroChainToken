require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";
infuraId = 
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    /*
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      url: "https://rpc-mumbai.matic.today",
      accounts: [process.env.privateKey]
    }, 
    mumbai: {
      // Infura
      url: "https://polygon-mumbai.infura.io/v3/b3ababb0574b4183b60112b3d780a73b",
     // url: "https://rpc-mainnet.maticvigil.com",
      accounts: ["dc7f06d108b5e01d15480823918c1d53c1ce4a116eba9e2f9b5c0b2974214bfa"]
    }
   */
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

