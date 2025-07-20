const axios = require("axios");

module.exports = async function searchFromBackend(query) {
  const res = await axios.get(`http://localhost:3000/search?q=${encodeURIComponent(query)}`);
  return res.data;
};
