import axios from 'axios';
import config from '../config';
import qs from 'querystring';

const url = config.server.url;

class Auth {
  /**
   * Handle the response data retrieved from axios call
   * @param {Object} response The response data from axios
   * @returns The object data interpreted from the response, if server returned an error then the object will have an error key inside.
   */
  static handleResponse(response) {
    if (response.status !== 200) {
      return { error: response.data, status: response.statusText };
    }

    return response.data;
  }

  static async authenticateUser(username, password) {
    try {
      let response;
      try {
        response = await axios.post(
          url('/login'),
          qs.stringify({ username: username, password: password })
        );
      } catch (error) {
        const responseError = JSON.parse(error.request.response);
        throw new Error(responseError.message);
      }

      const { token, user, error } = this.handleResponse(response);

      if (error) throw new Error(error.message || error);

      this.setToken(token, user);
      return {
        message: 'Login successfully',
        user: user
      };
    } catch (error) {
      return {
        message: 'Login failed.',
        error: error.message
      };
    }
  }

  /**
   * Authenticate a user. Save a token string in Session Storage
   *
   * @param {string} token
   * @param {string} user
   */
  static setToken(token, user) {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', user);
  }

  /**
   * Check if a user is authenticated - check if a token is saved in Session Storage
   *
   * @returns {boolean}
   */
  static isUserAuthenticated() {
    return sessionStorage.getItem('token') !== null;
  }

  /**
   * Deauthenticate a user. Remove a token from Session Storage.
   *
   */
  static deauthenticateUser() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getToken() {
    return sessionStorage.getItem('token');
  }
}

export default Auth;
