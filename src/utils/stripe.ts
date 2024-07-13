
import initStripe from 'stripe'
import secrets from './config'
export const stripe = new initStripe(secrets.STRIPE_SECRET_KEY as string)
