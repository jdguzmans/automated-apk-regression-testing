(async () => {
  const { readdir, readFile, writeFile } = require('../tools/fileSystem')

  const dataDir = './data/input'

  const inputDirs = await readdir(`${dataDir}/tmp`)

  for (let dir of inputDirs) {
    const apkDir = await readdir(`${dataDir}/tmp/${dir}`)
    const apk = apkDir[0]

    const file = await readFile(`${dataDir}/tmp/${dir}/${apk}`)

    const name = dir.split('-')[1]

    await writeFile(`${dataDir}/compareTo/${name}.apk`, file)
  }
})()
