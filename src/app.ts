import express, { Request, Response } from 'express';
import 'dotenv/config';
import cors from 'cors';
import { WebSocketServer, WebSocket } from 'ws';
import { getMessageAndAttestationTestnet, receiveMessageEvmHelperTestnet, receiveMessageSol } from './service';
import { getMessages } from './utils';

const app = express();
const port = 3001;

app.use(cors({
    origin: 'http://localhost:3000', // Allow only requests from this origin
}));
app.use(express.json()); // To parse JSON bodies

// Log startup info
console.log('Starting the server...');

app.get('/', (req: Request, res: Response) => {
    console.log('GET / - Hello World endpoint accessed');
    res.send('Hello World!');
});

app.post('/receive-message', async (req: Request, res: Response) => {
    console.log('POST /receive-message - Request received');
    console.log(`Request body: ${JSON.stringify(req.body)}`);

    if (!req.body.transactionHash) {
        console.log('Transaction hash is missing');
        return res.status(400).send('Transaction hash is required');
    }

    try {
        // Business logic here
        res.send('Transaction processed');
    } catch (error: any) {
        console.error(`Error processing transaction: ${error.message}`);
        res.status(500).send('Internal Server Error');
    }
});

const server = app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

// Set up WebSocket server
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('New WebSocket client connected');
    ws.on('message', async (messageData: any) => {
        try {
            const req = JSON.parse(messageData);
            console.log(`WebSocket message received: ${JSON.stringify(req)}`);

            if (!req.transactionHash) {
                const errorMessage = { error: 'Transaction hash is required' };
                ws.send(JSON.stringify(errorMessage));
                console.log(`WebSocket validation error: ${JSON.stringify(errorMessage)}`);
                return;
            }

           const { dispatchNetwork, destinationNetwork, transactionHash, originRecipient, amountOut } = req;
          
            let receiveMessage;
            if (dispatchNetwork.selectedNetwork === 'SOL') {
                const { message, attestation } = await getMessages(transactionHash);
                console.log(message, attestation, "SOL");
                receiveMessage = await receiveMessageEvmHelperTestnet(
                    message,
                    attestation,
                    dispatchNetwork.selectedNetwork,
                    destinationNetwork.selectedNetwork,
                    originRecipient,
                    amountOut
                )
                ws.send(JSON.stringify({ status: 'complete', message, attestation }));
            }
            else if(destinationNetwork.selectedNetwork === 'SOL') {
                const { message, attestation } = await getMessageAndAttestationTestnet(transactionHash, dispatchNetwork.selectedNetwork);
                receiveMessage = await receiveMessageSol(
                    message,
                    attestation,
                    dispatchNetwork,
                    destinationNetwork,
                    originRecipient,
                    amountOut
                );
                ws.send(JSON.stringify({ status: 'complete', message, attestation }));
            }
            else {
                const { message, attestation } = await getMessageAndAttestationTestnet(transactionHash, dispatchNetwork.selectedNetwork);
                receiveMessage = await receiveMessageEvmHelperTestnet(
                    message,
                    attestation,
                    dispatchNetwork.selectedNetwork,
                    destinationNetwork.selectedNetwork,
                    originRecipient,
                    amountOut
                )
                ws.send(JSON.stringify({ status: 'complete', message, attestation }));
            }
            
            console.log(`Receive message success: ${JSON.stringify(receiveMessage)}`);

            ws.send(JSON.stringify({ status: 'done', success: receiveMessage }));
        } catch (error: any) {
            console.error(`WebSocket error: ${error.message}`);
            ws.send(JSON.stringify({ error: error.message }));
        }
    });
    ws.on('close', () => {
        console.log('WebSocket client disconnected');
    });
});

// Example event that triggers a notification
app.post('/trigger-event', (req: Request, res: Response) => {
    const data = { message: 'An event has occurred!' };
    broadcast(data);
    console.log('Event triggered and notification sent');
    res.send('Event triggered and notification sent!');
});

// Function to broadcast messages to all connected clients
const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
            console.log(`Broadcasted data: ${JSON.stringify(data)}`);
        }
    });
};
