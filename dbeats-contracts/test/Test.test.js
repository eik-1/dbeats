const { expect } = require('chai')
const { ethers } = require('hardhat')

describe("DBeatsFactory", function () {
  let DBeatsFactory;
  let dBeatsFactory;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let admin;
  const Admin_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ADMIN_ROLE"));
  const Artist_role = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("ARTIST_ROLE"));
  const Default_admin_role = "0x0000000000000000000000000000000000000000000000000000000000000000";
  let platformWalletAddress = "0x1ABc133C222a185fEde2664388F08ca12C208F76";// this will be a multisig wallet on the final deployment
  const platformFeePercentage = 10;
  
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    DBeatsFactory = await ethers.getContractFactory("DBeatsFactory");
    [owner, addr1, addr2, addr3, platformWallet, admin, _] = await ethers.getSigners();
    // Deploy the contract
    dBeatsFactory = await DBeatsFactory.deploy(platformWalletAddress, platformFeePercentage);
    // console.log("DBeats Factory deployed to :", dBeatsFactory.target);
    
  });

  

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      //set owner to deployer
      expect(await dBeatsFactory.owner()).to.equal(owner.address);
    });

    
    it("Should assign admin role to user", async function () {
     
      //set admin_role to addr1
      await dBeatsFactory.addUserToRole(Admin_role, admin.address);
      expect(await dBeatsFactory.hasRole(Admin_role, admin.address)).to.equal(true);
    });

    it("Should set platform wallet address", async function () {
      expect(await dBeatsFactory.platformWalletAddress()).to.equal(platformWalletAddress);
    });


    // give artist role to a user ( only default admin can grant roles )
    it("Should give artist role to user", async function () {
      await dBeatsFactory.addUserToRole(Default_admin_role, admin.address);
      const isDefaultAdmin = await dBeatsFactory.hasRole(Default_admin_role, admin.address);
      await dBeatsFactory.addUserToRole(Admin_role, admin.address);
      const aurthorisedAdminUser = dBeatsFactory.connect(admin);
      await aurthorisedAdminUser.addArtist(addr2.address);
      const res = await dBeatsFactory.hasRole(Artist_role, addr2.address);
      expect(await dBeatsFactory.hasRole(Default_admin_role, admin.address)).to.equal(true);
      expect(await dBeatsFactory.hasRole(Admin_role, admin.address)).to.equal(true);
      expect(await dBeatsFactory.hasRole(Artist_role, addr2.address)).to.equal(true);
    })
  });

  describe("Create NFT", function () {

    async function createNFT() {
      const artistUser = dBeatsFactory.connect(addr1);
      const mintPrice = 1000000
      await artistUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        "hipHop"
      );
    }

    beforeEach(async function () {
      await dBeatsFactory.addUserToRole(Default_admin_role, admin.address);
      await dBeatsFactory.hasRole(Default_admin_role, admin.address);
      await dBeatsFactory.addUserToRole(Admin_role, admin.address);
      const aurthorisedAdminUser = dBeatsFactory.connect(admin);
      await aurthorisedAdminUser.addArtist(addr1.address);

 
    });

    it("Should create new NFT contract", async function () {
      await createNFT();
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address,0)  
      expect(await dBeatsFactory.nftsByCreator(addr1.address,0)).to.equal(newNftAddress);
    });

    it("New NFT Contract should be owned by the factory contract", async function () {
      await createNFT();
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address,0)
      const NFTcontract = await ethers.getContractAt("DBeatsNFT", newNftAddress);
      const newNFTContractOwner = await NFTcontract.owner();
      expect(dBeatsFactory.address).to.equal(newNFTContractOwner);
    });

    it("Should check mint price is set", async function () {
      const artistUser = dBeatsFactory.connect(addr1);
      const mintPrice = 1000000
      await artistUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        "hipHop"
      );

      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address,0)
      const NFTcontract = await ethers.getContractAt("DBeatsNFT", newNftAddress);
      const listedMintPrice = await NFTcontract._mintPrice();
      expect(listedMintPrice).to.equal(mintPrice);
    });

    it("Should mint new NFT to a new user", async function () {
      const artistUser = dBeatsFactory.connect(addr1);
      const mintPrice = 1000000
      await artistUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        "hipHop"
      );
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address,0)
      const NFTcontract = await ethers.getContractAt("DBeatsNFT", newNftAddress);
      const connectUserToContract = NFTcontract.connect(addr2);
      await connectUserToContract.mint(addr2.address, 1, { value: mintPrice });
      expect(await NFTcontract.balanceOf(addr2.address)).to.equal(1);
    });

    it("Should return the balance of the NFT contract after minting", async function () {
      const artistUser = dBeatsFactory.connect(addr1);
      const mintPrice = 1000000
      await artistUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        "hipHop"
      );
      const endBalance = mintPrice - (platformFeePercentage * mintPrice) / 100
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address,0)
      const NFTcontract = await ethers.getContractAt("DBeatsNFT", newNftAddress);
      const connectUserToContract = NFTcontract.connect(addr2);
      await connectUserToContract.mint(addr2.address, 1, { value: mintPrice });
      const contractBalance = await ethers.provider.getBalance(newNftAddress);
      expect(await ethers.provider.getBalance(newNftAddress)).to.equal(endBalance);
    });

    it("should withdraw the balance to artist address from the NFT contract", async function () {
      const artistUser = dBeatsFactory.connect(addr1);
      const mintPrice = 1000000
      await artistUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        "hipHop"
      );
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address,0)
      const NFTcontract = await ethers.getContractAt("DBeatsNFT", newNftAddress);
      const connectUserToContract = NFTcontract.connect(addr2);
      await connectUserToContract.mint(addr2.address, 1, { value: mintPrice });
      const connectArtistToContract = NFTcontract.connect(addr1);
      await connectArtistToContract.withdraw();
      expect(await ethers.provider.getBalance(newNftAddress)).to.equal(0);
    });

    it("should not allow non artist to withdraw the balance from an NFT contract", async function () {
      const artistUser = dBeatsFactory.connect(addr1);
      const mintPrice = 1000000
      await artistUser.createNFT(
        addr1.address,
        "https://ipfs.io/ipfs/QmYhXxj8Xg2qjW8q6b8vLbZgA7UjF9sWn6yM7a5WqYwF6",
        "DBeats",
        "DBT",
        mintPrice,
        "hipHop"
      );
    
      const newNftAddress = await dBeatsFactory.nftsByCreator(addr1.address, 0);
      const NFTcontract = await ethers.getContractAt("DBeatsNFT", newNftAddress);
      const connectUserToContract = NFTcontract.connect(addr2);
      await connectUserToContract.mint(addr2.address, 1, { value: mintPrice });
      await expect(connectUserToContract.withdraw()).to.be.revertedWith("Only artist can call this function");
    });

    it("Should update the platform fee percentage", async function () {
      const platformFeePercentage = await dBeatsFactory.platformFeePercentage();
      expect(platformFeePercentage).to.equal(10);
      await dBeatsFactory.updatePlatformFee(20);
      expect(await dBeatsFactory.platformFeePercentage()).to.equal(20);
  });



  });
  
});
