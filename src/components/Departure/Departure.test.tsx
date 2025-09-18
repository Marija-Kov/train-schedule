import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Departure from './Departure'

describe('<Departure />', () => {
  it('should render Departure component properly', () => {
    render(
      <Departure departureTime={'12:0'} arrivalTime={'12:15'} trainId={8000} />
    )
    const departureTime = screen.getByTestId('departure-time-cell')
    const arrivalTime = screen.getByTestId('arrival-time-cell')
    const trainId = screen.getByTestId('train-no-cell')
    expect(departureTime).toBeInTheDocument()
    expect(arrivalTime).toBeInTheDocument()
    expect(trainId).toBeInTheDocument()
  })
})
