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
  let signer: Signer | Provider
  let signerAddress: string
  let second: Signer | Provider
  let secondAddress: string

  beforeEach(async () => {
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

  it("Should fail by missing fallback", async function () {
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

  it("Should deploy the proxied bridge, make a deposit, change the impl and the deposited tokens should be still there", async function () {
    expect(await proxyContract.verifyAddress()).eq(secondAddress)
    expect(await proxyContract.chainId()).eq(1)

    const amount = 10
    const BridgeToken = await ethers.getContractFactory("BridgeToken")
    const tokenInstance = await BridgeToken.deploy(10 ** 9)
    await tokenInstance.transfer(secondAddress, amount)

    const bridgeFactory = await ethers.getContractFactory("UBridge")
    const ownerProxiedBridge = new ethers.Contract(
      proxyInterfacedContract.address,
      bridgeFactory.interface,
      signer
    )
    await ownerProxiedBridge.addChainId([2])
    await ownerProxiedBridge.addToken(tokenInstance.address, [tokenInstance.address], [2])

    const addr2ProxiedBridge = new ethers.Contract(
      proxyInterfacedContract.address,
      bridgeFactory.interface,
      second
    )

    const addr2TokenInstance = tokenInstance.connect(second)
    await addr2TokenInstance.approve(addr2ProxiedBridge.address, amount)
    await addr2ProxiedBridge.deposit(tokenInstance.address, amount, 2)

    await expect(proxyInterfacedContract.upgradeTo(brokenImplentationContract.address)).not.reverted
    const UBridgeBrokenFactory = await ethers.getContractFactory("UBridgeBroken")
    const proxyUBridgeBrokenInstance = UBridgeBrokenFactory.attach(proxyInterfacedContract.address)
    await expect(proxyUBridgeBrokenInstance.changeVerifySigner(signerAddress)).not.reverted
    expect(await proxyUBridgeBrokenInstance.verifyAddress()).equal(signerAddress)

    // Check that the tokens are still there
    expect(await addr2TokenInstance.balanceOf(ownerProxiedBridge.address)).equal(amount)
  })
})

async function deployContract(verifyAddress: string, chainId: number) {
  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  const contract = await UBridgeFactory.deploy()
  await contract.init(verifyAddress, chainId)
  return contract
}
