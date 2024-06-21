const hre = require("hardhat");
const fs = require('fs');

async function main() {
  //Deploying the token's hydrogen contractt
  const HCT = await ethers.getContractFactory("HydroChainToken");
  const hct = await HCT.deploy();
  await hct.deployed();
  console.log("HydroChainToken deployed to:", hct.address);

  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const nftMarketplace = await NFTMarketplace.deploy(hct.address);
  await nftMarketplace.deployed();
  console.log("HydrogenMarketPlace deployed to:", nftMarketplace.address);

  fs.writeFileSync('./config.js', `
  export const marketplaceAddress = "${nftMarketplace.address}"
  `)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
