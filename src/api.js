import axios from 'axios';

let authToken = null;

const Api = {
  login: async () => {
    try {
      const response = await axios.post(`${process.env.URL}/auth/login`,
        {
          name: process.env.LOGIN,
          password: process.env.PASSWORD,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        authToken = response.data.authToken;
      } else {
        const { data } = response;
        throw new Error(`Authentication failed: ${response.status} ${data.code} ${data.message}`);
      }
    } catch (error) {
      console.error('Error: ', error);
    }
  },
  getUser: async (key) => {
    try {
      if (!authToken) {
        login();
      }

      const response = await axios.get(`${process.env.URL}/rfids/${key}`,
        {
          username: "example",
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": authToken,
          },
        },
      );

      if (response.status !== 200) {
        const { data } = response;
        throw new Error('Error: ', response.status, data);
      }

      return response.data;
    } catch (error) {
      console.error('Error: ', error.message);
    }
  }
}

export default Api;
