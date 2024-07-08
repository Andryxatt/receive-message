import express, { Request, Response } from 'express';
import cors from 'cors';
import { decodeTxHash } from './service';
import { WebSocketServer, WebSocket } from 'ws';
import { BlockConfirmationTestnet, ChainTestnet, rpcUrlsTestnetRecord, wssUrlsTestnet } from './constants';
import { ethers } from 'ethers';

const app = express();
const port = 3001;

// Use the CORS middleware
app.use(cors({
    origin: 'http://localhost:3000' // Allow only requests from this origin
}));

app.use(express.json()); // To parse JSON bodies

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
});

app.post('/receive-message', async (req: Request, res: Response) => {
    console.log(req.body);
    if (!req.body.transactionHash) {
        return res.status(400).send('Transaction hash is required');
    }
    const {dispatchNetwork, destinationNetwork, transactionHash} = req.body;
    try {
        const networkFrom = dispatchNetwork as ChainTestnet;
        const jsonRpcProvider = new ethers.JsonRpcProvider(rpcUrlsTestnetRecord[networkFrom]);

        const wsProviderUrl = wssUrlsTestnet[networkFrom];
        if (!wsProviderUrl) {
            return res.status(400).send('Unsupported network');
        }

        const provider = new ethers.WebSocketProvider(wsProviderUrl);

        const txReceipt = await jsonRpcProvider.getTransactionReceipt(transactionHash);
        if (!txReceipt) {
            return res.status(404).send('Transaction not found');
        }
        const initialBlockNumber = txReceipt.blockNumber + BlockConfirmationTestnet[networkFrom];
        console.log(`Initial block number: ${initialBlockNumber}`);
        
        const waitForConfirmations = new Promise<any>((resolve, reject) => {
            provider.on('block', async (blockNumber) => {
                console.log(`New block received: ${blockNumber}`);

                if (blockNumber >= initialBlockNumber) {
                    provider.off('block'); // Stop listening for new blocks
                    console.log(`Transaction confirmed at block ${blockNumber}`);
                    try {
                        const data = await decodeTxHash(networkFrom, destinationNetwork, transactionHash);
                        resolve(data); // Resolve with the data
                    } catch (error) {
                        console.error("Error decoding transaction:", error);
                        reject(new Error('Internal Server Error'));
                    }
                }
            });

            // Add a timeout to handle cases where the confirmation takes too long
            setTimeout(() => {
                provider.off('block');
                reject(new Error('Timeout waiting for block confirmations'));
            }, 600000); // 10 minutes
        });

        const decodedData = await waitForConfirmations;
        res.send({ message: 'Message received and transaction decoded!', data: decodedData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
const server = app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});

// Set up WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Function to broadcast messages to all connected clients
const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

// Example event that triggers a notification
app.post('/trigger-event', (req: Request, res: Response) => {
    const data = { message: 'An event has occurred!' };
    broadcast(data);
    res.send('Event triggered and notification sent!');
});
