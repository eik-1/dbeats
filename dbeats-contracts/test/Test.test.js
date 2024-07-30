const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DBeatsFactory", function () {
  let DBeatsFactory;
  let dBeatsFactory;
  let owner;
  let addr1;
  let addr2;
  let admin;
  const Admin_role = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes("ADMIN_ROLE")
  );
  let royaltyFeePercent = 10;
  let platformWalletAddress = "0x1ABc133C222a185fEde2664388F08ca12C208F76";

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    DBeatsFactory = await ethers.getContractFactory("DBeatsFactory");
    [owner, addr1, addr2, admin, _] = await ethers.getSigners();
    // Deploy the contract
    dBeatsFactory = await DBeatsFactory.deploy(platformWalletAddress);
    // console.log("DBeats Factory deployed to :", dBeatsFactory.target);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      //set owner to deployer
      expect(await dBeatsFactory.owner()).to.equal(owner.address);
    });

    it("Should assign role to user", async function () {
      //set admin_role to addr1
      await dBeatsFactory.addUserToRole(Admin_role, addr1.address);
      expect(await dBeatsFactory.hasRole(Admin_role, addr1.address)).to.equal(
        true
      );
    });

    it("Should set platform wallet address", async function () {
      expect(await dBeatsFactory.platformWalletAddress()).to.equal(
        platformWalletAddress
      );
    });
  });

  describe("Create NFT", function () {
    beforeEach(async function () {
      await dBeatsFactory.addUserToRole(Admin_role, addr1.address);
    });

    it("Should create new NFT contract", async function () {
      const aurthorisedAdminUser = dBeatsFactory.connect(addr1);
      const mintPrice = 1000000;
      await aurthorisedAdminUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        10,
        royaltyFeePercent
      );

      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address, 0);
      expect(await dBeatsFactory.nftsByCreator(addr1.address, 0)).to.equal(
        newNftAddress
      );
    });

    it("Should set the platform wallet address", async function () {
      const aurthorisedAdminUser = dBeatsFactory.connect(addr1);
      const mintPrice = 1000000;
      await aurthorisedAdminUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        10,
        royaltyFeePercent
      );
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address, 0);
      const NFTcontract = await ethers.getContractAt(
        "DBeatsNFT",
        newNftAddress
      );
      expect(await NFTcontract._platformWalletAddress()).to.equal(
        platformWalletAddress
      );
    });

    it("New NFT Contract should be owned by the factory contract", async function () {
      const aurthorisedAdminUser = dBeatsFactory.connect(addr1);
      const mintPrice = 1000000;
      await aurthorisedAdminUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        10,
        royaltyFeePercent
      );
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address, 0);
      const NFTcontract = await ethers.getContractAt(
        "DBeatsNFT",
        newNftAddress
      );
      const newNFTContractOwner = await NFTcontract.owner();
      expect(dBeatsFactory.address).to.equal(newNFTContractOwner);
    });

    it("Should check mint price is set", async function () {
      const mintPrice = 1000000;
      const aurthorisedAdminUser = dBeatsFactory.connect(addr1);
      await aurthorisedAdminUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        10,
        royaltyFeePercent
      );

      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address, 0);
      const NFTcontract = await ethers.getContractAt(
        "DBeatsNFT",
        newNftAddress
      );
      const listedMintPrice = await NFTcontract._mintPrice();
      expect(listedMintPrice).to.equal(mintPrice);
    });

    it("Should mint new NFT to a new user", async function () {
      const mintPrice = 1000000;
      const aurthorisedAdminUser = dBeatsFactory.connect(addr1);
      await aurthorisedAdminUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        10,
        royaltyFeePercent
      );
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address, 0);
      const NFTcontract = await ethers.getContractAt(
        "DBeatsNFT",
        newNftAddress
      );
      const connectUserToContract = NFTcontract.connect(addr2);
      await connectUserToContract.mint(addr2.address, 1, { value: mintPrice });
      expect(await NFTcontract.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should return the balance of the NFT contract after minting", async function () {
      const mintPrice = 1000000;
      const aurthorisedAdminUser = dBeatsFactory.connect(addr1);
      await aurthorisedAdminUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        10,
        royaltyFeePercent
      );
      const endBalance = mintPrice - (royaltyFeePercent * mintPrice) / 100;
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address, 0);
      const NFTcontract = await ethers.getContractAt(
        "DBeatsNFT",
        newNftAddress
      );
      const connectUserToContract = NFTcontract.connect(addr2);
      await connectUserToContract.mint(addr2.address, 1, { value: mintPrice });
      const contractBalance = await ethers.provider.getBalance(newNftAddress);
      expect(await ethers.provider.getBalance(newNftAddress)).to.equal(
        endBalance
      );
    });

    it("should withdraw the balance to artist address from the NFT contract", async function () {
      const mintPrice = 1000000;
      const aurthorisedAdminUser = dBeatsFactory.connect(addr1);
      await aurthorisedAdminUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        10,
        royaltyFeePercent
      );
      const endBalance = mintPrice - (royaltyFeePercent * mintPrice) / 100;
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address, 0);
      const NFTcontract = await ethers.getContractAt(
        "DBeatsNFT",
        newNftAddress
      );
      const connectUserToContract = NFTcontract.connect(addr2);
      await connectUserToContract.mint(addr2.address, 1, { value: mintPrice });
      const connectArtistToContract = NFTcontract.connect(addr1);
      await connectArtistToContract.withdraw();
      expect(await ethers.provider.getBalance(newNftAddress)).to.equal(0);
    });

    it("should not allow non artist to withdraw the balance from an NFT contract", async function () {
      const mintPrice = 1000000;
      const authorizedAdminUser = dBeatsFactory.connect(addr1);
      await authorizedAdminUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        10,
        royaltyFeePercent
      );

      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address, 0);
      const NFTcontract = await ethers.getContractAt(
        "DBeatsNFT",
        newNftAddress
      );
      const connectUserToContract = NFTcontract.connect(addr2);
      await connectUserToContract.mint(addr2.address, 1, { value: mintPrice });
      await expect(connectUserToContract.withdraw()).to.be.revertedWith(
        "Only artist can call this function"
      );
    });
  });
});
