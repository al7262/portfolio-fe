import createStore from 'unistore';
import axios from 'axios';
import swal from 'sweetalert2';

const initialState = {
  data: '',
  error: '',
  baseUrl: 'http://0.0.0.0:5000/',
  isLogin: false,
  isAdmin: false,
  search: '',
  categoryList: undefined,
};

export const store = createStore(initialState);

export const actions = (store) => ({
  handleInput: (state, event) => {
    console.log(event.target.name, event.target.value);
    store.setState({ [event.target.name]: event.target.value });
  },
  handleChange: (state, key, value) => {
    store.setState({ [key]: value });
  },
  handleManyChanges: (state, dict) => {
    store.setState(dict);
  },

  handleApi: async (state, input) => {
    await axios(input)
      .then(async (response) => {
        if (response.status === 200) {
          await store.setState({ data: response.data });
        } else {
          await store.setState({ error: response });
          swal.fire({
            title: 'Error!',
            text: response.data.message,
            icon: 'error',
            confirmButtonText: 'understood',
          });
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  checkLoginStatus: async (state) => {
    const input = {
      method: 'post',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      url: 'http://0.0.0.0:5000/login',
    };
    await axios(input)
      .then(async (response) => {
        if (response.data.hasOwnProperty('claims')) {
          if (response.data.claims.admin) {
            await store.setState({ isAdmin: true });
          }
          await store.setState({ isLogin: true });
        } else {
          await store.setState({ isLogin: false });
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  handleLogout: async () => {
    localStorage.removeItem('token');
    await store.setState({ isLogin: false });
    await store.setState({ isAdmin: false });
    swal.fire({
      title: 'Good bye!',
      text: 'You have successfully logged out!',
      icon: 'success',
      confirmButtonText: 'understood',
    });
  },

  getCategory: async () => {
    const input = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      url: 'http://0.0.0.0:5000/category/list',
    };
    await axios(input)
      .then(async (response) => {
        await store.setState({ categoryList: response.data });
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  addToCart: async (state, input, qty) => {
    if(qty>input.stock){
        qty=input.stock
    }
    const dict = {
        data: input,
        qty: await parseInt(qty)
    }
    let added = false;
    const cart = localStorage.getItem('cart')===null? [] : JSON.parse(localStorage.getItem('cart'))
    if(Array.isArray(cart)){
      cart.forEach(item => {
        if(item.data!==undefined){
          if(item.data.id===input.id){
            item.qty+=qty;
            if (item.qty>input.stock){
              item.qty=input.stock
            }
            added = true;
          }
        }
      });
    }
    if(!added){
      cart.push(dict);
    }
    localStorage.setItem('cart', JSON.stringify(cart))
  },
});
