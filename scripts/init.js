(async () => {
  require('dotenv').config()

  const { signApk } = require('../tools/android')
  const { readdir, readFile, writeFile } = require('../tools/fileSystem')
  const { exec } = require('../tools/childProcess')

  const dataDir = './data/input'

  console.log(0)

  const inputDirs = await readdir(`${dataDir}/tmp`)

  console.log(1)

  for (let dir of inputDirs) {
    console.log(2)
    const apkDir = await readdir(`${dataDir}/tmp/${dir}`)
    console.log(3)
    const apk = apkDir[0]

    const name = dir.split('-')[1]

    await signApk(dataDir, dir, apk)

    console.log(4)

    await exec(`zipalign -v 4 ${dataDir}/tmp/${dir}/${apk} ${dataDir}/aaa/${name}.apk`)

    console.log('va')

    // const file = await readFile(`${dataDir}/tmp/${dir}/${apk}`)

    // await writeFile(`${dataDir}/compareTo/${name}.apk`, file)
  }
})()
