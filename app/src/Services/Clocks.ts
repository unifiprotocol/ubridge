import EventEmitter from 'eventemitter3'

type ClockEvents = 'SIXTY_SECONDS' | 'THIRTY_SECONDS' | 'TEN_SECONDS' | 'TWO_MINUTES'

const TWO_MINUTES_MS = 2 * 60 * 1000
const SIXTY_SECONDS_MS = 60 * 1000
const THIRTY_SECONDS_MS = 30 * 1000
const TEN_SECONDS_MS = 10 * 1000

class Clock extends EventEmitter<ClockEvents> {
  private clockTenSeconds?: NodeJS.Timer
  private clockThirtySeconds?: NodeJS.Timer
  private clockSixtySeconds?: NodeJS.Timer
  private clockTwoMinutes?: NodeJS.Timer

  start() {
    console.debug('[Clocks] Start')
    // First pulse
    this.emit('TEN_SECONDS', {})
    this.emit('THIRTY_SECONDS', {})
    this.emit('SIXTY_SECONDS', {})
    this.emit('TWO_MINUTES', {})

    this.clockTwoMinutes = setInterval(() => {
      this.emit('TWO_MINUTES', {})
    }, TWO_MINUTES_MS)
    this.clockSixtySeconds = setInterval(() => {
      this.emit('SIXTY_SECONDS', {})
    }, SIXTY_SECONDS_MS)
    this.clockThirtySeconds = setInterval(() => {
      this.emit('THIRTY_SECONDS', {})
    }, THIRTY_SECONDS_MS)
    this.clockTenSeconds = setInterval(() => {
      this.emit('TEN_SECONDS', {})
    }, TEN_SECONDS_MS)
  }

  clear() {
    this.clockTwoMinutes && clearInterval(this.clockTwoMinutes)
    this.clockSixtySeconds && clearInterval(this.clockSixtySeconds)
    this.clockThirtySeconds && clearInterval(this.clockThirtySeconds)
    this.clockTenSeconds && clearInterval(this.clockTenSeconds)
  }
}

export default new Clock()
