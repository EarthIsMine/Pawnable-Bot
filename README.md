# PawnableBot

Automated collateral claim bot for the PAWNABLE P2P lending platform.

Scans on-chain loans directly via `nextLoanId()` + `getLoan()`, and calls `claimCollateral()` for expired ones.

## How It Works

1. Reads all loans from the smart contract (`nextLoanId` + `getLoan`)
2. Filters loans where `status == ONGOING` and `dueTimestamp < now`
3. Sends `claimCollateral(loanId)` transaction
4. Logs and continues on failure — no special permissions required, no backend dependency

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
├── contract.ts     # On-chain reads + claimCollateral
└── abi/
    └── PawnableLoan.json
```

## Network

| | |
|---|---|
| Network | Base Sepolia Testnet |
| Chain ID | 84532 |
| Contract | `0xBDB3c41A11731023f3ca1a8dAB1838388Bac0ED1` |
