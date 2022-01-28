import { HardhatRuntimeEnvironment } from "hardhat/types"

export async function deployBridge(_: any, { ethers, hardhatArguments }: any) {
  const [signer] = await ethers.getSigners()
  const VERIFIER_ADDRESS = await signer.getAddress()
  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  const bridgeInstance = await UBridgeFactory.deploy()
  const BridgeProxyFactory = await ethers.getContractFactory("ProxyBridge")
  const initFunction = UBridgeFactory.interface.getFunction("init")
  const TRANSFERRED_ADDRESS = "0x7e3944CBC535766671bf962c3e796540f6007F1e"
  const initCallData = UBridgeFactory.interface.encodeFunctionData(initFunction, [
    VERIFIER_ADDRESS,
    (await ethers.provider.getNetwork()).chainId
  ])
  console.log(initCallData)

  const bridgeProxyInstance = await BridgeProxyFactory.deploy(
    bridgeInstance.address,
    initCallData,
    { gasLimit: 4712388, gasPrice: 100000000000 }
  )
  console.log(`Logic contract successfully deployed: ${bridgeInstance.address}`)
  console.log(`Contract successfully deployed: ${bridgeProxyInstance.address}`)
  await UBridgeFactory.attach(bridgeProxyInstance.address).transferOwnership(TRANSFERRED_ADDRESS)

  console.log(
    `verify uBridge: yarn hardhat verify --network ${hardhatArguments.network} ${bridgeInstance.address}`
  )
  console.log(
    `verify Proxy: yarn hardhat verify --network ${hardhatArguments.network} ${bridgeProxyInstance.address} ${bridgeInstance.address} ${initCallData}`
  )
}
