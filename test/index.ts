import { Provider } from "@ethersproject/abstract-provider"
import { expect } from "chai"
import { Signer } from "ethers"
import { ethers } from "hardhat"
import { UBridge, BridgeToken } from "../typechain"

describe("uBridge", function () {
  let contractInstance: UBridge
  let tokenInstance: BridgeToken

  describe("Getters/Setters", () => {
    beforeEach(async () => {
      const [signer] = await ethers.getSigners()
      const signerAddress = await signer.getAddress()
      contractInstance = await deployContract(signerAddress, 1)
      const BridgeToken = await ethers.getContractFactory("BridgeToken")
      tokenInstance = await BridgeToken.deploy(10 ** 9)
    })

    it("Should deploy contract and have the passed parameters", async function () {
      const [signer] = await ethers.getSigners()
      const signerAddress = await signer.getAddress()
      expect(await contractInstance.verifyAddress(), "Wrong verify address").to.be.equal(
        signerAddress
      )
      expect(await (await contractInstance.chainId()).toNumber(), "Wrong chain id").equal(1)
    })

    it("Should change verify address and return new one", async function () {
      const [, second] = await ethers.getSigners()
      const secondAddress = await second.getAddress()
      await contractInstance.changeVerifySigner(secondAddress)
      const verifyAddress = await contractInstance.verifyAddress()
      expect(verifyAddress).equal(secondAddress)
    })

    it("Should add chainId=2,3 to supportedChainIds", async function () {
      const chainIdsToAdd = [2, 3]
      await contractInstance.addChainId(chainIdsToAdd)
      const [c1, c2] = await Promise.all(
        chainIdsToAdd.map((chainId) => contractInstance.chainIdSupported(chainId))
      )
      expect(c1).equal(true)
      expect(c2).equal(true)
    })

    it("Should add chainId=2,3 to supportedChainIds and after remove chainId 3", async function () {
      const chainIdsToAdd = [2, 3]
      await contractInstance.addChainId(chainIdsToAdd)
      const [c1, c2] = await Promise.all(
        chainIdsToAdd.map((chainId) => contractInstance.chainIdSupported(chainId))
      )
      expect(c1).equal(true)
      expect(c2).equal(true)
      await contractInstance.removeChainId(3)
      const c3 = await contractInstance.chainIdSupported(3)
      expect(c3).equal(false)
    })

    it("Should switch the deposits state", async function () {
      const pausedDepositsT0 = await contractInstance.pausedDeposits()
      expect(pausedDepositsT0).equal(false)
      await contractInstance.changeDepositsState(true)
      const pausedDepositsT1 = await contractInstance.pausedDeposits()
      expect(pausedDepositsT1).equal(true)
      await contractInstance.changeDepositsState(false)
      const pausedDepositsT2 = await contractInstance.pausedDeposits()
      expect(pausedDepositsT2).equal(false)
    })

    it("Should add token and verify it in the tokensSupported", async function () {
      await contractInstance.addChainId([1])
      const tokenAddress = tokenInstance.address
      await contractInstance.addToken(tokenAddress, [tokenAddress], [1])
      const isTokenSupported = await contractInstance.tokensSupported(tokenAddress, 1)
      expect(isTokenSupported).equal(tokenAddress)
    })

    it("Should try add token on an unsupported chainId", async function () {
      const tokenAddress = tokenInstance.address
      await expect(contractInstance.addToken(tokenAddress, [tokenAddress], [4])).to.be.revertedWith(
        "CHAIN_ID_NOT_SUPPORTED"
      )
    })
    it("Should add token to multiple chains, verify them in the tokensSupported, remove them and verify again", async function () {
      const chainIds = [1, 2]
      await contractInstance.addChainId(chainIds)
      const tokenAddress = tokenInstance.address
      await contractInstance.addToken(tokenAddress, [tokenAddress, tokenAddress], chainIds)
      const [c1, c2] = await Promise.all(
        chainIds.map((chainId) => contractInstance.tokensSupported(tokenAddress, chainId))
      )
      expect(c1).equal(tokenAddress)
      expect(c2).equal(tokenAddress)
      await contractInstance.removeToken(tokenAddress, chainIds)

      const [c3, c4] = await Promise.all(
        chainIds.map((chainId) => contractInstance.tokensSupported(tokenAddress, chainId))
      )
      expect(Number(c3)).eq(0)
      expect(Number(c4)).eq(0)
    })
  })

  describe("Deposits and Withdraws", () => {
    let secondAddress: string
    let second: string | Signer | Provider
    let secondInstance: UBridge
    let secondTokenInstance: BridgeToken

    beforeEach(async () => {
      const [signer, _second] = await ethers.getSigners()
      second = _second
      const signerAddress = await signer.getAddress()
      contractInstance = await deployContract(signerAddress, 1)
      secondInstance = contractInstance.connect(second)
      const BridgeToken = await ethers.getContractFactory("BridgeToken")
      tokenInstance = await BridgeToken.deploy(10 ** 9)
      secondAddress = await second.getAddress()
      secondTokenInstance = tokenInstance.connect(second)
      await tokenInstance.transfer(secondAddress, 10 ** 9)
    })

    it("Should create a successful deposit", async function () {
      const AMOUNT = 10
      await contractInstance.addChainId([3])
      await contractInstance.addToken(tokenInstance.address, [tokenInstance.address], [3])
      await secondTokenInstance.approve(contractInstance.address, AMOUNT)
      await expect(secondInstance.deposit(tokenInstance.address, AMOUNT, 3))
        .to.emit(contractInstance, "Deposit")
        .withArgs(secondAddress, tokenInstance.address, tokenInstance.address, AMOUNT, 3, 1)
    })

    it("Should deposit fail by CHAIN_ID_NOT_SUPPORTED", async function () {
      const AMOUNT = 10
      await secondTokenInstance.approve(contractInstance.address, AMOUNT)
      await expect(secondInstance.deposit(tokenInstance.address, AMOUNT, 3)).revertedWith(
        "CHAIN_ID_NOT_SUPPORTED"
      )
    })

    it("Should deposit fail by UNSUPPORTED_TOKEN_ON_CHAIN_ID", async function () {
      const AMOUNT = 10
      contractInstance.addChainId([3])
      await secondTokenInstance.approve(contractInstance.address, AMOUNT)
      await expect(secondInstance.deposit(tokenInstance.address, AMOUNT, 3)).revertedWith(
        "UNSUPPORTED_TOKEN_ON_CHAIN_ID"
      )
    })

    it("Should sign a message with the owner address and recover the address from the signature", async function () {
      const [owner] = await ethers.getSigners()
      const encodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, 10, 1, 0]
      )
      await secondTokenInstance.transfer(contractInstance.address, 10)
      const signature = await owner.signMessage(ethers.utils.arrayify(encodedMsg))
      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      await secondInstance.withdraw(secondAddress, tokenInstance.address, 10, 1, 0, signature)
    })
  })
})

async function deployContract(verifyAddress: string, chainId: number) {
  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  return UBridgeFactory.deploy(verifyAddress, chainId)
}
