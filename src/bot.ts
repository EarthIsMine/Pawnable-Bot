import { config } from "./config.js";
import { getOngoingExpiredLoans, claimCollateral } from "./contract.js";

let scanning = false;

function log(message: string) {
  console.log(`[${new Date().toISOString()}] ${message}`);
}

function logError(message: string, error: unknown) {
  const errMsg = error instanceof Error ? error.message : String(error);
  console.error(`[${new Date().toISOString()}] ${message}: ${errMsg}`);
}

async function scan(): Promise<void> {
  if (scanning) {
    log("Previous scan still running, skipping...");
    return;
  }

  scanning = true;

  try {
    const expired = await getOngoingExpiredLoans();

    if (expired.length === 0) {
      log("No expired loans to claim");
      return;
    }

    log(`Found ${expired.length} expired loan(s) to claim`);

    for (const loan of expired) {
      try {
        log(`Claiming collateral for loan #${loan.loanId}...`);
        const receipt = await claimCollateral(loan.loanId);
        log(`Claimed loan #${loan.loanId} - tx: ${receipt.hash}`);
      } catch (error) {
        logError(`Failed to claim loan #${loan.loanId}`, error);
      }
    }
  } catch (error) {
    logError("Scan cycle failed", error);
  } finally {
    scanning = false;
  }
}

export function start(): void {
  log("Starting first scan...");
  scan();
  setInterval(scan, config.scanIntervalMs);
  log(`Bot running - scanning every ${config.scanIntervalMs / 1000}s`);
}
