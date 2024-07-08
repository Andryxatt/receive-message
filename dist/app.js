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
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const service_1 = require("./service");
const app = (0, express_1.default)();
const port = 3001;
// Use the CORS middleware
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000' // Allow only requests from this origin
}));
app.use(express_1.default.json()); // To parse JSON bodies
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.post('/receive-message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    if (!req.body.transactionHash) {
        return res.status(400).send('Transaction hash is required');
    }
    try {
        yield (0, service_1.decodeTxHash)(req.body.networkFrom, req.body.networkTo, req.body.transactionHash);
        res.send('Message received!');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
}));
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
