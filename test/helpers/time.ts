import { ethers } from "hardhat"

export async function increase(duration: number) {
  await ethers.provider.send("evm_increaseTime", [duration])
  await ethers.provider.send("evm_mine", [])
}

export const duration = {
  seconds: function (val: number) {
    return val
  },
  minutes: function (val: number) {
    return val * this.seconds(60)
  },
  hours: function (val: number) {
    return val * this.minutes(60)
  },
  days: function (val: number) {
    return val * this.hours(24)
  }
}
