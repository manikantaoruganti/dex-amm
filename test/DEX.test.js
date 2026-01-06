const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DEX", () => {
  let dex, tokenA, tokenB, owner, addr1, addr2;
  beforeEach(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    tokenA = await MockERC20.deploy("Token A", "TKA");
    tokenB = await MockERC20.deploy("Token B", "TKB");
    const DEX = await ethers.getContractFactory("DEX");
    dex = await DEX.deploy(tokenA.address, tokenB.address);
    
    await tokenA.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await tokenB.transfer(addr1.address, ethers.utils.parseEther("1000"));
    await tokenA.approve(dex.address, ethers.utils.parseEther("1000000"));
    await tokenB.approve(dex.address, ethers.utils.parseEther("1000000"));
    
    await tokenA.connect(addr1).approve(dex.address, ethers.utils.parseEther("1000000"));
    await tokenB.connect(addr1).approve(dex.address, ethers.utils.parseEther("1000000"));
  });

  describe("Liquidity Management", () => {
    it("should allow initial liquidity provision", async () => {
      const tx = await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
      expect(tx).to.emit(dex, "LiquidityAdded");
      expect(await dex.reserveA()).to.equal(ethers.utils.parseEther("100"));
      expect(await dex.reserveB()).to.equal(ethers.utils.parseEther("200"));
    });

    it("should mint correct LP tokens for first provider", async () => {
      await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
      const lp = await dex.liquidity(owner.address);
      expect(lp).to.be.gt(0);
    });

    it("should allow subsequent liquidity additions", async () => {
      await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
      await dex.addLiquidity(ethers.utils.parseEther("50"), ethers.utils.parseEther("100"));
      expect(await dex.totalLiquidity()).to.be.gt(0);
    });

    it("should allow liquidity removal", async () => {
      await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
      const lp = await dex.liquidity(owner.address);
      await dex.removeLiquidity(lp);
      expect(await dex.totalLiquidity()).to.equal(0);
    });

    it("should revert on zero liquidity addition", async () => {
      await expect(dex.addLiquidity(0, ethers.utils.parseEther("200"))).to.be.revertedWith("Amounts must be > 0");
    });
  });

  describe("Token Swaps", () => {
    beforeEach(async () => {
      await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
    });

    it("should swap token A for token B", async () => {
      const amountOut = await dex.getAmountOut(ethers.utils.parseEther("10"), ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
      expect(amountOut).to.be.gt(0);
      const tx = await dex.connect(addr1).swapAForB(ethers.utils.parseEther("10"));
      expect(tx).to.emit(dex, "Swap");
    });

    it("should swap token B for token A", async () => {
      const tx = await dex.connect(addr1).swapBForA(ethers.utils.parseEther("20"));
      expect(tx).to.emit(dex, "Swap");
    });

    it("should calculate correct output amount with fee", async () => {
      const input = ethers.utils.parseEther("10");
      const rIn = ethers.utils.parseEther("100");
      const rOut = ethers.utils.parseEther("200");
      const amountOut = await dex.getAmountOut(input, rIn, rOut);
      expect(amountOut).to.be.lt(input.mul(2));
    });
  });

  describe("Price Calculations", () => {
    it("should return correct initial price", async () => {
      await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
      const price = await dex.getPrice();
      expect(price).to.be.gt(0);
    });

    it("should return correct reserves", async () => {
      await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
      const [reserveAVal, reserveBVal] = await dex.getReserves();
      expect(reserveAVal).to.equal(ethers.utils.parseEther("100"));
      expect(reserveBVal).to.equal(ethers.utils.parseEther("200"));
    });
  });

  describe("Events", () => {
    it("should emit LiquidityAdded event", async () => {
      await expect(dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"))).to.emit(dex, "LiquidityAdded");
    });

    it("should emit Swap event", async () => {
      await dex.addLiquidity(ethers.utils.parseEther("100"), ethers.utils.parseEther("200"));
      await expect(dex.connect(addr1).swapAForB(ethers.utils.parseEther("10"))).to.emit(dex, "Swap");
    });
  });
});
