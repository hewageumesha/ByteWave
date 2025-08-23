import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Utensils, 
  Clock, 
  CheckCircle, 
  XCircle,
  User,
  LogOut,
  Package,
  AlertCircle,
  TrendingUp,
  Users,
  Timer,
  DollarSign
} from 'lucide-react'

const StaffDashboard = ({ user, onLogout }) => {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    pendingOrders: 0,
    completedToday: 0,
    totalRevenue: 0,
    avgPrepTime: 0
  })

  useEffect(() => {
    
    setOrders([
      {
        id: 1,
        customer: 'John Doe',
        items: ['Margherita Pizza', 'Caesar Salad'],
        total: 24.99,
        status: 'pending',
        orderTime: '2024-01-22 14:30',
        estimatedTime: 25
      },
      {
        id: 2,
        customer: 'Jane Smith',
        items: ['Chicken Burger', 'French Fries', 'Coke'],
        total: 18.50,
        status: 'preparing',
        orderTime: '2024-01-22 14:45',
        estimatedTime: 15
      },
      {
        id: 3,
        customer: 'Mike Johnson',
        items: ['Pasta Carbonara'],
        total: 16.99,
        status: 'ready',
        orderTime: '2024-01-22 15:00',
        estimatedTime: 0
      }
    ])

    setStats({
      pendingOrders: 8,
      completedToday: 24,
      totalRevenue: 1250.75,
      avgPrepTime: 18
    })
  }, [])

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'preparing': return 'bg-blue-100 text-blue-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'preparing': return <Timer className="w-4 h-4" />
      case 'ready': return <CheckCircle className="w-4 h-4" />
      case 'delivered': return <Package className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  return (
    <div className="min-h-screen">
       
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              FoodieHub Staff
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium">{user.username}</span>
              <Badge className="bg-blue-100 text-blue-800">Staff</Badge>
            </div>
            
            <Button variant="ghost" onClick={onLogout} className="text-gray-600 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
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
            Staff Dashboard 👨‍🍳
          </h1>
          <p className="text-gray-600 text-lg">
            Manage orders and keep the kitchen running smoothly
          </p>
        </motion.div>

        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-100">Pending Orders</p>
                    <p className="text-3xl font-bold">{stats.pendingOrders}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100">Completed Today</p>
                    <p className="text-3xl font-bold">{stats.completedToday}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100">Revenue Today</p>
                    <p className="text-3xl font-bold">${stats.totalRevenue}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100">Avg Prep Time</p>
                    <p className="text-3xl font-bold">{stats.avgPrepTime}m</p>
                  </div>
                  <Timer className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

         
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-600" />
                Active Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          Order #{order.id}
                        </h3>
                        <p className="text-gray-600">Customer: {order.customer}</p>
                        <p className="text-sm text-gray-500">
                          Ordered at: {order.orderTime}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(order.status)}
                            <span className="capitalize">{order.status}</span>
                          </span>
                        </Badge>
                        <p className="text-lg font-bold text-blue-600 mt-2">
                          ${order.total}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Items:</h4>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-sm">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {order.estimatedTime > 0 && (
                      <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
                        <div className="flex items-center text-yellow-800">
                          <Timer className="w-4 h-4 mr-2" />
                          <span className="text-sm">
                            Estimated time remaining: {order.estimatedTime} minutes
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-3">
                      {order.status === 'pending' && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'preparing')}
                            className="bg-blue-500 hover:bg-blue-600 text-white"
                          >
                            <Timer className="w-4 h-4 mr-2" />
                            Start Preparing
                          </Button>
                        </motion.div>
                      )}
                      
                      {order.status === 'preparing' && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'ready')}
                            className="bg-green-500 hover:bg-green-600 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark Ready
                          </Button>
                        </motion.div>
                      )}
                      
                      {order.status === 'ready' && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="bg-gray-500 hover:bg-gray-600 text-white"
                          >
                            <Package className="w-4 h-4 mr-2" />
                            Mark Delivered
                          </Button>
                        </motion.div>
                      )}
                      
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="outline"
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

         
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="w-full h-20 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white flex-col">
                    <Package className="w-6 h-6 mb-2" />
                    View Stock
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="w-full h-20 flex-col border-2 border-green-300 text-green-600 hover:bg-green-50">
                    <CheckCircle className="w-6 h-6 mb-2" />
                    Completed Orders
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="w-full h-20 flex-col border-2 border-yellow-300 text-yellow-600 hover:bg-yellow-50">
                    <Clock className="w-6 h-6 mb-2" />
                    Order Queue
                  </Button>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="w-full h-20 flex-col border-2 border-purple-300 text-purple-600 hover:bg-purple-50">
                    <Users className="w-6 h-6 mb-2" />
                    Staff Schedule
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default StaffDashboard

