import { pinata } from "./pinataConfig";

 const ipfsUpload = async (file) => {
    console.log("uploading to ipfs")
    try {
        console.log(file)
        const upload = await pinata.upload.file(file);
        const cid = upload.data.cid;
        const url = await pinata.gateways.createSignedURL({
            cid,
            expires: 315400000,
        });
        return url;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;  // Rethrow the error to ensure the calling function is aware of the failure
    }
};
export default ipfsUpload;
