// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers, hardhatArguments } from "hardhat"
import { deployBridge } from "../tasks/deployer"

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deployBridge(undefined, { ethers, hardhatArguments }).catch((error) => {
  console.error(error)
  process.exitCode = 1
})
