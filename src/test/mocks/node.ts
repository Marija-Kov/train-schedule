import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

export const server = setupServer(
  ...[
    http.get('https://www.srbvoz.rs/wp-json/wp/v2/info_post', () => {
      const currentDateTime = new Date().toISOString().split('.')[0]
      const currentDate = currentDateTime.split('T')[0]
      const currentLocalTime = new Date().toTimeString().split(' ')[0]
      const date = currentDate + 'T' + currentLocalTime

      return HttpResponse.json(
        [
          {
            date: date,
            slug: 'Izmena bgvoz',
            content: {
              rendered:
                '<p>Doslo je do izmene</p>\n<p>Voz nece saobracati iz tehnickih razloga</p>',
            },
          },
          {
            date: date,
            slug: 'Izmena bgvoz',
            content: {
              rendered:
                '<p>Doslo je do izmene</p>\n<p>Voz za Resnik nece saobracati iz tehnickih razloga</p>',
            },
          },
          {
            date: date,
            slug: 'Izmena na barskoj pruzi',
            content: {
              rendered:
                '<p>Doslo je do izmene</p>\n<p>Voz nece saobracati iz tehnickih razloga</p>',
            },
          },
        ],
        {
          headers: {},
          type: 'cors',
          status: 200,
        }
      )
    }),
  ]
)
