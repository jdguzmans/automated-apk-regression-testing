const { exec } = require('child_process')

module.exports = {
  exec: (command) => {
    return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
        if (err || stderr) reject(err || stderr)
        else {
          console.log(stdout)
          resolve(stdout)
        }
      })
    })
  }
}
