import request from 'supertest'
import app from '../src/app'

describe(' Test Server', () => {
  it('should respond with 200 OK for root route', (done) => {
    request(app)
      .get('/api/films')
      .expect(200, done)
  })

  it('should respond with 404 for non-existent routes', (done) => {
    request(app)
      .get('/non-existent')
      .expect(404, done)
  })
})
