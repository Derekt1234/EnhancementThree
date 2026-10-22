const request = require('supertest');
const app = require('../../app');

/**  Test GET /api/trips  **/
describe('GET /api/trips', () => {
  it('returns a paginated list of trips', async () => {
    const response = await request(app).get('/api/trips');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.trips)).toBe(true);
    expect(response.body).toMatchObject({
      page: 1,
      pageSize: 5
    });
    expect(response.body.totalPages).toEqual(
      Math.ceil(response.body.total / response.body.pageSize)
    );
  });
});

describe('GET /travel.html', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders trips returned by the API instead of the static page', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        trips: [
          {
            code: 'NEW001',
            name: 'New Test Getaway',
            image: 'new-getaway.jpg',
            description: 'A newly added trip'
          }
        ],
        page: 1,
        pageSize: 5,
        total: 1,
        totalPages: 1
      })
    });

    const response = await request(app).get('/travel.html');

    expect(response.status).toBe(200);
    expect(response.text).toContain('New Test Getaway');
  });
});