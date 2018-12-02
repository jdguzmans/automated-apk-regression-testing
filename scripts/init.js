(async () => {
  require('dotenv').config()

  const { SIGN_KEY_PATH, ALIAS_NAME, STORE_PASS, KEY_PASS } = require('../config')

  const { readdir, createDirIfNotExists } = require('../tools/fileSystem')
  const { exec } = require('../tools/childProcess')

  const dataDir = './data/input'

  const inputDirs = await readdir(`${dataDir}/tmp`)

  for (let dir of inputDirs) {
    const apkDir = await readdir(`${dataDir}/tmp/${dir}`)
    const apk = apkDir[0]

    const name = dir.split('-')[1]

    await createDirIfNotExists(`${dataDir}/compareTo/${name}`)

    await exec(`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ${SIGN_KEY_PATH} -storepass ${STORE_PASS} -keypass ${KEY_PASS} ${dataDir}/tmp/${dir}/${apk} ${ALIAS_NAME}`)
    await exec(`zipalign -v 4 ${dataDir}/tmp/${dir}/${apk} ${dataDir}/compareTo/${name}/${apk}`)
  }
})()
