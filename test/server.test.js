const request = require('supertest')
const app = require('../src/server')

describe('server', () => {
  it('gives 200 response for POST method', () => {
    return request(app).post('/').expect(200)
  })
})
