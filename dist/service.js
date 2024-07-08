"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeTxHash = void 0;
const ethers_1 = require("ethers");
const constants_1 = require("./constants");
const MessageTransmitter_json_1 = __importDefault(require("./abis/MessageTransmitter.json"));
const decodeTxHash = (networkFrom, networkTo, transactionHash) => __awaiter(void 0, void 0, void 0, function* () {
    // Get transaction receipt with ethers 
    const rpcEntry = constants_1.rpcUrlsTestnet.find((rpc) => rpc[networkFrom]);
    if (!rpcEntry) {
        console.error('RPC URL not found for the selected network:', networkFrom);
        return;
    }
    const rpcUrl = rpcEntry[networkFrom];
    const provider = new ethers_1.JsonRpcProvider(rpcUrl);
    const txReceipt = yield provider.getTransactionReceipt(transactionHash);
    // Change this code with ethers.js
    const message = "MessageSent(bytes)";
    const bytes = ethers_1.ethers.toUtf8Bytes(message);
    const hash = ethers_1.ethers.keccak256(bytes);
    const log1 = txReceipt.logs.find((log) => log.topics[0] === hash);
    if (log1 !== undefined && log1.data !== undefined) {
        const abiCoder = new ethers_1.ethers.AbiCoder();
        const messageBytes = abiCoder.decode(["bytes"], log1.data);
        console.log("messageBytes", messageBytes[0]);
        const messageHash = ethers_1.ethers.keccak256(messageBytes[0]);
        console.log("messageHash", messageHash);
        const response = yield fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
        console.log("response", response);
        if (response.ok) {
            const { status, attestation } = yield response.json();
            console.log("attestationResponse", attestation);
            console.log("status", status);
            const rpcEntry = constants_1.rpcUrlsTestnet.find((rpc) => rpc[networkFrom]);
            if (!rpcEntry) {
                console.error('RPC URL not found for the selected network:', networkTo);
                return;
            }
            const rpcUrl = rpcEntry[networkTo];
            const destProvider = new ethers_1.ethers.JsonRpcProvider(rpcUrl);
            const MessageTransmiterContract = new ethers_1.ethers.Contract(constants_1.CHAIN_IDS_TO_MESSAGE_TRANSMITTER_ADDRESSES_TESTNET[constants_1.ChainToSupportedChainIdTestnet[networkTo]], MessageTransmitter_json_1.default, destProvider);
            const estimate = yield MessageTransmiterContract.receiveMessage.estimateGas(messageBytes[0], attestation);
            console.log("estimate", ethers_1.ethers.formatEther(estimate));
        }
    }
});
exports.decodeTxHash = decodeTxHash;
