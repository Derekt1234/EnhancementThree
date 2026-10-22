const tripsEndpoint = "http://localhost:3000/api/trips";
const options = {
    method: "GET",
    headers: {
        "Accept": "application/json"
    }
}


// var fs = require('fs');
// var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));
  

/* GET travel page */
const travel = async function (req, res, next) {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 5, 1), 100);

  try {
    const response = await fetch(
      `${tripsEndpoint}?page=${page}&pageSize=${pageSize}`,
      options
    );
    const result = await response.json();

    if (!result || !Array.isArray(result.trips)) {
      throw new Error('Invalid trip list returned by the API');
    }

    const message = result.trips.length
      ? null
      : 'No trips exist in our database!';

    res.render('travel', {
      title: 'Travlr Getaways',
      trips: result.trips,
      message,
      page: result.page,
      totalPages: result.totalPages,
      showPagination: result.totalPages > 1,
      hasPreviousPage: result.page > 1,
      hasNextPage: result.page < result.totalPages,
      previousPage: result.page - 1,
      nextPage: result.page + 1
    });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  travel
};