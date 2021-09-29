import {useState, useEffect} from 'react';
import {Products, Navbar, Cart,Checkout } from './components';
import {commerce} from './lib/commerce';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
function App () {
  const [cart, setCart] = useState ({});
  const [products, setProducts] = useState ([]);
  const[order,setOrder] = useState({})
  const[error,setError]= useState({})
  const fetchProducts = async () => {
    const {data} = await commerce.products.list ();
    setProducts (data);
  };

  const fetchCart = async () => {
    setCart (await commerce.cart.retrieve ());
  };

  const handleAddToCart = async (productId, quantity) => {
    const {cart} = await commerce.cart.add (productId, quantity);
    setCart (cart);
  };
  const handleupdatecard = async(productId, quantity)  =>{
    const {cart} = await  commerce.cart.update(productId, {quantity});
    setCart (cart);

  }
  const handleRemoveCard = async(productId)  =>{
    const {cart} = await  commerce.cart.remove(productId);
    setCart (cart);

  }

  const handleEmptyCard = async()  =>{
    const {cart} = await  commerce.cart.empty();
    setCart (cart);

  }
  const refershCart = async() =>{
    const newCart = await commerce.cart.refersh()
      setCart(newCart)
  }
  const handleCaptureCheckout = async (checkoutToken,newOrder) =>{
      try {
          const IncomingOrder = await commerce.checkout.capture(checkoutToken,newOrder)
          setOrder(IncomingOrder)
          refershCart()
        } catch (error) {
        console.log(error)
        setError(error.data.error.message)
      }
  }
  useEffect (() => {
    fetchProducts ();
    fetchCart ();
  }, []);
  console.log (cart);
  return (
    <Router>

      <div>
        <Navbar totalItems={cart.total_items} />
        <Switch>
          <Route exact path="/">
            <Products products={products} onAddToCart={handleAddToCart} />
          </Route>
          <Route exact path="/cart">
            <Cart cart={cart}
            handleupdatecard={handleupdatecard}
            handleRemoveCard={handleRemoveCard}
            handleEmptyCard={handleEmptyCard}
            />
          </Route>
          <Route path="/checkout" exact>
              <Checkout 
              error={error}
              order={order}
              onCaptureCheckout={handleCaptureCheckout}
              cart={cart}
              />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
