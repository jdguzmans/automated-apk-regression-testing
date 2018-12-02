
const { spawn, exec } = require('child_process')

const { SIGN_KEY_PATH, ALIAS_NAME } = require('../config')

const signApk = (dataDir, dir, apk) => {
  return new Promise((resolve, reject) => {
    // const cm = spawn(`jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ${SIGN_KEY_PATH} ${dataDir}/tmp/${dir}/${apk} ${ALIAS_NAME}`)

    const cm = spawn(`jarsigner`, [
      `-verbose`,
      `-sigalg`,
      `SHA1withRSA`,
      `-digestalg`,
      `SHA1`,
      `-keystore`,
      `${SIGN_KEY_PATH}`,
      ` ${dataDir}/tmp/${dir}/${apk}`,
      `${ALIAS_NAME}`
    ])

    cm.stderr.on('data', (data) => {
      console.log(`stderr ${data.toString()}`)
      cm.stdin.write('pruebas')
      resolve()
    })

    cm.stdin.on('data', (data) => {
      console.log(`stdin ${data.toString()}`)
    })
  })
}

module.exports = {
  signApk
}
