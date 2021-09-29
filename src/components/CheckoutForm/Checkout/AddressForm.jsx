import React,{useEffect, useState} from 'react'
import {InputLabel,Select,MenuItem,Button,Grid,Typography} from '@material-ui/core'
import {useForm,FormProvider} from 'react-hook-form'
import FormInput from './CustomTextField'
import { commerce } from '../../../lib/commerce'
import{Link} from 'react-router-dom'
const AddressForm = ({checkoutToken,nextStep}) =>{
    const[shippingCountries,setShippingContries]=useState([])
    const[shippingCountry,setShippingContry]=useState('')
    const[shippingSubDivsions,setShippingSubDivsions]=useState([])
    const[shippingSubDivsion,setShippingSubDivsion]=useState('')
    const[shippingOptions,setShippingOptions]=useState([])
    const[shippingOption,setShippingOption]=useState('')
    const methods = useForm();
    /**
     *this is a confused countries 
     *
     */
     
     const countries = Object.entries(shippingCountries).map(([code,nameCon]) => ({id:code,label:nameCon}))
     const subDivsions = Object.entries(shippingSubDivsions).map(([code,nameCon]) => ({id:code,label:nameCon}))
     const options = shippingOptions.map((sO)=>({id:sO.id,label:`${sO.description} - ${sO.price.formatted_with_symbol}`}))
    
    
     //fetch Countries
    const fetchShippingCountries = async (checkoutTokenId) =>{
        const {countries} =await commerce.services.localeListShippingCountries(checkoutTokenId)
        setShippingContries(countries)
        setShippingContry(Object.keys(countries)[0])
        
    }
    //fetch subdivsions

    const fetchSubdivisions = async (countryCode) =>{
        const{subdivisions} = await commerce.services.localeListSubdivisions(countryCode)
            setShippingSubDivsions(subdivisions)
            setShippingSubDivsion(Object.keys(subdivisions)[0])
    }
    const fetchShippingOptions = async(checkoutTokenId,country,region=null)=>{
        const options = await commerce.checkout.getShippingOptions(checkoutTokenId,{country,region})
        setShippingOptions(options)
        setShippingOption(options[0].id)
    }
    //Components Did mounts
    useEffect(()=>{
        fetchShippingCountries(checkoutToken.id)
    },[])

    useEffect(()=>{
        if(shippingCountry) fetchSubdivisions(shippingCountry)
    },[shippingCountry])

    useEffect(()=>{
        if(shippingSubDivsion) fetchShippingOptions(checkoutToken.id,shippingCountry,shippingSubDivsion)
    },[shippingSubDivsion])
    return (
        <>
        <Typography variant="h6" gutterBottom>Shipping Address</Typography>
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((data)=>nextStep({...data,shippingCountry ,shippingSubDivsion ,shippingOption}))}>
                <Grid container spacing={3}>
                    <FormInput required name='firstName' label='First Name' />
                    <FormInput required name='lastName' label='Last Name' />
                    <FormInput required name='address1' label='Address' />
                    <FormInput required name='email' label='Email' />
                    <FormInput required name='city' label='City' />
                    <FormInput required name='zip' label='ZIP / Postal' />
                     <Grid item xs={12} sm={6}>
                        <InputLabel>Shiping Country</InputLabel>
                        <Select value={shippingCountry} fullWidth onChange={(e)=>setShippingContry(e.target.value)}>
                           {countries.map((country)=>(
                                <MenuItem key={country.id} value={country.id}>
                                    {country.label}
                                </MenuItem>
                                ))}
                        </Select>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Shiping SubDivsion</InputLabel>

                            <Select value={shippingSubDivsion} fullWidth onChange={(e)=>setShippingSubDivsion(e.target.value)}>
                        {subDivsions.map((subDiv)=>(
                                <MenuItem key={subDiv.id} value={subDiv.id}>
                                     {subDiv.label}
                                </MenuItem>
                            ))}
                            </Select>
                    </Grid>
                     
                    <Grid item xs={12} sm={6}>
                        <InputLabel>Shiping Options</InputLabel>
                        <Select value={shippingOption} fullWidth onChange={(e)=>setShippingOption(e.target.value)}>
                        {options.map((option)=>(
                                <MenuItem key={option.id} value={option.id}>
                                     {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </Grid>
                </Grid>
                <br/>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                            <Button component={Link} to="/cart" variant="outlined">Back To Cart</Button>
                            <Button type="submit" color="primary" variant="contained">Next</Button>
                </div>
            </form>

        </FormProvider>
        </>
    )
}
export default AddressForm