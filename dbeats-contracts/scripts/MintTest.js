require("dotenv").config();
const NftAddress = "0xd9EFFf0786DF59663fcDFC39C8642f4977470c3c";
const ethers = require('ethers');
const {abi} = require('./abi');
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const Signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const nftContractInstance = new ethers.Contract(NftAddress, abi, Signer);

async function main() {
    const mintPrice = await nftContractInstance._mintPrice();
    console.log(mintPrice);
    const mint = await nftContractInstance.mint(Signer.address, 1, { value: mintPrice });
    console.log(mint);
    console.log("Transaction Hash: ", mint.hash);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });