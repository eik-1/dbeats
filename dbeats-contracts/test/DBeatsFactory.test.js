const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DBeatsFactory", function () {
  let DBeatsFactory;
  let dBeatsFactory;
  let owner;
  let addr1;
  let addr2;
  let Admin_role = "0xa49807205ce4d355092ef5a8a18f56e8913cf4a201fbe287825b095693c21775";

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    DBeatsFactory = await ethers.getContractFactory("DBeatsFactory");
    [owner, addr1, addr2, _] = await ethers.getSigners();

    // Deploy the contract
    dBeatsFactory = await DBeatsFactory.deploy();
    // console.log("DBeats Factory deployed to :", dBeatsFactory.target);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await dBeatsFactory.owner()).to.equal(owner.address);
    });

    it("Should assign role to user", async function () {
      const newOwner = await dBeatsFactory.addUserToRole(Admin_role, addr1);
      expect(await dBeatsFactory.hasRole(Admin_role, addr1)).to.equal(true);
    });
  });

  describe("Create NFT", function () {

    it("Should create new NFT", async function () {
      const newOwner = await dBeatsFactory.addUserToRole(Admin_role, owner);
      const newNFT = await dBeatsFactory.createNFT(
        owner,
        addr1,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        1,
        "DBeats",
        "DBT"
      );
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1,0)
      expect(await dBeatsFactory.nftsByCreator(addr1,0)).to.equal(newNftAddress);

    });
  });


});
