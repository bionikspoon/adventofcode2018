import greeter from '.'

test('it says hello', () => {
  const user = 'Jane User'

  expect(greeter(user)).toEqual('Hello, Jane User')
})
