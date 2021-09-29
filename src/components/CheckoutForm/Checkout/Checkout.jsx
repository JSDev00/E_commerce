import React ,{useState,useEffect}from 'react'
import{Paper,Stepper,Step,StepLabel,Typography,CircularProgress,Divider,Button} from '@material-ui/core'
import useStyles from './styles'
import AddressForm from './AddressForm'
import PaymentForm from './PaymentForm'
import { commerce } from '../../../lib/commerce'
import{Link} from 'react-router-dom'
const steps = ['Shipping address','Payment details'];
const Checkout = ({cart,error ,order,onCaptureCheckout}) =>{
    
    const [activeStep,setActiveStep] = useState(0);
    const[checkoutToken,setCheckoutToken] = useState(null)
    const[shippingData,setShippingData] = useState({})
    const classes = useStyles(); 

    useEffect(()=>{
        const generateToken = async() =>{
            try {
                const token = await commerce.checkout.generateToken(cart.id,{type:'cart'})
                setCheckoutToken(token)
            } catch (error) {
                console.log(error)
            }
        }
        generateToken()
    },[cart])
    const next = () =>setActiveStep((prev)=>prev+1)
    const back = () =>setActiveStep((prev)=>prev-1)

    const nextStep = (data) =>{
        setShippingData(data)
        next()
    }
    const ConfirmationForm = () =>(
        <>
            <Typography>
                Thank you for your prachising <Link to="/">Back To Home</Link>
            </Typography>
        </>
    )
     const Form= ()=>activeStep===0
    ?
    <AddressForm nextStep={nextStep} checkoutToken={checkoutToken}/>
    :<PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} next={next} back={back} onCaptureCheckout={onCaptureCheckout}/>
    return (
        <>
        <div className={classes.toolbar}  />

        <main className={classes.layout}>
            <Paper className={classes.papper}>
                    <Typography variant="h4" align="center">
                        Checkout
                    </Typography>
                    <Stepper activeStep={activeStep} className={classes.stepper}>
                        {steps.map((step)=>(
                            <Step key={step}>
                                    <StepLabel>{step}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                    {activeStep===steps.length?<ConfirmationForm/>:  checkoutToken && <Form/>}
            </Paper>
        </main>
        </>
    )
} 
export default   Checkout