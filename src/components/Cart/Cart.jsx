import React from 'react'
import{Container,Typography,Button,Grid} from '@material-ui/core'
import useStyles from './styles.js'
import CartItem from './CartItem/CartItem'
import{Link} from 'react-router-dom'
const Cart = ({cart ,handleupdatecard,handleRemoveCard,handleEmptyCard}) => {
    
    const classes = useStyles();
   const Empty = () =>(
       <Typography variant="subtitle">You have no Items in your cart ,<Link to="/" className={classes.link}>Start Shopping Now!</Link></Typography>
   )
   const FillCart = () =>(
       <>
       <Grid container spacing={3}>
            {cart.line_items.map((item)=>(
                <Grid item xs={12} sm={4} key={item.id}>
                    <CartItem 
                    item={item} 
                    handleupdatecard={handleupdatecard} 
                    handleRemoveCard={handleRemoveCard}
                    />
                </Grid>
            ))}
       </Grid>
       <div className={classes.cardDetails}>
                    <Typography variant="h4" >Subtotal : {cart.subtotal.formatted_with_symbol}</Typography>
            <div>
                    <Button 
                    className={classes.emptyButton} 
                    size="large" 
                    type="button" 
                    variant="contained" 
                    color="secondary"
                    onClick={handleEmptyCard}
                    >Empty Card</Button>
                    <Button
                    component={Link}
                    to="/checkout" 
                    className={classes.checkoutButton} 
                    size="large" 
                    type="button" 
                    variant="contained" 
                    color="primary">checkOut</Button>
            </div>
       </div>
       </>
   )
   if(!cart.line_items) return "Loading...."
    return (
        <Container>
            <div className={classes.toolbar}>
                <Typography className={classes.title} variant="h4" gutterBottom>Your Shopping Cart!</Typography>
                    {!cart.line_items.length ?<Empty/>:<FillCart/>}
            </div>

        </Container>
    )
}

export default Cart
