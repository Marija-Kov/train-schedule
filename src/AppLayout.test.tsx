import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AppLayout from './AppLayout'
import { BrowserRouter } from 'react-router'

describe('<AppLayout />', () => {
  it('should render all elements of app layout', () => {
    render(
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    )
    const infoBtn = screen.getByTestId('app-info')
    const homeLink = screen.getByTestId('home-link')
    expect(infoBtn).toBeInTheDocument()
    expect(homeLink).toBeInTheDocument()
  })
})
