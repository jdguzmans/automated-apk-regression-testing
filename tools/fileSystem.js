const fs = require('fs')

module.exports = {
  createWriteStream: (path) => {
    return fs.createWriteStream(path)
  },

  writeOnStream: (stream, text) => {
    return new Promise((resolve, reject) => {
      stream.write(text, resolve)
    })
  },

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
  },

  createDirIfNotExists: (path) => {
    return new Promise((resolve, reject) => {
      fs.mkdir(path, () => {
        resolve()
      })
    })
  },

  saveRegression: (path, differences) => {
    return new Promise(async (resolve, reject) => {
      fs.writeFile(path, differences, (err, reject) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

}
