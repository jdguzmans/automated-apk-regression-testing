(async () => {
  const { exec } = require('./tools/childProcess')
  const { readdir } = require('./tools/fileSystem')

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

  for (let [e1, e2] of emulatorPairs) {
    await Promise.race([
      exec(`emulator -avd ${e1}`),
      exec(`emulator -avd ${e2}`),
      new Promise((resolve, reject) => setTimeout(resolve, 60000))
    ])
    const devicesCrude = await exec('adb devices')

    const devices = devicesCrude.split('\n')
      .filter(line => line.length !== 0 && line !== 'List of devices attached')
      .map(line => line.split('\t')[0].trim())

    const [ d1, d2 ] = devices

    const dataDir = './data'

    const baseDir = await readdir(`${dataDir}/input/baseline`)
    const baseAPK = baseDir[0]
    const baseAPKPath = `${dataDir}/input/baseline/${baseAPK}`

    const compareToDir = await readdir(`${dataDir}/input/compareTo`)
    for (let compareToAPK of compareToDir) {
      const compareToAPKPath = `${dataDir}/input/compareTo/${compareToAPK}`
      try {
        await exec(`adb -s ${d1}  uninstall ${baseAPK}`)
      } catch (e) { console.log(e) }

      try {
        await exec(`adb -s ${d2}  uninstall ${compareToAPK}`)
      } catch (e) { console.log(e) }

      await exec(`adb -s ${d1}  install ${baseAPKPath}`)
      await exec(`adb -s ${d2}  install ${compareToAPKPath}`)
    }
  }

  console.log('done')

  // // adb -s emulator-5554  install ./data/input/baseline/com.evancharlton.mileage_3110.apk
  // const t = await exec(`adb -s pruebas-pixel2-1 install ${baseAPKPath}`)
  // console.log(t)
  // // adb -s emulator-5556 install helloWorld.apk
  // //   const r = await exec('emulator -list-avds')

  // console.log(baseAPKPath)
})()
