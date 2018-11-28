/**
 * Get the full url with the path attached
 * @param {string} path The directory path to navigate in the url (eg: /home)
 * @returns The full url of the server
 */
const url = path => `${config.server.endpoint}${path}`;

const config = {
  server: {
    endpoint: 'https://simplyeat-server.herokuapp.com',
    url: url
  }
};

export default config;
