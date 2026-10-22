const Trip = require('../models/travlr');
const { tripsAddTrip } = require('./trips');

describe(' Testing tripsAddTrip controller', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('saves and returns a new trip', async () => {
    const request = {
      body: {
        code: 'TEST001',
        name: 'Test Reef',
        length: '4 nights / 5 days',
        start: '2026-01-01T00:00:00Z',
        resort: 'Test Resort',
        perPerson: '999.00',
        image: 'test.jpg',
        description: 'Test description'
      }
    };

    const savedTrip = { ...request.body, _id: 'test-id' };
    const saveSpy = jest
      .spyOn(Trip.prototype, 'save')
      .mockResolvedValue(savedTrip);

    const response = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };

    await tripsAddTrip(request, response);

    expect(saveSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy.mock.instances[0].code).toBe('TEST001');
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.json).toHaveBeenCalledWith(savedTrip);
  });
});


/**  Second test **
 * Test that the controller:
 * - Calls the API
 * - receives JSON data
 * - renders the travel page
 * */

/**const controller = require("../../app_server/controllers/travel");

describe("Controller: travel", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("Should render travel page with trips", async () => {
    jest.spyOn(global, "fetch").mockResolvedValue({
      json: jest.fn().mockResolvedValue([ { code: "TEST001" } ])
    });

    const req = {};
    const res = { render: jest.fn() };

    await controller.travel(req, res);

    expect(res.render).toHaveBeenCalled();
    expect(res.render.mock.calls[0][0]).toBe("travel");
  });
});
**/