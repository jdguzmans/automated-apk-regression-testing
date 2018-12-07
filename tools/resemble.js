const resemble = require('node-resemble-js')

const { readFile, saveRegression } = require('./fileSystem')

module.exports = {
  resemble: (path, index) => {
    return new Promise(async (resolve, reject) => {
      const base = await readFile(`${path}/base/${index}.png`)
      const mutated = await readFile(`${path}/mutated/${index}.png`)

      resemble(base)
        .compareTo(mutated)
        .onComplete(async data => {
          const { getDiffImageAsJPEG, misMatchPercentage } = data

          const differences = getDiffImageAsJPEG()
          await saveRegression(`${path}/differences/${index}.jpeg`, differences)

          resolve(misMatchPercentage)
        })
    })
  }
}
