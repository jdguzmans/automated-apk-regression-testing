const fs = require('fs')

module.exports = {
  readdir: (path) => {
    return new Promise((resolve, reject) => {
      fs.readdir(path, (err, files) => {
        if (err) reject(err)
        else resolve(files)
      })
    })
  },

  readFile: (path) => {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  },

  writeFile: (path, file) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, file, (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

}
