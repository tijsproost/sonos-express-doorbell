"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const NodeSonos = __importStar(require("@svrooij/sonos"));
const express_1 = __importDefault(require("express"));
const playNotification_1 = require("./modules/playNotification");
const app = (0, express_1.default)();
app.use(express_1.default.json()); //body parser
const SonosManager = NodeSonos.SonosManager;
const manager = new SonosManager();
const port = parseInt(process.env.PORT || '3000', 10);
app.get('/', (req, res) => {
    try {
        manager
            .InitializeWithDiscovery(10)
            .then(console.log)
            .then(() => {
            // @ts-ignore
            const devices = [];
            manager.Devices.forEach(d => {
                devices.push(`Device ${d.Name} (${d.Uuid}) is joined in ${d.GroupName}`);
            });
            res.send(devices);
        })
            .catch(console.error);
    }
    catch (err) {
        res.status(500).send(err);
    }
});
app.post('/playNotification', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { localIP, sound, volume } = req.body;
    try {
        yield (0, playNotification_1.playNotification)({
            localIP,
            sound,
            volume,
        });
        res.send();
    }
    catch (err) {
        res.status(500).send(err);
    }
}));
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
