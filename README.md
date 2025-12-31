# dex-amm

A simplified Decentralized Exchange (DEX) using the Automated Market Maker (AMM) model, similar to Uniswap V2

## Overview

This project implements a complete DEX (Decentralized Exchange) with an Automated Market Maker (AMM) protocol. It allows users to:

- Add liquidity to trading pairs
- Remove liquidity from pools
- Swap tokens with a 0.3% trading fee
- Query prices and reserves
- Calculate output amounts with proper fee accounting

## Project Structure

```
dex-amm/
├── contracts/
│   ├── DEX.sol              # Main DEX contract with AMM implementation
│   └── MockERC20.sol        # Mock ERC20 token for testing
├── test/
│   └── DEX.test.js          # Comprehensive test suite (25+ test cases)
├── scripts/
│   └── deploy.js            # Deployment script
├── Dockerfile               # Docker container setup
├── docker-compose.yml       # Docker Compose configuration
├── .dockerignore             # Docker ignore patterns
├── .gitignore               # Git ignore patterns
├── hardhat.config.js        # Hardhat configuration
├── package.json             # Project dependencies
└── README.md                # This file
```

## Smart Contracts

### DEX.sol

The main contract implementing the AMM protocol with the following functions:

#### Public Functions

- `addLiquidity(uint256 amountADesired, uint256 amountBDesired)` - Add liquidity to the pool
- `removeLiquidity(uint256 liquidity)` - Remove liquidity from the pool
- `swapAForB(uint256 amountIn)` - Swap Token A for Token B
- `swapBForA(uint256 amountIn)` - Swap Token B for Token A

#### View Functions

- `getReserves()` - Returns current reserves of both tokens
- `getPrice()` - Returns the price of Token A in terms of Token B
- `getAmountOut(uint256 amountIn, uint256 reserveIn, uint256 reserveOut)` - Calculate output amount
- `balanceOf(address account)` - Get LP token balance
- `totalSupply()` - Get total LP token supply

### MockERC20.sol

A mock ERC20 token implementation for testing purposes:

- Standard ERC20 interface
- Customizable name, symbol, and initial supply
- Used for both Token A and Token B in the AMM

## Key Features

### Automated Market Maker (AMM)

- Uses the constant product formula: `x * y = k`
- Supports token swaps with liquidity pool
- Liquidity providers earn transaction fees (0.3%)

### Trading Fee

- 0.3% fee on all swaps
- Fee is deducted from input amount: `amountInWithFee = amountIn * 997 / 1000`
- Formula for output: `amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee)`

### Slippage Protection

- Price calculations account for pool state changes
- Users see exact output before executing swaps

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker and Docker Compose (for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/manikantaoruganti/dex-amm.git
cd dex-amm

# Install dependencies
npm install
```

### Configuration

Update `hardhat.config.js` with your preferred network settings:

```javascript
module.exports = {
  solidity: "0.8.19",
  networks: {
    hardhat: {},
    // Add other networks as needed
  },
};
```

## Running Tests

### Local Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run coverage

# Run specific test file
npx hardhat test test/DEX.test.js
```

### Docker Testing

```bash
# Build and run tests in Docker
docker-compose up -d
docker-compose exec app npm test

# Stop Docker containers
docker-compose down
```

## Deployment

### Using Hardhat

```bash
# Deploy to local Hardhat network
npx hardhat run scripts/deploy.js

# Deploy to specific network
npx hardhat run scripts/deploy.js --network <network-name>
```

### Using Docker

```bash
# Deploy using Docker
docker-compose exec app npx hardhat run scripts/deploy.js
```

## Test Coverage

The project includes comprehensive test cases covering:

- **Initialization**: Contract deployment and state verification
- **Liquidity Management**: Adding and removing liquidity
- **Token Swaps**: Both directions (A→B and B→A)
- **Price Calculations**: Price and amount out queries
- **Edge Cases**: Zero amounts, insufficient liquidity, maximum transfers
- **Fee Calculations**: Correct fee deduction and accounting
- **Reserve Updates**: Proper state management after operations

### Test Files

- `test/DEX.test.js` - Main test suite with 25+ test cases

## Mathematical Formulas

### Constant Product Formula

```
reserveA * reserveB = constant (k)
```

### Swap Amount Calculation

```
amountInWithFee = amountIn * 997 / 1000  (0.3% fee)
amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee)
```

### LP Token Calculation

```
Liquidity = sqrt(amountA * amountB)
```

## Gas Optimization

- Uses efficient Solidity 0.8.19 features
- Minimal storage operations
- Optimized mathematical calculations

## Security Considerations

- No external calls to untrusted contracts
- Safe math operations (built-in overflow/underflow checks in Solidity 0.8+)
- Proper access control for critical functions
- All token operations validated

## Limitations

- Not audited - for educational/testing purposes only
- Uses mock tokens - not suitable for production
- Single liquidity pool per token pair
- No governance mechanism

## Technology Stack

- **Smart Contracts**: Solidity 0.8.19
- **Development Framework**: Hardhat
- **Testing Framework**: Hardhat with Chai
- **Container**: Docker & Docker Compose
- **Node.js Runtime**: Latest LTS

## License

MIT License

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

## Support

For issues and questions:
1. Check the test files for usage examples
2. Review the contract comments for implementation details
3. Run tests locally to verify functionality

## Acknowledgments

This project is inspired by Uniswap V2's AMM model and serves as an educational implementation of DEX concepts.
