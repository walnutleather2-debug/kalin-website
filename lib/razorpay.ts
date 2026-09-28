import Razorpay from 'razorpay'

export function getRazorpayInstance() {
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return null
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  })
}

export function getRazorpayKeyId() {
  return process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID || ''
}
