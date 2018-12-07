module.exports = (TestCase, file) => {
  const name = 'Fill_Up'
  const steps = [
    { description: 'launches the app',
      command: 'shell am start -n com.evancharlton.mileage/com.evancharlton.mileage.Mileage'
    },
    { description: 'taps the screen',
      command: 'shell input tap 100 100'
    }
  ]

  return new TestCase(file, name, steps)
}
