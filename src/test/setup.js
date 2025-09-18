import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from 'vitest'
import { server } from './mocks/node.ts'

const originalError = console.error
const actWarnings = []

beforeAll(() => {
  // Suppress "Warning: An update to ComponentName inside a test was not wrapped in act(...)."
  // because we don't need act():
  console.error = (...args) => {
    if (/Warning.*not wrapped in act/.test(args[0])) {
      actWarnings.push(args[0])
      return
    }
    originalError.call(console, ...args)
  }
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => server.close())
