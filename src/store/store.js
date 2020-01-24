import createStore from 'unistore';
import axios from 'axios';
import swal from 'sweetalert2';

const initialState = {
  data: '',
  error: undefined,
  claims: '',
  baseUrl: 'http://0.0.0.0:5000/',
  isLogin: false,
  isAdmin: false,
  search: '',
  categoryList: undefined,
  rajaongkirKey: '8990a11e8949097b46df6762c56a8331',
  provinceList: undefined,
  cityList: undefined,
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
      url: state.baseUrl+'login',
    };
    await axios(input)
      .then(async (response) => {
        if(response.data!==''||response.data!==undefined){
          if (response.data.hasOwnProperty('claims')) {
            if (response.data.claims.admin) {
              await store.setState({ isAdmin: true });
            }
            await store.setState({ isLogin: true });
            await store.setState({ claims: response.data.claims });
          } else {
            await store.setState({ isLogin: false });
          }
        }
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  handleLogout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('cart')
    await store.setState({ isLogin: false });
    await store.setState({ isAdmin: false });
    swal.fire({
      title: 'Good bye!',
      text: 'You have successfully logged out!',
      icon: 'success',
      timer: 2000,
      confirmButtonText: 'understood',
    });
  },

  handleReset: async () => {
    await store.setState({data:undefined, error:undefined})
  },

  getCategory: async (state) => {
    const input = {
      method: 'get',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      url: state.baseUrl+'category/list',
    };
    await axios(input)
      .then(async (response) => {
        await store.setState({ categoryList: response.data.result });
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  getProvince: async(state) => {
    const input = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      url: state.baseUrl+'shipment/province',
    };
    await axios(input)
      .then(async (response) => {
        await store.setState({ provinceList: response.data.result });
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  getCity: async(state, id) => {
    const input = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
      url: state.baseUrl+'shipment/city',
      params: {
        province: id
      }
    };
    await axios(input)
      .then(async (response) => {
        await store.setState({ cityList: response.data.result });
      })
      .catch((error) => {
        console.warn(error);
      });
  },

  addToCart: async (state, input, qty) => {
    if (qty > input.stock) {
      qty = input.stock;
    }
    let added = false;
    const cart = localStorage.getItem('cart') === null ? [] : JSON.parse(localStorage.getItem('cart'));
    if (Array.isArray(cart)) {
      cart.forEach((item) => {
        if (item.data !== undefined) {
          if (item.data.id === input.id) {
            item.qty += qty;
            if (item.qty > input.stock) {
              item.qty = input.stock;
            }
            added = true;
          }
        }
      });
    }
    if (!added) {
      const dict = {
        data: input,
        qty: await parseInt(qty),
      };
      cart.push(dict);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
  },

  deleteFromCart: (state, id) =>{
    const cart = JSON.parse(localStorage.getItem('cart'))
    let newCart;
    if(Array.isArray(cart)){
      newCart = cart.filter((value, index)=>{
        return index!==id
      })
    }
    localStorage.setItem('cart', JSON.stringify(newCart))
  },
  
  updateCart: (state, id, qty)=>{
    const cart = JSON.parse(localStorage.getItem('cart'));
    let newCart;
    if(Array.isArray(cart)){
      cart.forEach(item => {
        if(item.data.id===id){
          item.qty += qty
          if(item.qty>item.data.stock){
            item.qty=item.data.stock
          }
        }
      });
      newCart = cart.filter((item)=>{
        return item.qty>0
      })
    }
    localStorage.setItem('cart', JSON.stringify(newCart))
  },

  handleError: async (state) => {
    if(state.error!==undefined){
      await swal.fire({
        title: 'Error!',
        text: state.error.data.message,
        icon: 'error',
        timer: 1500,
        confirmButtonText: 'understood',
        confirmButtonColor: '#b36232',
      });
      await store.setState({error: undefined})
    }
  },
});
