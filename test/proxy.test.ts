/* eslint-disable prettier/prettier */
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
  let signer: Signer
  let signerAddress: string
  let second: Signer
  let secondAddress: string
  let evilThird: Signer
  let evilThirdAddress: string

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
    expect(await proxyInterfacedContract.getImplementationAddress()).eq(
      firstImplementationContract.address
    )
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

  // it("Should not allow change of implementation by outside address", async function () {
  //   expect(await proxyContract.verifyAddress()).eq(secondAddress)
  //   expect(await proxyContract.chainId()).eq(1)
  //   const [, , _evilThird] = await ethers.getSigners()
  //   let evilThird = _evilThird
  //   evilThirdAddress = await evilThird.getAddress()
  //   await expect(proxyInterfacedContract.upgradeTo(brokenImplentationContract.address)).not.reverted
  //   const UBridgeBrokenFactory = await ethers.getContractFactory("UBridgeBroken")
  //   const proxyUBridgeBrokenInstance = UBridgeBrokenFactory.attach(proxyInterfacedContract.address)
  //   await expect(proxyUBridgeBrokenInstance.changeVerifySigner(signerAddress)).not.reverted
  //   expect(await proxyUBridgeBrokenInstance.verifyAddress()).equal(signerAddress)
  // })

  it("Should not allow change of verify signer to a non-address", async function () {
    expect(await proxyContract.verifyAddress()).eq(secondAddress) // Verifies the proxy contract equals the second address.
    expect(await proxyContract.chainId()).eq(1) //Verifies the first proxy contract is on Chain 1
    await expect(proxyInterfacedContract.upgradeTo(brokenImplentationContract.address)).not.reverted //Upgrades Proxy Implentation
    const UBridgeBrokenFactory = await ethers.getContractFactory("UBridgeBroken")
    const proxyUBridgeBrokenInstance = UBridgeBrokenFactory.attach(proxyInterfacedContract.address)
    await expect(proxyUBridgeBrokenInstance.changeVerifySigner("Poopoopeepee")).to.reverted
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

  // Deployment is the Bridge + Proxy, this bridge is the implamentation that sets the proxy. Deposit +
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
    const sender = await addr2ProxiedBridge.signer.getAddress()
    await addr2ProxiedBridge.deposit(sender, tokenInstance.address, amount, 2)

    // deploy again the same contract
    const newContract = await deployContract(signerAddress, 1)
    // Upgrade proxy to another SC
    await expect(proxyInterfacedContract.upgradeTo(newContract.address)).not.reverted
    expect(await proxyInterfacedContract.getImplementationAddress()).eq(newContract.address)

    // Check that the tokens are still there
    expect(await addr2TokenInstance.balanceOf(proxyInterfacedContract.address)).equal(amount)
  })

  it("Should deploy the proxied bridge, make a deposit, change the impl and the deposited tokens cannot be withdrawn by an outside", async function () {
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
    const sender = await addr2ProxiedBridge.signer.getAddress()
    await addr2ProxiedBridge.deposit(sender, tokenInstance.address, amount, 2)

    // deploy again the same contract
    const newContract = await deployContract(signerAddress, 1)
    // Upgrade proxy to another SC
    await expect(proxyInterfacedContract.upgradeTo(newContract.address)).not.reverted
    expect(await proxyInterfacedContract.getImplementationAddress()).eq(newContract.address)

    // Check that the tokens are still there
    expect(await addr2TokenInstance.balanceOf(proxyInterfacedContract.address)).equal(amount)
  })

  it("Should deploy the proxied bridge, make a deposit, withdraw, change the impl, and fail to withdraw again", async function () {
    expect(await proxyContract.verifyAddress()).eq(secondAddress)
    expect(await proxyContract.chainId()).eq(1)

    const amount = 10
    const BridgeToken = await ethers.getContractFactory("BridgeToken")
    const tokenInstance = await BridgeToken.deploy(10 ** 9)
    await tokenInstance.transfer(proxyContract.address, amount)

    const bridgeFactory = await ethers.getContractFactory("UBridge")
    const ownerProxiedBridge = new ethers.Contract(
      proxyInterfacedContract.address,
      bridgeFactory.interface,
      signer
    )
    await ownerProxiedBridge.addChainId([1])
    await ownerProxiedBridge.addToken(tokenInstance.address, [tokenInstance.address], [1])

    const encodedMsg = ethers.utils.solidityKeccak256(
      [
        "uint256",
        "address",
        "address",
        "address",
        "uint256",
        "uint256",
        "uint256",
        "uint256",
        "uint256"
      ],
      [1, signerAddress, tokenInstance.address, tokenInstance.address, 10, 1, 1, 0, 999999999999999]
    )
    const signature = await second.signMessage(ethers.utils.arrayify(encodedMsg))
    await proxyContract.withdraw(
      signerAddress,
      tokenInstance.address,
      tokenInstance.address,
      10,
      1,
      1,
      0,
      999999999999999,
      signature
    )
    // deploy again the same contract
    const newContract = await deployContract(signerAddress, 1)
    // Upgrade proxy to another SC
    await expect(proxyInterfacedContract.upgradeTo(newContract.address)).not.reverted
    expect(await proxyInterfacedContract.getImplementationAddress()).eq(newContract.address)
    await expect(
      proxyContract.withdraw(
        signerAddress,
        tokenInstance.address,
        tokenInstance.address,
        10,
        1,
        1,
        0,
        999999999999999,
        signature
      )
    ).revertedWith("ALREADY_FILLED")
  })
})

async function deployContract(verifyAddress: string, chainId: number) {
  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  const contract = await UBridgeFactory.deploy()
  await contract.init(verifyAddress, chainId)
  return contract
}
