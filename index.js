(async () => {
  const MAX_PAIR_EMULATORS = 2

  /// ////////////////////////////

  const { exec } = require('./tools/childProcess')
  const { readdir } = require('./tools/fileSystem')

  const devicesCrude = await exec('adb devices')

  const emulators = devicesCrude.split('\n')
    .filter(line => line.length !== 0 && line !== 'List of devices attached')
    .map(line => line.split('device')[0].trim())

  const dataDir = './data'

  const baseDir = await readdir(`${dataDir}/input/baseline`)
  const baseAPK = baseDir[0]
  const baseAPKPath = `${dataDir}/input/baseline/${baseAPK}`

  const e1 = emulators[0]
  const e2 = emulators[1]

  const compareToDir = await readdir(`${dataDir}/input/compareTo`)
  for (let compareToAPK of compareToDir) {
    const compareToAPKPath = `${dataDir}/input/baseline/${compareToAPK}`
  }

  await exec('adb -s emulator-5554  install ./data/input/baseline/com.evancharlton.mileage_3110.apk')

  // adb -s emulator-5554  install ./data/input/baseline/com.evancharlton.mileage_3110.apk
  const t = await exec(`adb -s pruebas-pixel2-1 install ${baseAPKPath}`)
  console.log(t)
  // adb -s emulator-5556 install helloWorld.apk
  //   const r = await exec('emulator -list-avds')

  console.log(baseAPKPath)
})()
