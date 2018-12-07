(async () => {
  require('dotenv').config()

  const each = require('async/each')
  const { resemble } = require('./tools/resemble')

  const tests = require('./test')

  const testCases = await tests()
  console.log(testCases)

  const { PACKAGE_NAME, PARALLEL_EXECUTIONS_AT_SAME_TIME } = require('./config')

  const { getEmulatorPairs, runEmulatorPairs, timeOut } = require('./tools/android')
  const { exec } = require('./tools/childProcess')
  const { readdir, createDirIfNotExists, createWriteStream, writeOnStream } = require('./tools/fileSystem')

  const emulatorPairs = await getEmulatorPairs()
  const devicesPairs = await runEmulatorPairs(emulatorPairs)

  const date = new Date().getTime()

  const dataDir = './data'

  const inputDir = `${dataDir}/input`
  const outputDir = `${dataDir}/output`

  await createDirIfNotExists(`${outputDir}/${date}`)

  const androidInternalPath = '/sdcard/pruebas'

  const compareToDir = await readdir(`${inputDir}/compareTo`)

  const devicesPairsToExecute =
    devicesPairs.slice(0, PARALLEL_EXECUTIONS_AT_SAME_TIME)

  const executionTuples = devicesPairsToExecute
    .map(([d1, d2], i) => {
      return [ d1, d2, compareToDir.filter((_, j) => {
        return j % devicesPairsToExecute.length === i
      })]
    })

  console.log(executionTuples)

  const globalWriteStream = createWriteStream(`${outputDir}/${date}/report.txt`)
  await writeOnStream(globalWriteStream, 'Global report:\n\n')

  each(executionTuples, async ([d1, d2, compareToAPKs]) => {
    const baseDir = await readdir(`${inputDir}/baseline`)
    const baseAPK = baseDir[0].split('.apk')[0]
    const baseAPKPath = `${inputDir}/baseline/${baseAPK}.apk`

    for (let compareToAPK of compareToAPKs) {
      await createDirIfNotExists(`${outputDir}/${date}/${compareToAPK}`)

      await createDirIfNotExists(`${outputDir}/${date}/${compareToAPK}/base`)
      await createDirIfNotExists(`${outputDir}/${date}/${compareToAPK}/mutated`)
      await createDirIfNotExists(`${outputDir}/${date}/${compareToAPK}/differences`)

      const localWriteStream = createWriteStream(`${outputDir}/${date}/${compareToAPK}/report.txt`)
      await writeOnStream(localWriteStream, 'Local report:\n\n')

      const compareToAPKPath = `${inputDir}/compareTo/${compareToAPK}/${baseAPK}.apk`
      try {
        await exec(`adb -s ${d1} uninstall ${PACKAGE_NAME}`)
      } catch (e) { console.log(e) }

      try {
        await exec(`adb -s ${d2} uninstall ${PACKAGE_NAME}`)
      } catch (e) { console.log(e) }

      await exec(`adb -s ${d1} install -r ${baseAPKPath}`)
      await exec(`adb -s ${d2} install -r ${compareToAPKPath}`)

      for (let testCase of testCases) {
        const { steps, name } = testCase

        await writeOnStream(localWriteStream, `Case: ${name}\n`)

        for (let i = 0; i < steps.length; i++) {
          const { description, command } = steps[i]

          await writeOnStream(localWriteStream, `\t-Step: ${description} -> `)

          await exec(`adb -s ${d1} ${command}`)
          await exec(`adb -s ${d2} ${command}`)

          await timeOut(1500)

          await exec(`adb -s ${d1} shell mkdir -p ${androidInternalPath}/${date}/${compareToAPK}/${name}`)
          await exec(`adb -s ${d2} shell mkdir -p ${androidInternalPath}/${date}/${compareToAPK}/${name}`)

          await exec(`adb -s ${d1} shell screencap -p ${androidInternalPath}/${date}/${compareToAPK}/${name}/${i}.png`)
          await exec(`adb -s ${d2} shell screencap -p ${androidInternalPath}/${date}/${compareToAPK}/${name}/${i}.png`)

          await exec(`adb -s ${d1} pull ${androidInternalPath}/${date}/${compareToAPK}/${name}/${i}.png ${outputDir}/${date}/${compareToAPK}/base/${i}.png`)
          await exec(`adb -s ${d2} pull ${androidInternalPath}/${date}/${compareToAPK}/${name}/${i}.png ${outputDir}/${date}/${compareToAPK}/mutated/${i}.png`)

          const misMatchPercentage = await resemble(`${outputDir}/${date}/${compareToAPK}`, i)
          const numMismatchPercentage = Number(misMatchPercentage)

          let result = 'OK'

          if (misMatchPercentage < 10) {
            result = `possible mutation of mismatch visual percentage ${numMismatchPercentage}, base at /${date}/${compareToAPK}/base/${i}.png, mutated at /${date}/${compareToAPK}/base/${i}.png and difference at /${date}/${compareToAPK}/difference/${i}.jpeg`
            await writeOnStream(globalWriteStream, `- Found possible mutant at ${compareToAPK}\n`)
          }

          await writeOnStream(localWriteStream, `${result}\n`)
        }
      }
    }
  }, (err) => {
    if (err) console.error(err)
    else console.log('done')
  })
})()
