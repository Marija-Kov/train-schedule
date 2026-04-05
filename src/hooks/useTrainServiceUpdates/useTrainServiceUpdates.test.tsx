import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import useTrainServiceUpdates from './useTrainServiceUpdates'

describe('useTrainServiceUpdates', () => {
  it('should return trainServiceUpdates() function', () => {
    const { result } = renderHook(useTrainServiceUpdates)
    expect(result.current.trainServiceUpdates).toBeTruthy()
  })
})
