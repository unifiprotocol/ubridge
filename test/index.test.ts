import { Provider } from "@ethersproject/abstract-provider"
import { expect } from "chai"
import { constants, Signer } from "ethers"
import { LogDescription } from "ethers/lib/utils"
import { ethers } from "hardhat"
import { UBridge, BridgeToken, UBridge__factory } from "../typechain"
import * as time from "./helpers/time"

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
      expect(await contractInstance.getVerifyAddresses(), "Wrong verify address").to.contains(
        signerAddress
      )
      expect((await contractInstance.chainId()).toNumber(), "Wrong chain id").equal(1)
    })

    it("Should change verify address and return new one", async function () {
      const [signer, second] = await ethers.getSigners()
      const secondAddress = await second.getAddress()
      const signerAddress = await signer.getAddress()
      await contractInstance.removeVerifyAddress(signerAddress)
      await contractInstance.addVerifyAddress(secondAddress)
      const verifyAddress = await contractInstance.getVerifyAddresses()
      expect(verifyAddress).contains(secondAddress)
    })

    it("Should fail to add a null address", async function () {
      const [signer] = await ethers.getSigners()
      const signerAddress = await signer.getAddress()
      const nullAddress = "0x0000000000000000000000000000000000000000"
      await expect(contractInstance.addVerifyAddress(nullAddress)).to.be.revertedWith("ADDRESS_0")
      const verifyAddress = await contractInstance.getVerifyAddresses()
      expect(verifyAddress).deep.eq([signerAddress])
    })

    it("Should add several verifyAddresses", async function () {
      const [addr1, addr2, addr3] = await ethers.getSigners()
      await contractInstance.addVerifyAddress(addr1.address)
      await contractInstance.addVerifyAddress(addr2.address)
      await contractInstance.addVerifyAddress(addr3.address)
      const verifyAddress = await contractInstance.getVerifyAddresses()
      expect(verifyAddress).deep.eq([addr1.address, addr2.address, addr3.address])
    })

    it("Should update owner", async function () {
      const [, second] = await ethers.getSigners()
      const secondAddress = await second.getAddress()
      expect(await contractInstance.transferOwnership(secondAddress)).to.emit(
        contractInstance,
        "OwnershipTransferred"
      )
      expect(await contractInstance.owner()).equal(secondAddress)
    })

    it("Should add chainId=2,3 to supportedChainIds", async function () {
      const chainIdsToAdd = [2, 3]
      await contractInstance.addChainId(chainIdsToAdd)
      const [c1, c2] = await Promise.all(
        chainIdsToAdd.map((chainId) => contractInstance.chainIdSupported(chainId))
      )
      expect(c1).equal(true)
      expect(c2).equal(true)
      const [chain2, chain3] = await contractInstance.getChainIds()
      expect(chain2.toNumber()).equal(2)
      expect(chain3.toNumber()).equal(3)
    })

    it("Should add chainId=2,3, add tokens to them, and chainsSupportedForTokenAddress should be equal to 2", async function () {
      const chainIdsToAdd = [2, 3]
      await contractInstance.addChainId(chainIdsToAdd)
      await contractInstance.addToken(
        tokenInstance.address,
        [tokenInstance.address, tokenInstance.address],
        [2, 3]
      )
      expect(await contractInstance.chainsSupportedForTokenAddress(tokenInstance.address)).equal(2)
    })

    it("Should add chainId=2,3, add tokens to them, remove the token in one of them, and chainsSupportedForTokenAddress should be equal to 1", async function () {
      const chainIdsToAdd = [2, 3]
      await contractInstance.addChainId(chainIdsToAdd)
      await contractInstance.addToken(
        tokenInstance.address,
        [tokenInstance.address, tokenInstance.address],
        [2, 3]
      )
      await contractInstance.removeToken(tokenInstance.address, [2])
      expect(await contractInstance.chainsSupportedForTokenAddress(tokenInstance.address)).equal(1)
    })

    it("Should add chainId=2,3, add a token to chainId=2, remove the token in token chainId=3, and should fail", async function () {
      const chainIdsToAdd = [2, 3]
      await contractInstance.addChainId(chainIdsToAdd)
      await contractInstance.addToken(tokenInstance.address, [tokenInstance.address], [2])
      await expect(contractInstance.removeToken(tokenInstance.address, [3])).revertedWith(
        "TOKEN_CHAIN_ID_NOT_SUPPORTED"
      )
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
      const [chainId] = await contractInstance.getChainIds()
      expect(chainId.toNumber()).equal(2)
      expect(c3).equal(false)
    })

    it("Should add chainId=2,3 to supportedChainIds and after remove chainId 2", async function () {
      const chainIdsToAdd = [2, 3]
      await contractInstance.addChainId(chainIdsToAdd)
      const [c1, c2] = await Promise.all(
        chainIdsToAdd.map((chainId) => contractInstance.chainIdSupported(chainId))
      )
      expect(c1).equal(true)
      expect(c2).equal(true)
      await contractInstance.removeChainId(2)
      const c3 = await contractInstance.chainIdSupported(2)
      const [chainId] = await contractInstance.getChainIds()
      expect(chainId.toNumber()).equal(3)
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
      expect(await contractInstance.getOriginAddresses()).deep.eq([tokenAddress])
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
      expect(await contractInstance.getOriginAddresses()).deep.eq([tokenAddress])
      const [c1, c2] = await Promise.all(
        chainIds.map((chainId) => contractInstance.tokensSupported(tokenAddress, chainId))
      )
      expect(c1).equal(tokenAddress)
      expect(c2).equal(tokenAddress)
      await contractInstance.removeToken(tokenAddress, chainIds)
      expect(await contractInstance.getOriginAddresses()).deep.eq([])

      const [c3, c4] = await Promise.all(
        chainIds.map((chainId) => contractInstance.tokensSupported(tokenAddress, chainId))
      )
      expect(Number(c3)).eq(0)
      expect(Number(c4)).eq(0)
    })

    it("Should be the default fees equal to zero", async function () {
      expect(await contractInstance.chainIdFees(0), "default value should be zero").eq(0)
      expect(await contractInstance.chainIdFees(1), "default value should be zero").eq(0)
      expect(await contractInstance.chainIdFees(2), "default value should be zero").eq(0)
    })

    it("Should change the fees change", async function () {
      const chainIds = [0, 1]
      const fees = [1, 2]
      await contractInstance.setChainIdFee(chainIds, fees)

      const readFees = await Promise.all(
        chainIds.map((chainId) => contractInstance.chainIdFees(chainId).then((e) => e.toNumber()))
      )

      expect(readFees).deep.eq(fees)
    })

    it("Should emit Paused event", async function () {
      await expect(contractInstance.pause()).to.emit(contractInstance, "Paused")
    })

    it("Should emit Unpaused event", async function () {
      await contractInstance.pause()
      await expect(contractInstance.unpause()).to.emit(contractInstance, "Unpaused")
    })
  })

  describe("Deposits and Withdraws", () => {
    let signerAddress: string
    let secondAddress: string
    let second: string | Signer | Provider
    let secondInstance: UBridge
    let secondTokenInstance: BridgeToken

    beforeEach(async () => {
      const [signer, _second] = await ethers.getSigners()
      second = _second
      signerAddress = await signer.getAddress()
      contractInstance = await deployContract(signerAddress, 1)
      secondInstance = contractInstance.connect(second)
      const BridgeToken = await ethers.getContractFactory("BridgeToken")
      tokenInstance = await BridgeToken.deploy(10 ** 9)
      secondAddress = await second.getAddress()
      secondTokenInstance = tokenInstance.connect(second)
      await tokenInstance.transfer(secondAddress, 10 ** 9)
    })

    it("Should create a successful deposit", async function () {
      const amount = 10
      await contractInstance.addChainId([3])
      await contractInstance.addToken(tokenInstance.address, [tokenInstance.address], [3])
      await secondTokenInstance.approve(contractInstance.address, amount)
      expect(secondInstance.deposit(signerAddress, tokenInstance.address, amount, 3)).to.emit(
        contractInstance,
        "Deposit"
      )
    })

    it("Should create a successful deposit with fees and then owner claim those fees", async function () {
      const provider = ethers.provider
      const amount = 10
      await contractInstance.addChainId([3])
      await contractInstance.addToken(tokenInstance.address, [tokenInstance.address], [3])
      await contractInstance.setChainIdFee([3], [1])
      await secondTokenInstance.approve(contractInstance.address, amount)
      await expect(
        secondInstance.deposit(signerAddress, tokenInstance.address, amount, 3, { value: 1 })
      ).to.emit(contractInstance, "Deposit")
      const balanceBeforeClaim = await provider.getBalance(contractInstance.address)
      expect(balanceBeforeClaim, "Balance should be 1")
      await contractInstance.claimFees()
      const balanceAfterClaim = await provider.getBalance(contractInstance.address)
      expect(balanceAfterClaim.eq(0), "Balance should be 0")
    })

    it("Should fail when fees doesn't match value param", async function () {
      const provider = ethers.provider
      const amount = 10
      await contractInstance.addChainId([3])
      await contractInstance.addToken(tokenInstance.address, [tokenInstance.address], [3])
      await contractInstance.setChainIdFee([3], [1])
      await secondTokenInstance.approve(contractInstance.address, amount)
      await expect(
        secondInstance.deposit(signerAddress, tokenInstance.address, amount, 3, { value: 0 })
      ).to.revertedWith("WRONG_FEE")
    })

    it("Should create a successful deposit to another address besides origin address", async function () {
      const amount = 10
      await contractInstance.addChainId([3])
      await contractInstance.addToken(tokenInstance.address, [tokenInstance.address], [3])
      await secondTokenInstance.approve(contractInstance.address, amount)
      expect(secondInstance.deposit(secondAddress, tokenInstance.address, amount, 3)).to.emit(
        contractInstance,
        "Deposit"
      )
    })

    it("Should fail to deposit with withdrawal address = addr(0)", async function () {
      const amount = 10
      await contractInstance.addChainId([3])
      await contractInstance.addToken(tokenInstance.address, [tokenInstance.address], [3])
      await secondTokenInstance.approve(contractInstance.address, amount)
      expect(
        secondInstance.deposit(constants.AddressZero, tokenInstance.address, amount, 3)
      ).to.revertedWith("WRONG_ADDRESS")
    })

    it("Should fail to deposit while paused", async function () {
      const amount = 10
      await contractInstance.addChainId([3])
      await contractInstance.addToken(tokenInstance.address, [tokenInstance.address], [3])
      await contractInstance.pause()
      await secondTokenInstance.approve(contractInstance.address, amount)
      expect(secondInstance.deposit(signerAddress, tokenInstance.address, amount, 3)).revertedWith(
        "Pausable: paused"
      )
    })

    it('Should fail calling for second time initializer by "Initializable: contract is already initialized"', async function () {
      await expect(contractInstance.init([secondAddress], 1)).revertedWith(
        "Initializable: contract is already initialized"
      )
    })

    it("Should deposit fail by CHAIN_ID_NOT_SUPPORTED", async function () {
      const amount = 10
      await secondTokenInstance.approve(contractInstance.address, amount)
      await expect(
        secondInstance.deposit(signerAddress, tokenInstance.address, amount, 3)
      ).revertedWith("CHAIN_ID_NOT_SUPPORTED")
    })

    it("Should deposit fail by UNSUPPORTED_TOKEN_ON_CHAIN_ID", async function () {
      const amount = 10
      contractInstance.addChainId([3])
      await secondTokenInstance.approve(contractInstance.address, amount)
      await expect(
        secondInstance.deposit(signerAddress, tokenInstance.address, amount, 3)
      ).revertedWith("UNSUPPORTED_TOKEN_ON_CHAIN_ID")
    })

    it("Should withdraw token amount", async function () {
      const [owner, addr2] = await ethers.getSigners()
      const encodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "address", "uint256", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, tokenInstance.address, 10, 1, 1, 1]
      )
      await secondTokenInstance.transfer(contractInstance.address, 10)
      const signature1 = await owner.signMessage(ethers.utils.arrayify(encodedMsg))
      const signature2 = await addr2.signMessage(ethers.utils.arrayify(encodedMsg))
      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      await contractInstance.addVerifyAddress(addr2.address)
      expect((await secondTokenInstance.balanceOf(secondAddress)).toNumber()).eq(10 ** 9 - 10)
      await secondInstance.withdraw(
        secondAddress,
        tokenInstance.address,
        tokenInstance.address,
        10,
        1,
        1,
        1,
        [signature1, signature2]
      )
      expect((await secondTokenInstance.balanceOf(secondAddress)).toNumber()).eq(10 ** 9)
    })

    it("Should fail withdrawal due to NO_VERIFIERS", async function () {
      const [owner, addr2] = await ethers.getSigners()
      const encodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "address", "uint256", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, tokenInstance.address, 10, 1, 1, 1]
      )
      await secondTokenInstance.transfer(contractInstance.address, 10)
      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      await contractInstance.removeVerifyAddress(owner.address)
      expect((await secondTokenInstance.balanceOf(secondAddress)).toNumber()).eq(10 ** 9 - 10)
      await expect(
        secondInstance.withdraw(
          secondAddress,
          tokenInstance.address,
          tokenInstance.address,
          10,
          1,
          1,
          1,
          []
        )
      ).revertedWith("NO_VERIFIERS")
    })

    it("Should fail withdrawBatch due to duplicated withdrawal", async function () {
      const [owner, addr2] = await ethers.getSigners()
      const encodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "address", "uint256", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, tokenInstance.address, 10, 1, 1, 1]
      )

      await secondTokenInstance.transfer(contractInstance.address, 10)

      const signature1 = await owner.signMessage(ethers.utils.arrayify(encodedMsg))
      const signature2 = await addr2.signMessage(ethers.utils.arrayify(encodedMsg))

      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      await contractInstance.addVerifyAddress(addr2.address)

      const withdrawal = {
        withdrawalAddress: secondAddress,
        originTokenAddress: tokenInstance.address,
        destinationTokenAddress: tokenInstance.address,
        amount: 10,
        originChainId: 1,
        targetChainId: 1,
        _count: 1,
        signatures: [signature1, signature2]
      }

      await expect(secondInstance.withdrawBatch([withdrawal, withdrawal])).be.revertedWith(
        "ALREADY_FILLED"
      )
    })

    it("Should withdraw a batch with two withdrawals", async function () {
      const [owner, addr2] = await ethers.getSigners()

      const firstEncodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "address", "uint256", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, tokenInstance.address, 10, 1, 1, 1]
      )

      const secondEncodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "address", "uint256", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, tokenInstance.address, 10, 1, 1, 2]
      )

      await secondTokenInstance.transfer(contractInstance.address, 20)

      const firstWithdrawalSignature1 = await owner.signMessage(
        ethers.utils.arrayify(firstEncodedMsg)
      )
      const firstWithdrawalSignature2 = await addr2.signMessage(
        ethers.utils.arrayify(firstEncodedMsg)
      )
      const secondWithdrawalSignature1 = await owner.signMessage(
        ethers.utils.arrayify(secondEncodedMsg)
      )
      const secondWithdrawalSignature2 = await addr2.signMessage(
        ethers.utils.arrayify(secondEncodedMsg)
      )

      const firstWithdrawal = {
        withdrawalAddress: secondAddress,
        originTokenAddress: tokenInstance.address,
        destinationTokenAddress: tokenInstance.address,
        amount: 10,
        originChainId: 1,
        targetChainId: 1,
        _count: 1,
        signatures: [firstWithdrawalSignature1, firstWithdrawalSignature2]
      }

      const secondWithdrawal = {
        withdrawalAddress: secondAddress,
        originTokenAddress: tokenInstance.address,
        destinationTokenAddress: tokenInstance.address,
        amount: 10,
        originChainId: 1,
        targetChainId: 1,
        _count: 2,
        signatures: [secondWithdrawalSignature1, secondWithdrawalSignature2]
      }

      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      await contractInstance.addVerifyAddress(addr2.address)

      expect((await secondTokenInstance.balanceOf(secondAddress)).toNumber()).eq(10 ** 9 - 20)
      await contractInstance.withdrawBatch([firstWithdrawal, secondWithdrawal])
      expect((await secondTokenInstance.balanceOf(secondAddress)).toNumber()).eq(10 ** 9)
    })

    it("Should withdraw token amount after signer change", async function () {
      const [owner] = await ethers.getSigners()
      const encodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "address", "uint256", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, tokenInstance.address, 10, 1, 1, 1]
      )
      await secondTokenInstance.transfer(contractInstance.address, 10)
      const signature = await owner.signMessage(ethers.utils.arrayify(encodedMsg))
      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      expect((await secondTokenInstance.balanceOf(secondAddress)).toNumber()).eq(10 ** 9 - 10)
      await contractInstance.removeVerifyAddress(signerAddress)
      await contractInstance.addVerifyAddress(secondAddress)
      const verifyAddress = await contractInstance.getVerifyAddresses()
      expect(verifyAddress).contains(secondAddress)
      await expect(
        secondInstance.withdraw(
          secondAddress,
          tokenInstance.address,
          tokenInstance.address,
          10,
          1,
          1,
          1,
          [signature]
        )
      ).revertedWith("WRONG_SIGNER")
      expect((await secondTokenInstance.balanceOf(secondAddress)).toNumber()).eq(10 ** 9 - 10)
    })

    it("Should fail withdrawing a token because not enough SC balance", async function () {
      const [owner] = await ethers.getSigners()
      const encodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "address", "uint256", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, tokenInstance.address, 10, 1, 1, 1]
      )
      await secondTokenInstance.transfer(contractInstance.address, 1)
      const signature = await owner.signMessage(ethers.utils.arrayify(encodedMsg))
      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      expect(
        secondInstance.withdraw(
          secondAddress,
          tokenInstance.address,
          tokenInstance.address,
          10,
          1,
          1,
          1,
          [signature]
        )
      ).revertedWith("ERC20: transfer amount exceeds balance")
    })

    it("Should fail to withdraw token amount when paused", async function () {
      const [owner] = await ethers.getSigners()
      const encodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, 10, 1, 0]
      )
      await secondTokenInstance.transfer(contractInstance.address, 10)
      const signature = await owner.signMessage(ethers.utils.arrayify(encodedMsg))
      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      expect((await secondTokenInstance.balanceOf(secondAddress)).toNumber()).eq(10 ** 9 - 10)
      await contractInstance.pause()
      expect(
        secondInstance.withdraw(
          secondAddress,
          tokenInstance.address,
          tokenInstance.address,
          10,
          1,
          1,
          1,
          [signature]
        )
      ).revertedWith("Pausable: paused")
      expect((await secondTokenInstance.balanceOf(secondAddress)).toNumber()).eq(10 ** 9 - 10)
    })

    it("Should fail second withdrawal", async function () {
      const [owner] = await ethers.getSigners()
      const encodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "address", "uint256", "uint256", "uint256", "uint256"],
        [secondAddress, tokenInstance.address, tokenInstance.address, 10, 1, 1, 1]
      )
      const signature = await owner.signMessage(ethers.utils.arrayify(encodedMsg))
      await secondTokenInstance.transfer(contractInstance.address, 10)
      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      await secondInstance.withdraw(
        secondAddress,
        tokenInstance.address,
        tokenInstance.address,
        10,
        1,
        1,
        1,
        [signature]
      )
      await expect(
        secondInstance.withdraw(
          secondAddress,
          tokenInstance.address,
          tokenInstance.address,
          10,
          1,
          1,
          1,
          [signature]
        )
      ).revertedWith("ALREADY_FILLED")
    })

    it("Should fail withdrawing token amount due to WRONG_SIGNER #1", async function () {
      const [owner] = await ethers.getSigners()
      const encodedMsg = ethers.utils.solidityKeccak256(
        ["address", "address", "uint256", "uint256", "uint256"],
        [secondAddress, contractInstance.address, 10, 1, 0]
      )
      await secondTokenInstance.transfer(contractInstance.address, 10)
      const signature = await owner.signMessage(ethers.utils.arrayify(encodedMsg))
      await contractInstance.addChainId([1])
      await contractInstance.addToken(contractInstance.address, [tokenInstance.address], [1])
      await expect(
        secondInstance.withdraw(
          secondAddress,
          tokenInstance.address,
          tokenInstance.address,
          10,
          1,
          1,
          1,
          [signature]
        )
      ).revertedWith("WRONG_SIGNER")
    })

    it("Should withdraw correctly the contract balance", async function () {
      await expect(contractInstance.claimFees()).not.be.reverted
    })
  })
})

async function deployContract(verifyAddress: string, chainId: number) {
  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  const contract = await UBridgeFactory.deploy()
  await contract.init([verifyAddress], chainId)
  return contract
}
