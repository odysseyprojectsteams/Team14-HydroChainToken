const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HydroChainToken", function () {
  let HydroChainToken;
  let hct;
  let owner;
  let addr1;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    HydroChainToken = await ethers.getContractFactory("HydroChainToken");
    [owner, addr1, _] = await ethers.getSigners();
    console.log(addr1.address)
    // To deploy the contract, call deploy() and await the result.
    hct = await HydroChainToken.deploy();
    await hct.deployed();
  });

  describe("Deployment", function () {
    it("Should assign the initial supply of tokens to the owner", async function () {
      const ownerBalance = await hct.balanceOf(owner.address);
      expect(await hct.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 10 tokens from owner to addr1
      await hct.transfer(addr1.address, 20);
      const addr1Balance = await hct.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(20);
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await hct.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner.
      await expect(
        hct.connect(addr1).transfer(owner.address, 1)
      ).to.be.revertedWith("transfer amount exceeds your balance, Try again with less transfer ammount");

      // Owner balance shouldn't have changed.
      expect(await hct.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });
  });
});