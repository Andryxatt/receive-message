import { ethers, JsonRpcProvider } from "ethers";
import { ChainTestnet, ChainToSupportedChainIdTestnet, ChinDomainsTestnet, HELPER_CONTRACTS_TESTNET, rpcUrlsTestnet } from "./constants";
import HelperAbi from "./abis/Helper.json";
import { clusterApiUrl, Connection, Keypair, PublicKey, SystemProgram, TransactionSignature } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import { decodeEventNonceFromMessage, getPrograms, getReceiveMessagePdas } from "./utils";
import * as splToken from "@solana/spl-token";
const recivedMessage = async (networkFrom: string, networkTo: string, transactionHash: string) => {

}

export const getMessageAndAttestation = async (depositForBurnTX: string, dispatchNetwork: string): Promise<any> => {
    const message = "MessageSent(bytes)";
    const bytes = ethers.toUtf8Bytes(message);
    const hash = ethers.keccak256(bytes);
    const rpcUrl = rpcUrlsTestnet[dispatchNetwork as keyof typeof rpcUrlsTestnet];
    const provider = new JsonRpcProvider(rpcUrl);
    const txReceipt = await provider.getTransactionReceipt(depositForBurnTX);
    const log1 = txReceipt!.logs.find((log) => log.topics[0] === hash);
    if (log1 !== undefined && log1.data !== undefined) {
        const abiCoder = new ethers.AbiCoder();
        const messageBytes = abiCoder.decode(["bytes"], log1.data);
        const messageHash = ethers.keccak256(messageBytes[0]);
        let attestationResponse = { status: 'pending', attestation: '' };
        const apiUrl = process.env.APP_IRIS_SANDBOX_MAINNET as string;
        while (attestationResponse.status !== 'complete') {
            const response = await fetch(`${apiUrl}${messageHash}`);
            attestationResponse = await response.json();
            console.log(attestationResponse, "attestationResponse");
            if (attestationResponse.status === 'complete') {
                break;
            }
            await new Promise(r => setTimeout(r, 2000));
        }
        return { message: messageBytes[0], attestation: attestationResponse.attestation };
    }
    return { message: undefined, attestation: undefined };
}
export const getMessageAndAttestationTestnet = async (depositForBurnTX: string, dispatchNetwork: string): Promise<any> => {
    try {
        const message = "MessageSent(bytes)";
        const bytes = ethers.toUtf8Bytes(message);
        const hash = ethers.keccak256(bytes);
        const rpcUrl = rpcUrlsTestnet[dispatchNetwork as keyof typeof ChainTestnet];
        const provider = new JsonRpcProvider(rpcUrl);
        const txReceipt = await provider.getTransactionReceipt(depositForBurnTX);
        const log1 = txReceipt!.logs.find((log) => log.topics[0] === hash);
        if (log1 !== undefined && log1.data !== undefined) {
            const abiCoder = new ethers.AbiCoder();
            const messageBytes = abiCoder.decode(["bytes"], log1.data);
            const messageHash = ethers.keccak256(messageBytes[0]);
            let attestationResponse = { status: 'pending', attestation: '' };
            const apiUrl = process.env.APP_IRIS_SANDBOX_TESTNET as string;
            while (attestationResponse.status !== 'complete') {
                const response = await fetch(`${apiUrl}${messageHash}`);
                attestationResponse = await response.json();
                if (attestationResponse.status === 'complete') {
                    break;
                }
                await new Promise(r => setTimeout(r, 2000));
            }
            console.log(attestationResponse, "attestationResponse");
            return { message: messageBytes[0], attestation: attestationResponse.attestation };
        }
        return { message: undefined, attestation: undefined };
    }
    catch (error) {
        console.log(error)
    }

}
export const receiveMessageEvmHelperTestnet = async (message: string, attestation: string,
    dispatchNetwork: string,
    destinationNetwork: string,
    recipientOrigin: string,
    amountOut: string
) => {
    const rpcUrlTo = rpcUrlsTestnet[destinationNetwork as keyof typeof ChainTestnet];
    const destProvider = new ethers.JsonRpcProvider(rpcUrlTo);
    const wallet = new ethers.Wallet(process.env.APP_PRIVATE_KEY_EVM as string, destProvider);
    const expectedChainId = ChainToSupportedChainIdTestnet[destinationNetwork as keyof typeof ChainTestnet];
    const contractHelper = new ethers.Contract(HELPER_CONTRACTS_TESTNET[expectedChainId as keyof typeof HELPER_CONTRACTS_TESTNET], HelperAbi, wallet);
    const receivedMessageTx = await contractHelper.receiveMessage(message, attestation, recipientOrigin, ethers.parseUnits(amountOut, 6));
    const receipt = await receivedMessageTx.wait();
    return receipt;
};
export const receiveMessageSol = async (message: string, attestation: string, dispatchNetwork: any,
    destinationNetwork: any,
    recipientOrigin: string,
    amountOut: string) => {
        try{
            console.log("receiveMessageSol")
            const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
            const privateKeyString = process.env.APP_PRIVATE_KEY_SOL as string;
            const privateKeyArray = privateKeyString.split(',').map(Number);
            const privateKey = Uint8Array.from(privateKeyArray);
            const signer = Keypair.fromSecretKey(privateKey);
            const wallet: any = {
                publicKey: signer.publicKey,
                signTransaction: async (tx: anchor.web3.Transaction) => {
                    tx.partialSign(signer);
                    return tx;
                },
                signAllTransactions: async (transactions: anchor.web3.Transaction[]) => {
                    transactions.forEach(tx => tx.partialSign(signer));
                    return transactions;
                },
            };
            const provider = new anchor.AnchorProvider(connection, wallet, {
                preflightCommitment: "processed",
            });
            anchor.setProvider(provider);
            const { messageTransmitterProgram, tokenMessengerMinterProgram } = getPrograms(provider);
        
        
            const publickKeyUSDC = new PublicKey(destinationNetwork.tokenAddress);
            const publickKeyWallet = new PublicKey(recipientOrigin);
            const userTokenAccount = await splToken.getAssociatedTokenAddress(publickKeyUSDC, publickKeyWallet);
            const remoteTokenAddressHex = dispatchNetwork.tokenAddress;
            const remoteDomain = ChinDomainsTestnet[dispatchNetwork.selectedNetwork as keyof typeof ChainTestnet].toString();
            const nonce = decodeEventNonceFromMessage(message);
            // Get PDAs
            const pdas = await getReceiveMessagePdas(
                { messageTransmitterProgram, tokenMessengerMinterProgram },
                publickKeyUSDC,
                remoteTokenAddressHex,
                remoteDomain,
                nonce
            )
            // accountMetas list to pass to remainingAccounts
            const accountMetas: any[] = [];
            accountMetas.push({
                isSigner: false,
                isWritable: false,
                pubkey: pdas.tokenMessengerAccount.publicKey,
            });
            accountMetas.push({
                isSigner: false,
                isWritable: false,
                pubkey: pdas.remoteTokenMessengerKey.publicKey,
            });
            accountMetas.push({
                isSigner: false,
                isWritable: true,
                pubkey: pdas.tokenMinterAccount.publicKey,
            });
            accountMetas.push({
                isSigner: false,
                isWritable: true,
                pubkey: pdas.localToken.publicKey,
            });
            accountMetas.push({
                isSigner: false,
                isWritable: false,
                pubkey: pdas.tokenPair.publicKey,
            });
            accountMetas.push({
                isSigner: false,
                isWritable: true,
                pubkey: userTokenAccount
            });
            accountMetas.push({
                isSigner: false,
                isWritable: true,
                pubkey: pdas.custodyTokenAccount.publicKey,
            });
            accountMetas.push({
                isSigner: false,
                isWritable: false,
                pubkey: splToken.TOKEN_PROGRAM_ID,
            });
            accountMetas.push({
                isSigner: false,
                isWritable: false,
                pubkey: pdas.tokenMessengerEventAuthority.publicKey,
            });
            accountMetas.push({
                isSigner: false,
                isWritable: false,
                pubkey: tokenMessengerMinterProgram.programId,
            });
            const { blockhash } = await connection.getLatestBlockhash();
            const transaction = new anchor.web3.Transaction({ recentBlockhash: blockhash, feePayer: signer.publicKey });
        
            // Add the instructions to the transaction
            transaction.add(
                await messageTransmitterProgram.methods
                    .receiveMessage({
                        message: Buffer.from(message.replace("0x", ""), "hex"),
                        attestation: Buffer.from(attestation.replace("0x", ""), "hex")
                    })
                    .accounts({
                        payer: signer.publicKey,
                        caller: signer.publicKey,
                        authorityPda: pdas.authorityPda,
                        messageTransmitter: pdas.messageTransmitterAccount.publicKey,
                        usedNonces: pdas.usedNonces,
                        receiver: tokenMessengerMinterProgram.programId,
                        systemProgram: SystemProgram.programId,
                    })
                    .remainingAccounts(accountMetas)
                    .instruction()
            );
        
            // Sign the transaction with the private key
            transaction.partialSign(signer);
        
            // Send the signed transaction
            const txSignature = await connection.sendRawTransaction(transaction.serialize(), {
                skipPreflight: false,
                preflightCommitment: "confirmed",
            });
        
            // Confirm the transaction
            const txHash = await connection.confirmTransaction(txSignature, 'confirmed');
            return txSignature;
        }
        catch(error) {
            console.error(error);
        }
}
