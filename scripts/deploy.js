const hre = require("hardhat");

async function main() {
  console.log("Deploying DEX contract...");

  // Deploy MockERC20 Token A
  const MockERC20A = await hre.ethers.getContractFactory("MockERC20");
  const tokenA = await MockERC20A.deploy("Token A", "TKNA", hre.ethers.parseEther("1000000"));
  await tokenA.waitForDeployment();
  console.log("TokenA deployed to:", await tokenA.getAddress());

  // Deploy MockERC20 Token B
  const MockERC20B = await hre.ethers.getContractFactory("MockERC20");
  const tokenB = await MockERC20B.deploy("Token B", "TKNB", hre.ethers.parseEther("1000000"));
  await tokenB.waitForDeployment();
  console.log("TokenB deployed to:", await tokenB.getAddress());

  // Deploy DEX
  const DEX = await hre.ethers.getContractFactory("DEX");
  const dex = await DEX.deploy(await tokenA.getAddress(), await tokenB.getAddress());
  await dex.waitForDeployment();
  console.log("DEX deployed to:", await dex.getAddress());

  console.log("\nDeployment Summary:");
  console.log("TokenA:", await tokenA.getAddress());
  console.log("TokenB:", await tokenB.getAddress());
  console.log("DEX:", await dex.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
