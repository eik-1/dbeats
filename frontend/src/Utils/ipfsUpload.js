import { pinata } from "./pinataConfig"

const ipfsUpload = async (file) => {
    try {
        const upload = await pinata.upload.file(file)
        const cid = upload.data.cid
        const url = await pinata.gateways.createSignedURL({
            cid,
            expires: 315400000,
        })
        return cid
    } catch (error) {
        console.error("Error uploading file:", error)
        throw error
    }
}
export default ipfsUpload
