import { ethers } from "ethers";
import { config } from "./config.js";
import abi from "./abi/PawnableLoan.json" with { type: "json" };

const LOAN_STATUS_ONGOING = 0;

const provider = new ethers.JsonRpcProvider(config.rpcUrl);
const wallet = new ethers.Wallet(config.privateKey, provider);
const contract = new ethers.Contract(config.contractAddress, abi, wallet);

export function getWalletAddress(): string {
  return wallet.address;
}

export async function getOnchainLoanStatus(loanId: string): Promise<number> {
  const loan = await contract.getLoan(loanId);
  return Number(loan.status);
}

export async function isLoanClaimable(loanId: string): Promise<boolean> {
  const status = await getOnchainLoanStatus(loanId);
  return status === LOAN_STATUS_ONGOING;
}

export async function claimCollateral(
  loanId: string
): Promise<ethers.TransactionReceipt> {
  const tx = await contract.claimCollateral(loanId);
  const receipt = await tx.wait();
  return receipt;
}
