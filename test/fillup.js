module.exports = (TestCase, file) => {
  const name = 'Fill Up'
  const steps = [
    'shell am start -n com.evancharlton.mileage/com.evancharlton.mileage.Mileage'
  ]

  return new TestCase(file, name, steps)
}
