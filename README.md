# PawnableBot

Automated collateral claim bot for the PAWNABLE P2P lending platform.

Periodically scans for expired loans and calls `claimCollateral()` on-chain to transfer collateral to lenders.

## How It Works

1. Polls the backend API every 30s for `ONGOING` loans
2. Filters loans where `dueTimestamp < now`
3. Verifies on-chain status via `getLoan()` (double-check)
4. Sends `claimCollateral(loanId)` transaction
5. Updates backend loan status to `CLAIMED` on success
6. Logs and continues on failure — no special permissions required

## Setup

```bash
cp .env.example .env
# Edit .env with your values

pnpm install
```

## Environment Variables

| Variable | Required | Description | Default |
|---|---|---|---|
| `PRIVATE_KEY` | Yes | Bot wallet private key | - |
| `RPC_URL` | Yes | Base Sepolia RPC endpoint | - |
| `CONTRACT_ADDRESS` | Yes | PawnableLoan contract address | - |
| `BACKEND_URL` | Yes | Backend API base URL | - |
| `SCAN_INTERVAL_MS` | No | Scan interval in milliseconds | `30000` |

## Usage

```bash
pnpm dev      # Development (hot reload)
pnpm build    # Build
pnpm start    # Production
```

## Project Structure

```
src/
├── index.ts        # Entrypoint
├── config.ts       # Environment config
├── bot.ts          # Scan loop
├── api.ts          # Backend API client
├── contract.ts     # Smart contract interaction
└── abi/
    └── PawnableLoan.json
```

## Network

| | |
|---|---|
| Network | Base Sepolia Testnet |
| Chain ID | 84532 |
| Contract | `0xBDB3c41A11731023f3ca1a8dAB1838388Bac0ED1` |
