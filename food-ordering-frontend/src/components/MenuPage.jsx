import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Utensils,
  Search,
  Star,
  Plus,
  Minus,
  ShoppingCart,
  User,
  LogOut,
  Filter,
  Heart,
  Clock,
  Flame,
  PlusCircle
} from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";

const MenuPage = ({ user, onLogout }) => {
  const [menuItems, setMenuItems] = useState([])
  const [cart, setCart] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [favorites, setFavorites] = useState(new Set())
  const [isAddMenuItemDialogOpen, setIsAddMenuItemDialogOpen] = useState(false);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    description: '',
    price: '',
    category: 'pizza',
    image: '🍕',
    rating: 0,
    reviews: 0,
    prepTime: '',
    isSpicy: false,
    isVegetarian: false,
    isPopular: false,
  });

  const categories = [
    { id: 'all', name: 'All Items', icon: '🍽️' },
    { id: 'pizza', name: 'Pizza', icon: '🍕' },
    { id: 'burgers', name: 'Burgers', icon: '🍔' },
    { id: 'salads', name: 'Salads', icon: '🥗' },
    { id: 'pasta', name: 'Pasta', icon: '🍝' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'drinks', name: 'Drinks', icon: '🥤' }
  ]

  useEffect(() => {
    // Mock menu data
    setMenuItems([
      {
        id: 1,
        name: 'Margherita Pizza',
        description: 'Fresh tomatoes, mozzarella cheese, basil leaves, and olive oil on a crispy crust',
        price: 16.99,
        category: 'pizza',
        image: '🍕',
        rating: 4.8,
        reviews: 124,
        prepTime: 15,
        isSpicy: false,
        isVegetarian: true,
        isPopular: true
      },
      {
        id: 2,
        name: 'Classic Cheeseburger',
        description: 'Juicy beef patty with cheddar cheese, lettuce, tomato, and our special sauce',
        price: 12.99,
        category: 'burgers',
        image: '🍔',
        rating: 4.6,
        reviews: 89,
        prepTime: 12,
        isSpicy: false,
        isVegetarian: false,
        isPopular: true
      },
      {
        id: 3,
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing',
        price: 8.99,
        category: 'salads',
        image: '🥗',
        rating: 4.7,
        reviews: 67,
        prepTime: 8,
        isSpicy: false,
        isVegetarian: true,
        isPopular: false
      },
      {
        id: 4,
        name: 'Spicy Pasta Arrabbiata',
        description: 'Penne pasta in a spicy tomato sauce with garlic, red peppers, and herbs',
        price: 14.99,
        category: 'pasta',
        image: '🍝',
        rating: 4.5,
        reviews: 92,
        prepTime: 18,
        isSpicy: true,
        isVegetarian: true,
        isPopular: false
      },
      {
        id: 5,
        name: 'Chocolate Lava Cake',
        description: 'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream',
        price: 7.99,
        category: 'desserts',
        image: '🍰',
        rating: 4.9,
        reviews: 156,
        prepTime: 10,
        isSpicy: false,
        isVegetarian: true,
        isPopular: true
      },
      {
        id: 6,
        name: 'Fresh Lemonade',
        description: 'Freshly squeezed lemons with a hint of mint, served ice cold',
        price: 3.99,
        category: 'drinks',
        image: '🥤',
        rating: 4.4,
        reviews: 43,
        prepTime: 3,
        isSpicy: false,
        isVegetarian: true,
        isPopular: false
      },
      {
        id: 7,
        name: 'BBQ Bacon Pizza',
        description: 'BBQ sauce base with bacon, red onions, mozzarella, and cilantro',
        price: 19.99,
        category: 'pizza',
        image: '🍕',
        rating: 4.7,
        reviews: 78,
        prepTime: 16,
        isSpicy: false,
        isVegetarian: false,
        isPopular: true
      },
      {
        id: 8,
        name: 'Veggie Deluxe Burger',
        description: 'Plant-based patty with avocado, sprouts, tomato, and herb mayo',
        price: 13.99,
        category: 'burgers',
        image: '🍔',
        rating: 4.3,
        reviews: 54,
        prepTime: 14,
        isSpicy: false,
        isVegetarian: true,
        isPopular: false
      }
    ])
  }, [])

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id)
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const removeFromCart = (itemId) => {
    setCart(prev => {
      return prev.map(item =>
        item.id === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ).filter(item => item.quantity > 0)
    })
  }

  const toggleFavorite = (itemId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId)
      } else {
        newFavorites.add(itemId)
      }
      return newFavorites
    })
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getItemQuantity = (itemId) => {
    const item = cart.find(cartItem => cartItem.id === itemId)
    return item ? item.quantity : 0
  }

  const handleAddMenuItemChange = (e) => {
    const { id, value, type, checked } = e.target;
    setNewMenuItem(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddMenuItemSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send a POST request to your backend
    console.log("Adding new menu item:", newMenuItem);
    const newId = menuItems.length > 0 ? Math.max(...menuItems.map(item => item.id)) + 1 : 1;
    setMenuItems(prev => [
      ...prev,
      {
        ...newMenuItem,
        id: newId,
        price: parseFloat(newMenuItem.price),
        prepTime: parseInt(newMenuItem.prepTime),
        rating: parseFloat(newMenuItem.rating),
        reviews: parseInt(newMenuItem.reviews),
      }
    ]);
    setNewMenuItem({
      name: '',
      description: '',
      price: '',
      category: 'pizza',
      image: '🍕',
      rating: 0,
      reviews: 0,
      prepTime: '',
      isSpicy: false,
      isVegetarian: false,
      isPopular: false,
    });
    setIsAddMenuItemDialogOpen(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-white/90 backdrop-blur-md border-b border-orange-100 sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to={`/${user.role}-dashboard`} className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Click2Eat Menu
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-700">
              <User className="w-5 h-5" />
              <span className="font-medium">{user.username}</span>
            </div>
            
            {user.role === 'customer' && (
              <div className="relative">
                <Link to="/checkout">
                  <Button variant="outline" className="relative">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart
                    {getTotalItems() > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                        {getTotalItems()}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </div>
            )}
            
            <Button variant="ghost" onClick={onLogout} className="text-gray-600 hover:text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </motion.nav>

      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Our Delicious Menu 🍽️
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our carefully crafted dishes made with the freshest ingredients
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search for dishes..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {user.role === 'admin' && (
              <Dialog open={isAddMenuItemDialogOpen} onOpenChange={setIsAddMenuItemDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-md">
                    <PlusCircle className="w-4 h-4 mr-2" /> Add New Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Menu Item</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddMenuItemSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" value={newMenuItem.name} onChange={handleAddMenuItemChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="description" className="text-right">Description</Label>
                      <Textarea id="description" value={newMenuItem.description} onChange={handleAddMenuItemChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="price" className="text-right">Price</Label>
                      <Input id="price" type="number" step="0.01" value={newMenuItem.price} onChange={handleAddMenuItemChange} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="category" className="text-right">Category</Label>
                      <Select onValueChange={(value) => setNewMenuItem(prev => ({ ...prev, category: value }))} defaultValue={newMenuItem.category}>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.filter(cat => cat.id !== 'all').map(cat => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="image" className="text-right">Image Emoji</Label>
                      <Input id="image" value={newMenuItem.image} onChange={handleAddMenuItemChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="prepTime" className="text-right">Prep Time (min)</Label>
                      <Input id="prepTime" type="number" value={newMenuItem.prepTime} onChange={handleAddMenuItemChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="rating" className="text-right">Rating</Label>
                      <Input id="rating" type="number" step="0.1" min="0" max="5" value={newMenuItem.rating} onChange={handleAddMenuItemChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reviews" className="text-right">Reviews Count</Label>
                      <Input id="reviews" type="number" value={newMenuItem.reviews} onChange={handleAddMenuItemChange} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="isSpicy" className="text-right">Is Spicy</Label>
                      <Checkbox id="isSpicy" checked={newMenuItem.isSpicy} onCheckedChange={(checked) => setNewMenuItem(prev => ({ ...prev, isSpicy: checked }))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="isVegetarian" className="text-right">Is Vegetarian</Label>
                      <Checkbox id="isVegetarian" checked={newMenuItem.isVegetarian} onCheckedChange={(checked) => setNewMenuItem(prev => ({ ...prev, isVegetarian: checked }))} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="isPopular" className="text-right">Is Popular</Label>
                      <Checkbox id="isPopular" checked={newMenuItem.isPopular} onCheckedChange={(checked) => setNewMenuItem(prev => ({ ...prev, isPopular: checked }))} className="col-span-3" />
                    </div>
                    <DialogFooter>
                      <Button type="submit">Add Menu Item</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            )}
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-600">Filter by:</span>
            </div>
          </div>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full border-2 transition-all ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white border-orange-500'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Cart Summary (for customers) */}
        {user.role === 'customer' && cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {getTotalItems()} items in cart
                    </h3>
                    <p className="text-gray-600">Total: ${getTotalPrice().toFixed(2)}</p>
                  </div>
                  <Link to="/checkout">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                      View Cart & Checkout
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Menu Items Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center text-6xl">
                    {item.image}
                  </div>
                  
                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.isPopular && (
                      <Badge className="bg-red-500 text-white">
                        🔥 Popular
                      </Badge>
                    )}
                    {item.isVegetarian && (
                      <Badge className="bg-green-500 text-white">
                        🌱 Veggie
                      </Badge>
                    )}
                    {item.isSpicy && (
                      <Badge className="bg-orange-500 text-white">
                        <Flame className="w-3 h-3 mr-1" />
                        Spicy
                      </Badge>
                    )}
                  </div>

                  {/* Favorite Button */}
                  {user.role === 'customer' && (
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                    >
                      <Heart 
                        className={`w-4 h-4 ${
                          favorites.has(item.id) 
                            ? 'text-red-500 fill-current' 
                            : 'text-gray-400'
                        }`} 
                      />
                    </button>
                  )}
                </div>

                <CardContent className="p-6">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{item.rating}</span>
                      <span className="text-xs text-gray-500">({item.reviews})</span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{item.prepTime}m</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-orange-600">
                      ${item.price}
                    </span>
                    
                    {user.role === 'customer' && (
                      <div className="flex items-center space-x-2">
                        {getItemQuantity(item.id) > 0 ? (
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeFromCart(item.id)}
                              className="w-8 h-8 p-0"
                            >
                              <Minus className="w-4 h-4" />
                            </Button>
                            <span className="font-medium min-w-[20px] text-center">
                              {getItemQuantity(item.id)}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 p-0 bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        ) : (
                          <Button
                            onClick={() => addToCart(item)}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No items found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MenuPage

