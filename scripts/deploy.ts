// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat"

async function main() {
  const [signer] = await ethers.getSigners()
  const VERIFIER_ADDRESS = await signer.getAddress()
  const CHAIN_ID = 1
  const UBridgeFactory = await ethers.getContractFactory("UBridge")
  const bridgeInstance = await UBridgeFactory.deploy()
  const BridgeProxyFactory = await ethers.getContractFactory("ProxyBridge")
  const initFunction = UBridgeFactory.interface.getFunction("init")
  const initCallData = UBridgeFactory.interface.encodeFunctionData(initFunction, [
    VERIFIER_ADDRESS,
    CHAIN_ID
  ])
  const bridgeProxyInstance = await BridgeProxyFactory.deploy(bridgeInstance.address, initCallData)
  console.log(`Contract successfully deployed: ${bridgeProxyInstance.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
