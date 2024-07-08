import { ethers, JsonRpcProvider } from "ethers";
import { CHAIN_IDS_TO_MESSAGE_TRANSMITTER_ADDRESSES_TESTNET, ChainTestnet, ChainToSupportedChainIdTestnet, rpcUrlsTestnet } from "./constants";
import MessageTransmiterAbi from "./abis/MessageTransmitter.json";
export const decodeTxHash = async (networkFrom:string, networkTo:string, transactionHash:string) => {
    // Get transaction receipt with ethers 
    const networkFromEnum = ChainTestnet[networkFrom as keyof typeof ChainTestnet];
    const networkToEnum = ChainTestnet[networkTo as keyof typeof ChainTestnet];
    const rpcEntry = rpcUrlsTestnet.find((rpc) => rpc[networkFromEnum]);
    if (!rpcEntry) {
        console.error('RPC URL not found for the selected network:', networkFrom);
        return;
    }
    const rpcUrl = rpcEntry[networkFromEnum];
    const provider = new JsonRpcProvider(rpcUrl);
    const txReceipt = await provider.getTransactionReceipt(transactionHash);

    // Change this code with ethers.js
    const message = "MessageSent(bytes)";
    const bytes = ethers.toUtf8Bytes(message);
    const hash = ethers.keccak256(bytes);
    const log1 = txReceipt!.logs.find((log) => log.topics[0] === hash);
    if (log1 !== undefined && log1.data !== undefined) {
        const abiCoder = new ethers.AbiCoder();
        const messageBytes = abiCoder.decode(["bytes"], log1.data);
        const messageHash = ethers.keccak256(messageBytes[0]);
        const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
        if (response.ok) {
           const {status, attestation } = await response.json();
           const rpcEntry = rpcUrlsTestnet.find((rpc) => rpc[networkToEnum]);
           if (!rpcEntry) {
            console.error('RPC URL not found for the selected network:', networkToEnum);
            return;
        }
           const rpcUrl = rpcEntry[networkToEnum];
           const destProvider = new ethers.JsonRpcProvider(rpcUrl);
           const MessageTransmiterContract = new ethers.Contract(CHAIN_IDS_TO_MESSAGE_TRANSMITTER_ADDRESSES_TESTNET[ChainToSupportedChainIdTestnet[networkToEnum as ChainTestnet]], MessageTransmiterAbi, destProvider);
           const estimate = await MessageTransmiterContract.receiveMessage.estimateGas(messageBytes[0], 
               attestation
           )
           const wallet = new ethers.Wallet(process.env.APP_PRIVATE_KEY as string, destProvider);
           const MessageTransmiterContractSigner = new ethers.Contract(CHAIN_IDS_TO_MESSAGE_TRANSMITTER_ADDRESSES_TESTNET[ChainToSupportedChainIdTestnet[networkToEnum as ChainTestnet]], MessageTransmiterAbi, wallet);

           const tx = await MessageTransmiterContractSigner.receiveMessage(messageBytes[0], attestation);
           console.log(tx.hash);
           return { gas: ethers.formatEther(estimate), tx: tx.hash }
        }
    }
};
const recivedMessage = async (networkFrom:string, networkTo:string, transactionHash:string) => {

}