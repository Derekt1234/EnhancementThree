const Trip = require('../models/travlr');


describe('Trip model', () => {
  test('creates a trip with required fields', () => {
    const newTrip = new Trip({
      code: 'TEST001',
      name: 'Test Reef',
      length: '4 nights / 5 days',
      start: '2026-01-01T00:00:00Z',
      resort: 'Test Resort',
      perPerson: '999.00',
      image: 'test.jpg',
      description: 'Test description'
    });

    expect(newTrip.code).toBe('TEST001');
    expect(newTrip.name).toBe('Test Reef');
    expect(newTrip.length).toBe('4 nights / 5 days');
    expect(newTrip.resort).toBe('Test Resort');
    expect(newTrip.perPerson).toBe(999);
    expect(newTrip.image).toBe('test.jpg');
    expect(newTrip.description).toBe('Test description');
  });
});