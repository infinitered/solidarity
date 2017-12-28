// Stops warnings in CI mode
// MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 unhandledRejection listeners added. Use emitter.setMaxListeners()
process.setMaxListeners(0)
