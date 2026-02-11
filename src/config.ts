import "dotenv/config";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  privateKey: requireEnv("PRIVATE_KEY"),
  rpcUrl: requireEnv("RPC_URL"),
  contractAddress: requireEnv("CONTRACT_ADDRESS"),
  scanIntervalMs: Number(process.env.SCAN_INTERVAL_MS ?? "30000"),
} as const;
