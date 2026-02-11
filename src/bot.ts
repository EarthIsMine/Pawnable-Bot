import { config } from "./config.js";
import { getOngoingLoans, updateLoanStatus } from "./api.js";
import { claimCollateral, isLoanClaimable } from "./contract.js";

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
    const loans = await getOngoingLoans();

    if (loans.length === 0) {
      log("No ongoing loans found");
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const expiredLoans = loans.filter(
      (loan) => Number(loan.dueTimestamp) < now
    );

    if (expiredLoans.length === 0) {
      log(`${loans.length} ongoing loans, none expired`);
      return;
    }

    log(`Found ${expiredLoans.length} expired loan(s) to claim`);

    for (const loan of expiredLoans) {
      try {
        const claimable = await isLoanClaimable(loan.loanId);

        if (!claimable) {
          log(
            `Loan #${loan.loanId} already claimed/repaid on-chain, skipping`
          );
          continue;
        }

        log(`Claiming collateral for loan #${loan.loanId}...`);
        const receipt = await claimCollateral(loan.loanId);
        log(
          `Claimed loan #${loan.loanId} - tx: ${receipt.hash}`
        );

        try {
          await updateLoanStatus(loan.id, "CLAIMED", receipt.hash);
          log(`Updated backend status for loan #${loan.loanId}`);
        } catch (apiError) {
          logError(
            `Failed to update backend for loan #${loan.loanId}`,
            apiError
          );
        }
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
