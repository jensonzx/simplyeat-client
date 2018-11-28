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

  static async registerUser(username, password) {
    try {
      // TODO: Rework on the validation and add confirm password
      let response;
      try {
        response = await axios.post(
          url('/register'),
          qs.stringify({ username: username, password: password })
        );
      } catch (error) {
        const responseError = JSON.parse(error.request.response);
        throw new Error(responseError.message);
      }

      const registerData = this.handleResponse(response);
      if (registerData.error)
        throw new Error(registerData.error.message || registerData.error);

      const result = await this.authenticateUser(username, password);
      const { user, error } = result;
      if (error) throw new Error(error.message || error);
      console.log(user);
      return {
        message: 'Registered successfully',
        user: user
      };
    } catch (error) {
      return {
        message: 'Register failed.',
        error: error.message
      };
    }
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

  static async reauthenticateUser() {
    try {
      if (!this.isUserAuthenticated()) return;
      console.log('Token found, attempting to log in');

      const savedToken = sessionStorage.getItem('token');
      const response = await axios.get(url('/getuser'), {
        headers: {
          Authorization: `Bearer ${savedToken}`
        }
      });
      if (response.status !== 200) return false;

      console.log(response.data);
      return {
        isLoggedIn: true,
        user: response.data.user
      };
    } catch (err) {
      err.catch && err.catch(error => console.log(error));
      return false;
    }
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
