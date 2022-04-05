require("dotenv").config()
import { ethers, hardhatArguments } from "hardhat"

async function main() {
  const UBridgeFactory = await ethers.getContractFactory("UBridge")

  const ProxyFactory = await ethers.getContractFactory("ProxyBridge")
  const proxyInstance = ProxyFactory.attach("0x9f64D3651CEaE6fcC860406E9EC538Ff9FfCEAFF")
  // Harmony mutlisig
  const newOwner = "0xAB63B0f4e1cDAad7c4849f8E9AEdcD40601C15d7"
  await proxyInstance.transferOwnership(newOwner).then(console.log)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
