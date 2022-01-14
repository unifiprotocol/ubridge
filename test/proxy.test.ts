import { Provider } from "@ethersproject/abstract-provider"
import { expect } from "chai"
import { Signer } from "ethers"
import { ethers } from "hardhat"
import { ProxyBridge, UBridge, UBridgeBroken } from "../typechain"

describe("Proxy", function () {
  let proxyInterfacedContract: ProxyBridge
  let proxyContract: UBridge
  let firstImplementationContract: UBridge
  let brokenImplentationContract: UBridgeBroken
  let signer: string | Signer | Provider
  let signerAddress: string
  let second: string | Signer | Provider
  let secondAddress: string
  this.beforeEach(async () => {
    const [_signer, _second] = await ethers.getSigners()
    signer = _signer
    signerAddress = await signer.getAddress()
    second = _second
    secondAddress = await second.getAddress()
    const UBridgeFactory = await ethers.getContractFactory("UBridge")
    firstImplementationContract = await deployContract(signerAddress, 1)
    const BrokenUBridgeFactory = await ethers.getContractFactory("UBridgeBroken")
    brokenImplentationContract = await BrokenUBridgeFactory.deploy()
    const ProxyFactory = await ethers.getContractFactory("ProxyBridge")
    const initCallData = UBridgeFactory.interface.encodeFunctionData(
      UBridgeFactory.interface.getFunction("init"),
      [secondAddress, 1]
    )
    proxyInterfacedContract = await ProxyFactory.deploy(
      firstImplementationContract.address,
      initCallData
    )
    proxyContract = UBridgeFactory.attach(proxyInterfacedContract.address)
  })

  it("Should instantiate proxy successfully", async function () {
    expect(await proxyContract.verifyAddress()).eq(secondAddress)
    expect(await proxyContract.chainId()).eq(1)
  })

  it("Should fail second initializer by 'Initializable: contract is already initialized'.", async function () {
    await expect(proxyContract.init(secondAddress, 1)).revertedWith(
      "Initializable: contract is already initialized"
    )
  })

  it("Should fail by misssing fallback", async function () {
    const secondProxyContract = proxyInterfacedContract.connect(second)
    await expect(secondProxyContract.upgradeTo(secondProxyContract.address)).revertedWith(
      "function selector was not recognized and there's no fallback function"
    )
  })

  it("Should change of implementation successfully", async function () {
    expect(await proxyContract.verifyAddress()).eq(secondAddress)
    expect(await proxyContract.chainId()).eq(1)
    await expect(proxyInterfacedContract.upgradeTo(brokenImplentationContract.address)).not.reverted
    const UBridgeBrokenFactory = await ethers.getContractFactory("UBridgeBroken")
    const proxyUBridgeBrokenInstance = UBridgeBrokenFactory.attach(proxyInterfacedContract.address)
    await expect(proxyUBridgeBrokenInstance.changeVerifySigner(signerAddress)).not.reverted
    expect(await proxyUBridgeBrokenInstance.verifyAddress()).equal(signerAddress)
  })

  it("Should fail recalling init after changing implementation by 'Initializable: contract is already initialized'", async function () {
    expect(await proxyContract.chainId()).eq(1)
    await expect(proxyInterfacedContract.upgradeTo(brokenImplentationContract.address)).not.reverted
    const UBridgeBrokenFactory = await ethers.getContractFactory("UBridgeBroken")
    const proxyUBridgeBrokenInstance = UBridgeBrokenFactory.attach(
      proxyInterfacedContract.address
    ).connect(signer)
    expect(await proxyContract.verifyAddress()).eq(secondAddress)
    await expect(proxyUBridgeBrokenInstance.changeVerifySigner(signerAddress)).not.reverted
    expect(await proxyUBridgeBrokenInstance.verifyAddress()).equal(signerAddress)
    await expect(proxyUBridgeBrokenInstance.init(signerAddress, 1)).revertedWith(
      "Initializable: contract is already initialized"
    )
  })
})

async function deployContract(verifyAddress: string, chainId: number) {
  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  const contract = await UBridgeFactory.deploy()
  await contract.init(verifyAddress, chainId)
  return contract
}
