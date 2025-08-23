import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Package, Search, Edit, Trash2, PlusCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const StockManagement = () => {
  const [stockItems, setStockItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStockItems();
  }, []);

  const fetchStockItems = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, you would fetch from your Express.js backend
      // const response = await fetch("/api/stock");
      // const data = await response.json();
      // setStockItems(data.data);

      // Mock data for demonstration
      const mockStock = [
        { id: "1", name: "Tomatoes", category: "vegetables", currentQuantity: 15, unit: "kg", minimumQuantity: 10, maximumQuantity: 50, costPerUnit: 1.5, supplier: { name: "Veggie Farm" }, isActive: true },
        { id: "2", name: "Chicken Breast", category: "meat", currentQuantity: 5, unit: "kg", minimumQuantity: 10, maximumQuantity: 30, costPerUnit: 8.0, supplier: { name: "Meat Co." }, isActive: true },
        { id: "3", name: "Flour", category: "grains", currentQuantity: 50, unit: "kg", minimumQuantity: 20, maximumQuantity: 100, costPerUnit: 0.8, supplier: { name: "Grain Mill" }, isActive: true },
        { id: "4", name: "Olive Oil", category: "other", currentQuantity: 8, unit: "l", minimumQuantity: 5, maximumQuantity: 20, costPerUnit: 12.0, supplier: { name: "Oil & Co." }, isActive: true },
        { id: "5", name: "Lettuce", category: "vegetables", currentQuantity: 7, unit: "pieces", minimumQuantity: 10, maximumQuantity: 40, costPerUnit: 0.5, supplier: { name: "Veggie Farm" }, isActive: true },
      ];
      setStockItems(mockStock);
    } catch (err) {
      setError("Failed to fetch stock data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = stockItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item) => {
    if (item.currentQuantity === 0) {
      return { text: "Out of Stock", color: "text-red-800", bg: "bg-red-100", icon: <Trash2 className="w-4 h-4" /> };
    } else if (item.currentQuantity <= item.minimumQuantity) {
      return { text: "Low Stock", color: "text-orange-800", bg: "bg-orange-100", icon: <AlertTriangle className="w-4 h-4" /> };
    } else if (item.currentQuantity >= item.maximumQuantity) {
      return { text: "Overstocked", color: "text-purple-800", bg: "bg-purple-100", icon: <Package className="w-4 h-4" /> };
    } else {
      return { text: "In Stock", color: "text-green-800", bg: "bg-green-100", icon: <CheckCircle className="w-4 h-4" /> };
    }
  };

  const handleDeleteStock = (id) => {
    // In a real application, you would send a DELETE request to your backend
    console.log(`Deleting stock item ${id}`);
    setStockItems(stockItems.filter(item => item.id !== id));
  };

  if (loading) return <div className="text-center py-8">Loading stock data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-orange-800 flex items-center">
            <Package className="w-6 h-6 mr-2" /> Stock Management
          </CardTitle>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white shadow-md">
            <PlusCircle className="w-4 h-4 mr-2" /> Add New Item
          </Button>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Manage your restaurant inventory and track stock levels.</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search stock by name or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Current Qty</TableHead>
                  <TableHead>Min Qty</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStock.length > 0 ? (
                  filteredStock.map((item) => {
                    const status = getStockStatus(item);
                    return (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.currentQuantity} {item.unit}</TableCell>
                        <TableCell>{item.minimumQuantity} {item.unit}</TableCell>
                        <TableCell>{item.supplier.name}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.color} flex items-center justify-center`}>
                            {status.icon} <span className="ml-1">{status.text}</span>
                          </span>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteStock(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan="7" className="text-center py-4 text-gray-500">
                      No stock items found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StockManagement;



