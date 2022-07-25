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
Object.defineProperty(exports, "__esModule", { value: true });
exports.playNotification = void 0;
const lib_1 = require("@svrooij/sonos/lib");
const playNotification = ({ sound, localIP, volume, delayMs, timeout, }) => {
    return new Promise((resolve, reject) => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const sonos = new lib_1.SonosDevice(localIP || '192.168.1.40');
            sonos
                .PlayNotification({
                trackUri: sound ||
                    'https://cdn.smartersoft-group.com/various/pull-bell-short.mp3',
                onlyWhenPlaying: false,
                timeout: timeout || 10,
                volume: volume || 40,
                delayMs: delayMs || 700, // Pause between commands in ms, (when sonos fails to play notification often).
            })
                .then(played => {
                console.log('Played notification(s) %o', played);
                sonos.CancelEvents();
                setTimeout(() => {
                    resolve(true);
                }, 5000);
            })
                .catch(error => {
                reject(error);
            });
        }))();
    });
};
exports.playNotification = playNotification;
