import { pinata } from "./pinataConfig";
const jsonUpload = async (props) => {

    console.log("uploading json to ipfs")
    try {
        const upload = await pinata.upload.json(props);
        const cid = upload.data.cid;
        const url = await pinata.gateways.createSignedURL({
            cid,
            expires: 315400000,
        });

        return url;
    } catch (error) {
        console.error("Error uploading file:", error);
    }
    
}

export default jsonUpload