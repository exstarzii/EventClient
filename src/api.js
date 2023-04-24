import axios from 'axios';

const API_URL = process.env.VUE_APP_BASE_URL;

function loginUser($q, router, nickname, code) {
  //   return axios.post(`${API_URL}/user/login`, { nickname, code });
  axios
    .post(`${API_URL}/user/login`, { nickname, code })
    .then((response) => {
      console.log(response);
      $q.notify('Logged');
      $q.cookies.set('token', response.data.access_token);
      router.push({ path: '/userinfo' });
    })
    .catch((error) => {
      console.log(error);
      if (error.response.status == 401) {
        $q.notify({
          color: 'negative',
          icon: 'report_problem',
          message: 'Wrong login or password',
        });
      } else if (error.response.status == 404) {
        $q.notify({
          color: 'negative',
          icon: 'report_problem',
          message: 'The server is not available',
        });
      }
    });
}

function createUser($q, router, nickname, phone) {
  axios
    .post(`${API_URL}/user`, { nickname, phone })
    .then((response) => {
      console.log(response);
      if (response.status == 201) {
        $q.notify('Account created');
        router.push({ path: '/auth', query: { nickname } });
      }
    })
    .catch((error) => {
      console.log(error.response);
      error.response.data.message.forEach((mes) => {
        $q.notify({
          color: 'negative',
          icon: 'report_problem',
          message: mes,
        });
      });
    });
}

function getUser($q) {
  const token = $q.cookies.get('token');
  return axios
    .get(process.env.VUE_APP_BASE_URL + '/user', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .catch((error) => {
      if (!error.status) {
        $q.notify({
          color: 'negative',
          icon: 'report_problem',
          message: 'The server is not available',
        });
      } else if (error.response.status == 401) {
        $q.notify({
          color: 'negative',
          icon: 'report_problem',
          message: 'You are not logged in',
        });
      } else if (error.response.status == 404) {
        $q.notify({
          color: 'negative',
          icon: 'report_problem',
          message: 'The server is not available',
        });
      }
    });
}

function updateUser(
  $q,
  router,
  nickname,
  phone,
  photo,
  name,
  surename,
  email,
  age,
  sex,
  city,
  about
) {
  const token = $q.cookies.get('token');
  axios
    .put(
      process.env.VUE_APP_BASE_URL + '/user',
      {
        nickname,
        phone,
        photo,
        name,
        surename,
        email,
        age,
        sex,
        city,
        about,
      },
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      }
    )
    .then((response) => {
      console.log(response);
      if (response.status == 200) {
        $q.notify('saved');
        router.push({ path: '/userinfo' });
      }
    })
    .catch((error) => {
      console.log(error.response);
      if (error.response.status == 404) {
        $q.notify({
          color: 'negative',
          icon: 'report_problem',
          message: 'The server is not available',
        });
      } else {
        error.response.data.message.forEach((mes) => {
          $q.notify({
            color: 'negative',
            icon: 'report_problem',
            message: mes,
          });
        });
      }
    });
}

function deleteUser($q) {
  const token = $q.cookies.get('token');
  axios
    .delete(process.env.VUE_APP_BASE_URL + '/user', {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    })
    .then((response) => {
      console.log(response);
      $q.notify('Account has been deleted');
      $q.cookies.set('token', '');
      router.push({ path: '/' });
    })
    .catch((error) => {
      if (error.response.status == 401) {
        $q.notify({
          color: 'negative',
          icon: 'report_problem',
          message: 'You are not logged in',
        });
      } else if (error.response.status == 404) {
        $q.notify({
          color: 'negative',
          icon: 'report_problem',
          message: 'The server is not available',
        });
      }
    });
}

function handleError(error) {
  console.log(error.response);
}
export default {
  loginUser,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
