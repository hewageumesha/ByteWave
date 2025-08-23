import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Utensils, 
  ArrowLeft, 
  Search, 
  Star, 
  Clock,
  CheckCircle,
  Package,
  XCircle,
  Eye,
  RotateCcw,
  User,
  LogOut,
  Calendar,
  DollarSign,
  TrendingUp
} from 'lucide-react'

const OrderHistory = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    // Mock order history data
    setOrders([
      {
        id: 1,
        date: '2024-01-22',
        time: '14:30',
        items: [
          { name: 'Margherita Pizza', quantity: 2, price: 16.99 },
          { name: 'Caesar Salad', quantity: 1, price: 8.99 }
        ],
        total: 42.97,
        status: 'delivered',
        rating: 5,
        deliveryAddress: '123 Main St, City, State 12345',
        estimatedTime: 25,
        actualTime: 28,
        paymentMethod: 'Credit Card'
      },
      {
        id: 2,
        date: '2024-01-20',
        time: '19:15',
        items: [
          { name: 'Chicken Burger', quantity: 1, price: 12.99 },
          { name: 'French Fries', quantity: 1, price: 4.99 },
          { name: 'Coke', quantity: 1, price: 2.99 }
        ],
        total: 20.97,
        status: 'delivered',
        rating: 4,
        deliveryAddress: '123 Main St, City, State 12345',
        estimatedTime: 20,
        actualTime: 18,
        paymentMethod: 'Cash on Delivery'
      },
      {
        id: 3,
        date: '2024-01-18',
        time: '12:45',
        items: [
          { name: 'Pasta Carbonara', quantity: 1, price: 14.99 },
          { name: 'Garlic Bread', quantity: 1, price: 5.99 }
        ],
        total: 20.98,
        status: 'cancelled',
        rating: null,
        deliveryAddress: '123 Main St, City, State 12345',
        estimatedTime: 30,
        actualTime: null,
        paymentMethod: 'Credit Card',
        cancelReason: 'Customer requested cancellation'
      },
      {
        id: 4,
        date: '2024-01-15',
        time: '18:20',
        items: [
          { name: 'BBQ Bacon Pizza', quantity: 1, price: 19.99 },
          { name: 'Chocolate Lava Cake', quantity: 1, price: 7.99 }
        ],
        total: 27.98,
        status: 'delivered',
        rating: 5,
        deliveryAddress: '123 Main St, City, State 12345',
        estimatedTime: 35,
        actualTime: 32,
        paymentMethod: 'Credit Card'
      }
    ])
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'preparing': return <Clock className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      case 'pending': return <Package className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.items.some(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || order.id.toString().includes(searchTerm)
    
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  const reorderItems = (order) => {
    // In a real app, this would add items to cart and redirect to menu
    alert(`Added ${order.items.length} items to cart!`)
  }

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getTotalSpent = () => {
    return orders
      .filter(order => order.status === 'delivered')
      .reduce((total, order) => total + order.total, 0)
  }

  const getOrderCount = () => {
    return orders.filter(order => order.status === 'delivered').length
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/customer-dashboard" className="flex items-center space-x-2">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 hover:text-orange-600">Back to Dashboard</span>
          </Link>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Order History
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Order History 📋
          </h1>
          <p className="text-gray-600">
            Track your past orders and reorder your favorites
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Total Spent</p>
                    <p className="text-3xl font-bold">${getTotalSpent().toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Total Orders</p>
                    <p className="text-3xl font-bold">{getOrderCount()}</p>
                  </div>
                  <Package className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Avg Rating Given</p>
                    <p className="text-3xl font-bold">4.7</p>
                  </div>
                  <Star className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search orders..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex space-x-2">
              {['all', 'delivered', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? "default" : "outline"}
                  onClick={() => setFilterStatus(status)}
                  className={filterStatus === status ? 
                    "bg-orange-500 hover:bg-orange-600 text-white" : 
                    "border-orange-300 text-orange-600 hover:bg-orange-50"
                  }
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No orders found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search criteria' : 'Start ordering to see your history here'}
              </p>
              <Link to="/menu">
                <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                  Browse Menu
                </Button>
              </Link>
            </motion.div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          Order #{order.id}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{order.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{order.time}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </Badge>
                        <p className="text-lg font-bold text-orange-600 mt-2">
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-medium">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {order.status === 'delivered' && order.rating && (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Your Rating:</span>
                          <div className="flex items-center space-x-1">
                            {renderStars(order.rating)}
                          </div>
                        </div>
                      </div>
                    )}

                    {order.status === 'cancelled' && order.cancelReason && (
                      <div className="mb-4 p-3 bg-red-50 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-800">
                          <XCircle className="w-4 h-4" />
                          <span className="text-sm">{order.cancelReason}</span>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-600">
                        <p>Payment: {order.paymentMethod}</p>
                        {order.actualTime && (
                          <p>Delivered in: {order.actualTime} minutes</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-3">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            {selectedOrder === order.id ? 'Hide' : 'View'} Details
                          </Button>
                        </motion.div>
                        
                        {order.status === 'delivered' && (
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Button
                              onClick={() => reorderItems(order)}
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                              size="sm"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Reorder
                            </Button>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedOrder === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-100"
                      >
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Delivery Address:</h5>
                            <p className="text-gray-600">{order.deliveryAddress}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-gray-700 mb-2">Timing:</h5>
                            <p className="text-gray-600">
                              Estimated: {order.estimatedTime} minutes
                            </p>
                            {order.actualTime && (
                              <p className="text-gray-600">
                                Actual: {order.actualTime} minutes
                              </p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default OrderHistory

