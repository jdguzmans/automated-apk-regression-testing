module.exports = (TestCase, file) => {
  const name = 'Fill_Up'
  const steps = [
    { description: 'launches the app',
      command: 'shell am start -n com.evancharlton.mileage/com.evancharlton.mileage.Mileage'
    },
    { description: 'taps the screen',
      command: 'shell input tap 100 100'
    },
    { description: 'taps the screen again',
      command: 'shell input tap 200 500'
    },
    { description: 'taps the screen one last time',
      command: 'shell input tap 500 200'
    }
  ]

  return new TestCase(file, name, steps)
}
