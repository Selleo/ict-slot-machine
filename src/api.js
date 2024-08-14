const RETRY_DELAY = 500

class Api {
  static authToken = '';

  static async delay() {
    return new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
  }

  static async login() {
    try {
      const response = await fetch(`${process.env.URL}/auth/login`,
        {
          method: 'POST',
          body: JSON.stringify({
            name: process.env.LOGIN,
            password: process.env.PASSWORD,
          }),
          headers: {
            "Content-Type": "application/json",
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        Api.authToken = data.authToken;
      } else {
        const data = await response.json();
        throw new Error(`Authentication failed: ${response.status} ${data.code} ${data.message}`);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  static async getUsers(retryCount = 0) {
    try {
      const response = await fetch(`${process.env.URL}/rfids`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": Api.authToken,
        }
      });

      if (response.ok) {
        return await response.json();
      } else if (retryCount < 3) {
        console.error(`Authentication failed. Retrying login in ${RETRY_DELAY}ms...`);
        try {
          await Api.delay();
          await Api.login();
          return Api.getUsers(retryCount + 1);
        } catch (loginError) {
          console.error('Retry login failed:', loginError.message);
          throw loginError;
        }
      } else {
        throw new Error('Failed to authenticate.');
      }
    } catch (error) {
      console.error('Failed to get all RFID data:', error.message);
      console.error(error);
    }
  }

  static async getUser(rfidKey, retryCount = 0) {
    try {
      const response = await fetch(`${process.env.URL}/rfids/${rfidKey}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": Api.authToken,
        }
      });

      if (response.ok) {
        return await response.json();
      } else if (retryCount < 3) {
        console.error(`Authentication failed. Retrying login in ${RETRY_DELAY}ms...`);
        try {
          await Api.delay();
          await Api.login();
          return Api.getUser(rfidKey, retryCount + 1);
        } catch (loginError) {
          console.error('Retry login failed:', loginError.message);
          throw loginError;
        }
      } else {
        throw new Error('Failed to authenticate.');
      }
    } catch (error) {
      console.error('Failed to get RFID data:', error.message);
      console.error(error);
    }
  }
}

export default Api;
