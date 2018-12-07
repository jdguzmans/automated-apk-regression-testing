
const { exec } = require('./childProcess')

const getEmulatorPairs = async () => {
  const emulatorPairs = []
  const emulatorsCrude = await exec('emulator -list-avds')
  const emulatorsCrudeList = emulatorsCrude.split('\n')
    .filter(line => line.length !== 0)

  for (let i = 0; i < emulatorsCrudeList.length - 1; i = i + 2) {
    const e1 = emulatorsCrudeList[i]
    const e1Parts = e1.split('-')

    const e2 = emulatorsCrudeList[ i + 1 ]
    const e2Parts = e2.split('-')

    if (e1Parts[0] === 'pruebas' && e1Parts[0] === e2Parts[0] && e1Parts[1] === e2Parts[1]) {
      emulatorPairs.push([ e1, e2 ])
    }
  }

  return emulatorPairs
}

const runEmulatorPairs = async (emulatorPairs) => {
  for (let [e1, e2] of emulatorPairs) {
    await Promise.race([
      exec(`emulator -avd ${e1}`),
      exec(`emulator -avd ${e2}`),
      new Promise((resolve, reject) => setTimeout(resolve, 10000))
    ])
  }

  const devicesCrude = await exec('adb devices')
  const devices = devicesCrude.split('\n')
    .filter(line => line.length !== 0 && line !== 'List of devices attached')
    .map(line => line.split('\t')[0].trim())

  const devicePairs = []
  for (let i = 0; i < devices.length; i = i + 2) {
    devicePairs.push([
      devices[i], devices[i + 1]
    ])
  }

  return devicePairs
}

const timeOut = (timeout = 500) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, timeout)
  })
}

module.exports = {
  getEmulatorPairs,
  runEmulatorPairs,
  timeOut
}
