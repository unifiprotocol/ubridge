// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat"

async function main() {
  const [signer] = await ethers.getSigners()
  const VERIFIER_ADDRESS = await signer.getAddress()
  const CHAIN_ID = 97
  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  const bridgeInstance = await UBridgeFactory.deploy()
  const BridgeProxyFactory = await ethers.getContractFactory("ProxyBridge")
  const initFunction = UBridgeFactory.interface.getFunction("init")
  const initCallData = UBridgeFactory.interface.encodeFunctionData(initFunction, [
    VERIFIER_ADDRESS,
    (await ethers.provider.getNetwork()).chainId
  ])
  console.log(initCallData) // 0x399ae724000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000001

  const bridgeProxyInstance = await BridgeProxyFactory.deploy(bridgeInstance.address, initCallData)
  console.log(`Contract successfully deployed: ${bridgeProxyInstance.address}`)
  await UBridgeFactory.attach(bridgeProxyInstance.address).transferOwnership(
    "0x7e3944CBC535766671bf962c3e796540f6007F1e"
  )
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
