import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Utensils, 
  ArrowLeft, 
  Plus, 
  Minus, 
  CreditCard, 
  MapPin, 
  Clock,
  CheckCircle,
  Truck,
  User,
  LogOut
} from 'lucide-react'

const CheckoutPage = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [cart, setCart] = useState([
    {
      id: 1,
      name: 'Margherita Pizza',
      price: 16.99,
      quantity: 2,
      image: '🍕'
    },
    {
      id: 2,
      name: 'Caesar Salad',
      price: 8.99,
      quantity: 1,
      image: '🥗'
    }
  ])

  const [orderDetails, setOrderDetails] = useState({
    deliveryAddress: '',
    phone: '',
    notes: '',
    paymentMethod: 'card'
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)

  const updateQuantity = (itemId, change) => {
    setCart(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    )
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getDeliveryFee = () => {
    return getSubtotal() > 25 ? 0 : 3.99
  }

  const getTax = () => {
    return getSubtotal() * 0.08
  }

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTax()
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)
    
    
    setTimeout(() => {
      setIsProcessing(false)
      setOrderPlaced(true)
      
       
      setTimeout(() => {
        navigate('/customer-dashboard')
      }, 3000)
    }, 2000)
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-white" />
          </motion.div>
          
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Your delicious meal is being prepared and will be delivered soon.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-green-800">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Estimated delivery: 25-30 minutes</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            Redirecting to dashboard...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/menu" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 hover:text-orange-600">Back to Menu</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Checkout
            </span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-4 h-4" />
              <span className="text-sm">{user.username}</span>
            </div>
            <Button variant="ghost" onClick={onLogout} className="text-gray-600 hover:text-red-600">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Checkout 🛒
          </h1>
          <p className="text-gray-600">
            Review your order and complete your purchase
          </p>
        </motion.div>

        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Your cart is empty
            </h3>
            <p className="text-gray-600 mb-6">
              Add some delicious items to your cart first
            </p>
            <Link to="/menu">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                Browse Menu
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
             
            <div className="lg:col-span-2 space-y-6">
             
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      Delivery Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="address">Delivery Address</Label>
                      <Input
                        id="address"
                        placeholder="Enter your full address"
                        value={orderDetails.deliveryAddress}
                        onChange={(e) => setOrderDetails({...orderDetails, deliveryAddress: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Your phone number"
                        value={orderDetails.phone}
                        onChange={(e) => setOrderDetails({...orderDetails, phone: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="notes">Special Instructions (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Any special requests or notes"
                        value={orderDetails.notes}
                        onChange={(e) => setOrderDetails({...orderDetails, notes: e.target.value})}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

               
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-green-600" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="card"
                          name="payment"
                          value="card"
                          checked={orderDetails.paymentMethod === 'card'}
                          onChange={(e) => setOrderDetails({...orderDetails, paymentMethod: e.target.value})}
                          className="w-4 h-4 text-orange-600"
                        />
                        <label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                          <CreditCard className="w-5 h-5 text-gray-600" />
                          <span>Credit/Debit Card</span>
                        </label>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          id="cash"
                          name="payment"
                          value="cash"
                          checked={orderDetails.paymentMethod === 'cash'}
                          onChange={(e) => setOrderDetails({...orderDetails, paymentMethod: e.target.value})}
                          className="w-4 h-4 text-orange-600"
                        />
                        <label htmlFor="cash" className="flex items-center space-x-2 cursor-pointer">
                          <span className="text-lg">💵</span>
                          <span>Cash on Delivery</span>
                        </label>
                      </div>
                    </div>

                    {orderDetails.paymentMethod === 'card' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 space-y-4 border-t pt-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                            />
                          </div>
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input
                              id="expiryDate"
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              placeholder="123"
                              maxLength="4"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardName">Cardholder Name</Label>
                            <Input
                              id="cardName"
                              placeholder="John Doe"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            
            <div className="space-y-6">
               
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                          <div className="flex items-center space-x-3">
                            <div className="text-2xl">{item.image}</div>
                            <div>
                              <h4 className="font-medium text-gray-800">{item.name}</h4>
                              <p className="text-sm text-gray-600">${item.price} each</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="font-medium min-w-[20px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-8 h-8 p-0"
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

               
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${getSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivery Fee</span>
                        <span className="font-medium">
                          {getDeliveryFee() === 0 ? (
                            <span className="text-green-600">FREE</span>
                          ) : (
                            `$${getDeliveryFee().toFixed(2)}`
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tax</span>
                        <span className="font-medium">${getTax().toFixed(2)}</span>
                      </div>
                      <div className="border-t pt-3">
                        <div className="flex justify-between">
                          <span className="text-lg font-bold">Total</span>
                          <span className="text-lg font-bold text-orange-600">
                            ${getTotal().toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {getSubtotal() < 25 && (
                      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center text-blue-800 text-sm">
                          <Truck className="w-4 h-4 mr-2" />
                          <span>Add ${(25 - getSubtotal()).toFixed(2)} more for free delivery!</span>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          onClick={handlePlaceOrder}
                          disabled={isProcessing || !orderDetails.deliveryAddress || !orderDetails.phone}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-6 text-lg"
                        >
                          {isProcessing ? (
                            <div className="flex items-center space-x-2">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                              />
                              <span>Processing Order...</span>
                            </div>
                          ) : (
                            <>
                              <CreditCard className="w-5 h-5 mr-2" />
                              Place Order - ${getTotal().toFixed(2)}
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>

                    <div className="mt-4 flex items-center justify-center space-x-2 text-gray-500 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>Estimated delivery: 25-30 minutes</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckoutPage

