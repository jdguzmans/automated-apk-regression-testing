module.exports = async () => {
  const { readdir } = require('../tools/fileSystem')

  class TestCase {
    constructor (file, name, steps) {
      this.file = file
      this.name = name
      this.steps = steps
    }
  }

  const files = await readdir('./test')
  const testFiles = files.filter(file => {
    return file !== 'index.js'
  })

  return testFiles.map(file => {
    return require(`./${file}`)(TestCase, file)
  })
}
