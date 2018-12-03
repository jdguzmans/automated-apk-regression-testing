(async () => {
  require('dotenv').config()

  const tests = require('./test')

  const testCases = await tests()
  console.log(testCases)

  const { PACKAGE_NAME } = require('./config')

  const { getEmulatorPairs, runEmulatorPairs } = require('./tools/android')
  const { exec } = require('./tools/childProcess')
  const { readdir } = require('./tools/fileSystem')

  const emulatorPairs = await getEmulatorPairs()
  const devicesPairs = await runEmulatorPairs(emulatorPairs)

  console.log(devicesPairs)

  for (let [d1, d2] of devicesPairs) {
    const dataDir = './data'

    const baseDir = await readdir(`${dataDir}/input/baseline`)
    const baseAPK = baseDir[0].split('.apk')[0]
    const baseAPKPath = `${dataDir}/input/baseline/${baseAPK}.apk`

    const compareToDir = await readdir(`${dataDir}/input/compareTo`)

    for (let compareToAPK of compareToDir) {
      const compareToAPKPath = `${dataDir}/input/compareTo/${compareToAPK}/${baseAPK}.apk`
      try {
        await exec(`adb -s ${d1} uninstall ${PACKAGE_NAME}`)
      } catch (e) { console.log(e) }

      try {
        await exec(`adb -s ${d2} uninstall ${PACKAGE_NAME}`)
      } catch (e) { console.log(e) }

      await exec(`adb -s ${d1} install -r ${baseAPKPath}`)
      await exec(`adb -s ${d2} install -r ${compareToAPKPath}`)

      for (let testCase of testCases) {
        const { steps } = testCase
        for (let step of steps) {
          await exec(`adb -s ${d1} ${step}`)
          await exec(`adb -s ${d2} ${step}`)
        }
      }
    }
  }
  console.log('done')
})()
