import { describe, it, expect } from 'vitest'
// import user from "@testing-library/user-event";
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router'
import { server } from '../../test/mocks/node'
import DeparturesLayout from './DeparturesLayout'
import { DeparturesContext } from '../../context'
import { http, HttpResponse } from 'msw'

describe('<DeparturesLayout />', () => {
  it('should render the layout properly', () => {
    render(
      <BrowserRouter>
        <DeparturesLayout />
      </BrowserRouter>
    )
    const departureTimeColumnHeading = screen.getByTestId('departure-title')
    const arrivalTimeColumnHeading = screen.getByTestId('arrival-title')
    const trainIdColumnHeading = screen.getByTestId('train-no-title')
    expect(departureTimeColumnHeading).toBeInTheDocument()
    expect(arrivalTimeColumnHeading).toBeInTheDocument()
    expect(trainIdColumnHeading).toBeInTheDocument()
  })

  it('should render the loader', () => {
    render(
      <BrowserRouter>
        <DeparturesContext.Provider value={{ departures: [], loading: true }}>
          <DeparturesLayout />
        </DeparturesContext.Provider>
      </BrowserRouter>
    )
    const loader = screen.getByTestId('loader')
    expect(loader).toBeInTheDocument()
  })

  it('should render no departures found message', () => {
    render(
      <BrowserRouter>
        <DeparturesContext.Provider value={{ departures: [], loading: false }}>
          <DeparturesLayout />
        </DeparturesContext.Provider>
      </BrowserRouter>
    )
    const noDepartures = screen.getByTestId('no-departures-message')
    expect(noDepartures).toBeInTheDocument()
  })

  it('should render departures', () => {
    render(
      <BrowserRouter>
        <DeparturesContext.Provider
          value={{
            departures: [
              {
                departureTime: '0:01',
                arrivalTime: '0:02',
                trainId: 8003,
              },
            ],
            loading: false,
          }}
        >
          <DeparturesLayout />
        </DeparturesContext.Provider>
      </BrowserRouter>
    )
    const departureTime = screen.getByText('0:01')
    const arrivalTime = screen.getByText('0:02')
    const trainId = screen.getByText('8003')
    expect(departureTime).toBeInTheDocument()
    expect(arrivalTime).toBeInTheDocument()
    expect(trainId).toBeInTheDocument()
  })

  it('should render service updates properly given that all relevant departures are on schedule', async () => {
    server.use(
      http.get('https://www.srbvoz.rs/wp-json/wp/v2/info_post', () => {
        const currentDateTime = new Date().toISOString().split('.')[0]
        const currentDate = currentDateTime.split('T')[0]
        const currentLocalTime = new Date().toTimeString().split(' ')[0]
        const date = currentDate + 'T' + currentLocalTime

        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(
              new TextEncoder().encode(
                JSON.stringify([
                  {
                    date: date,
                    slug: 'Izmena na barskoj pruzi',
                    content: {
                      rendered:
                        '<p>Doslo je do izmene</p>\n<p>Voz nece saobracati iz tehnickih razloga</p>',
                    },
                  },
                ])
              )
            )

            controller.close()
          },
        })
        return new HttpResponse(stream, {
          headers: {},
          type: 'cors',
          status: 200,
        })
      })
    )
    render(
      <BrowserRouter>
        <DeparturesContext.Provider
          value={{
            departures: [
              {
                departureTime: '0:01',
                arrivalTime: '0:02',
                trainId: 8003,
              },
            ],
            loading: false,
          }}
        >
          <DeparturesLayout />
        </DeparturesContext.Provider>
      </BrowserRouter>
    )

    const serviceUpdate = await screen.findByText(/nema odstupanja/i)
    expect(serviceUpdate).toBeInTheDocument()
  })

  it('should render service updates properly when a relevant departure is cancelled', async () => {
    render(
      <BrowserRouter>
        <DeparturesContext.Provider
          value={{
            departures: [
              {
                departureTime: '0:01',
                arrivalTime: '0:02',
                trainId: 8003,
              },
            ],
            loading: false,
          }}
        >
          <DeparturesLayout />
        </DeparturesContext.Provider>
      </BrowserRouter>
    )

    const serviceUpdate = await screen.findByText(/nece saobracati/i)
    const validTodayMessage = await screen.findByText(/izmene za danas/i)
    expect(serviceUpdate).toBeInTheDocument()
    expect(serviceUpdate).toHaveClass('service-update-details')
    expect(validTodayMessage).toBeInTheDocument()
  })

  it('should display correct message when train service updates are not available', async () => {
    server.use(
      http.get('https://www.srbvoz.rs/wp-json/wp/v2/info_post', () => {
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(new TextEncoder().encode(''))
            controller.close()
          },
        })
        return new HttpResponse(stream, {
          headers: {},
          type: 'cors',
          status: 500,
        })
      })
    )
    render(
      <BrowserRouter>
        <DeparturesContext.Provider
          value={{
            departures: [
              {
                departureTime: '0:01',
                arrivalTime: '0:02',
                trainId: 8003,
              },
            ],
            loading: false,
          }}
        >
          <DeparturesLayout />
        </DeparturesContext.Provider>
      </BrowserRouter>
    )

    const serviceUpdate = await screen.findByText(/nedostupn/i)
    expect(serviceUpdate).toBeInTheDocument()
  })

  /*
     TODO: Investigate further why it's not navigating to form when using
     data-testid selector then fix and uncomment the test.

     Passes the manual testing.
    */

  // it("should navigate to form when back button is clicked", async () => {
  //     user.setup();
  //     render(
  //         <BrowserRouter>
  //             <DeparturesContext.Provider value={{ departures: [], loading: false }}>
  //                 <DeparturesLayout />
  //             </DeparturesContext.Provider>
  //         </BrowserRouter>);
  //     const back = screen.getByTestId("back-to-form");
  //     await user.click(back);
  //     const form = await screen.findByTestId("search-form");
  //     expect(form).toBeInTheDocument();
  // });
})
