import createStore from 'unistore';
import axios from 'axios';
import swal from 'sweetalert2';

const initialState = {
  data: '',
  error: undefined,
  claims: '',
  baseUrl: 'https://ancient.my.id/',
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
   /**
   * Handling input to global state with event as the params.
   * @param {event} event the event where function was called
   */
  handleInput: (state, event) => {
    console.log(event.target.name, event.target.value);
    store.setState({ [event.target.name]: event.target.value });
  },

   /**
   * Handling input to global state with key and value as the params.
   * @param {number} key the key of dictionary/object
   * @param {number} value the value for dictionary/object
   */
  handleChange: (state, key, value) => {
    store.setState({ [key]: value });
  },

  /**
   * Handling input to global state with dictionary as the params.
   * @param {dict} dict the object containing several key and value as input.
   */
  handleManyChanges: (state, dict) => {
    store.setState(dict);
  },

  /**
   * Handling API to post, put, get, and delete action through AXIOS.
   * @param {dict} input the object containing detail of axios input.
   */
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

  /**
   * Checking login status of the user everytime page was mounted
   */
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

  /**
   * Handling logout when user click log out butten
   */
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

  /**
   * Handle reset data in global state everytime page will unmount
   */
  handleReset: async () => {
    await store.setState({data:undefined, error:undefined})
  },

  /**
   * get list category from database
   * response was saved in store.data
   */
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

  /**
   * get list of province from raja ongkir
   * the response result was saved in store.listProvince
   */
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

  /**
   * get list of city based on province id
   * the response result was saved in store.listCity
   * @param {number} id the id of province
   */
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

  /**
   * add item to cart
   * @param {number} input data of the product
   * @param {number} qty quantity of item inputted
   */
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
    await swal.fire({
      title: 'Added!',
      text: 'Product successfully added to cart',
      icon: 'success',
      timer: 750,
      showConfirmButton: false,
    });
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
