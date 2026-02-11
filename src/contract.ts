import { ethers } from "ethers";
import { config } from "./config.js";
import abi from "./abi/PawnableLoan.json" with { type: "json" };

const LOAN_STATUS_ONGOING = 0;

const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);
const contract = new ethers.Contract(config.contractAddress, abi, wallet);

export interface OnchainLoan {
  loanId: number;
  dueTimestamp: number;
  status: number;
}

export function getWalletAddress(): string {
  return wallet.address;
}

export async function getNextLoanId(): Promise<number> {
  return Number(await contract.nextLoanId());
}

export async function getOngoingExpiredLoans(): Promise<OnchainLoan[]> {
  const nextId = await getNextLoanId();
  if (nextId === 0) return [];

  const now = Math.floor(Date.now() / 1000);
  const expired: OnchainLoan[] = [];

  for (let i = 0; i < nextId; i++) {
    try {
      const loan = await contract.getLoan(i);
      if (
        Number(loan.status) === LOAN_STATUS_ONGOING &&
        Number(loan.dueTimestamp) < now
      ) {
        expired.push({
          loanId: i,
          dueTimestamp: Number(loan.dueTimestamp),
          status: Number(loan.status),
        });
      }
    } catch {
      continue;
    }
  }

  return expired;
}

export async function claimCollateral(
  loanId: number
): Promise<ethers.TransactionReceipt> {
  const tx = await contract.claimCollateral(loanId);
  const receipt = await tx.wait();
  return receipt;
}
