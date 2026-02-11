import { config } from "./config.js";

export interface Loan {
  id: string;
  loanId: string;
  status: string;
  borrower: { address: string };
  lender: { address: string };
  startTimestamp: string;
  dueTimestamp: string;
}

interface LoansResponse {
  success: boolean;
  data: {
    loans: Loan[];
    total: number;
    limit: number;
    offset: number;
  };
}

export async function getOngoingLoans(): Promise<Loan[]> {
  const allLoans: Loan[] = [];
  let offset = 0;
  const limit = 100;

  while (true) {
    const url = `${config.backendUrl}/api/loans?status=ONGOING&limit=${limit}&offset=${offset}`;
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Backend API error: ${res.status} ${res.statusText}`);
    }

    const body = (await res.json()) as LoansResponse;

    if (!body.success) {
      throw new Error("Backend returned success=false");
    }

    allLoans.push(...body.data.loans);

    if (allLoans.length >= body.data.total) break;
    offset += limit;
  }

  return allLoans;
}

export async function updateLoanStatus(
  id: string,
  status: "CLAIMED",
  txHash: string
): Promise<void> {
  const url = `${config.backendUrl}/api/loans/${id}/status`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, txHash }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to update loan status: ${res.status} ${res.statusText}`
    );
  }
}
