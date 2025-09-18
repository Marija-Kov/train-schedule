import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import useFetchData from './useFetchData'

describe('useFetchData', () => {
  it('should return FetchData() function', () => {
    const { result } = renderHook(useFetchData)
    expect(result.current.fetchData).toBeTruthy()
  })
})
