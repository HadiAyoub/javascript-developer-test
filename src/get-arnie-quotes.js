const { httpGet } = require('./mock-http-interface');

/**
 * Executes a HTTP GET request on each of the URLs, transforms each of the HTTP responses according to the challenge instructions and returns the results.
 * 
 * @param {string[]} urls - an array of HTTP GET endpoints to get Arnie Quotes
 * @returns {Promise} A promise which rresolves to an array of Arnie quotes or failure messages from the API
 */
const getArnieQuotes = async (urls) => {
  let arnieQuotes = []; //holds the results of our processed API calls

  //build an array of promises from our API calls, so that we can call promise.all later
  let arnieRequests = urls.map(url => {
    return httpGet(url);
  });

  try {
    let arnieResponses = await Promise.all(arnieRequests);

    //process the API response into the required format (in real world, I would add context here.. I actually have no clue why we want quotes in this way)
    arnieResponses.forEach(arnieResponse => {

      //the API returns stringified JSON, must parse it first (if I could, I would move this parsing logic to the http interface)
      //I don't think optional chaining has found it's way to javascript, but I sure would have loved to use it here. 
      arnieResponse.body = JSON.parse(arnieResponse.body);

      if (arnieResponse.status === 200) {
        arnieQuotes.push({ 'Arnie Quote': arnieResponse.body.message });
      } else {
        arnieQuotes.push({ 'FAILURE': arnieResponse.body.message });
      }
    });

  } catch (e) {
    console.log(e);
  }

  return arnieQuotes;
};

module.exports = {
  getArnieQuotes,
};
