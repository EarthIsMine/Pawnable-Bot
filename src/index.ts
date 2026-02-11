import { config } from "./config.js";
import { getWalletAddress } from "./contract.js";
import { start } from "./bot.js";

console.log("=== PawnableBot ===");
console.log(`Wallet:   ${getWalletAddress()}`);
console.log(`RPC:      ${config.rpcUrl}`);
console.log(`Contract: ${config.contractAddress}`);
console.log(`Backend:  ${config.backendUrl}`);
console.log(`Interval: ${config.scanIntervalMs / 1000}s`);
console.log("===================\n");

start();
