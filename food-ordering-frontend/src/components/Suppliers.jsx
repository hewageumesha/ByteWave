import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Truck, Search, Edit, Trash2, PlusCircle, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    name: '',
    contactPersonName: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    categories: '', // Comma separated string
    isPreferred: false,
    rating: 0,
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, you would fetch from your Express.js backend
      // const response = await fetch("/api/suppliers");
      // const data = await response.json();
      // setSuppliers(data.data);

      // Mock data for demonstration
      const mockSuppliers = [
        { id: "1", name: "Veggie Farm", contactPerson: { name: "Alice Green", email: "alice@veggiefarm.com", phone: "111-222-3333" }, categories: ["vegetables", "fruits"], isPreferred: true, isActive: true, rating: 4.5 },
        { id: "2", name: "Meat Co.", contactPerson: { name: "Bob Butcher", email: "bob@meatco.com", phone: "444-555-6666" }, categories: ["meat", "poultry"], isPreferred: false, isActive: true, rating: 4.0 },
        { id: "3", name: "Grain Mill", contactPerson: { name: "Charlie Baker", email: "charlie@grainmill.com", phone: "777-888-9999" }, categories: ["grains", "flour"], isPreferred: true, isActive: true, rating: 4.8 },
        { id: "4", name: "Dairy Delights", contactPerson: { name: "Diana Milk", email: "diana@dairydelights.com", phone: "000-111-2222" }, categories: ["dairy"], isPreferred: false, isActive: true, rating: 3.9 },
      ];
      setSuppliers(mockSuppliers);
    } catch (err) {
      setError("Failed to fetch supplier data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contactPerson.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteSupplier = (id) => {
    // In a real application, you would send a DELETE request to your backend
    console.log(`Deleting supplier ${id}`);
    setSuppliers(suppliers.filter(supplier => supplier.id !== id));
  };

  const handleAddSupplierChange = (e) => {
    const { id, value, type, checked } = e.target;
    setNewSupplier(prev => ({
      ...prev,
      [id]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddSupplierSubmit = (e) => {
    e.preventDefault();
    // In a real application, you would send a POST request to your backend
    console.log("Adding new supplier:", newSupplier);
    const newId = String(suppliers.length + 1);
    setSuppliers(prev => [
      ...prev,
      {
        id: newId,
        name: newSupplier.name,
        contactPerson: {
          name: newSupplier.contactPersonName,
          email: newSupplier.contactPersonEmail,
          phone: newSupplier.contactPersonPhone,
        },
        categories: newSupplier.categories.split(',').map(cat => cat.trim()),
        isPreferred: newSupplier.isPreferred,
        rating: newSupplier.rating,
        isActive: true, // New suppliers are active by default
      }
    ]);
    setNewSupplier({
      name: '',
      contactPersonName: '',
      contactPersonEmail: '',
      contactPersonPhone: '',
      categories: '',
      isPreferred: false,
      rating: 0,
    });
    setIsAddSupplierDialogOpen(false);
  };

  if (loading) return <div className="text-center py-8">Loading supplier data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-purple-50 to-pink-100 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-pink-800 flex items-center">
            <Truck className="w-6 h-6 mr-2" /> Suppliers
          </CardTitle>
          <Dialog open={isAddSupplierDialogOpen} onOpenChange={setIsAddSupplierDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pink-600 hover:bg-pink-700 text-white shadow-md">
                <PlusCircle className="w-4 h-4 mr-2" /> Add New Supplier
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddSupplierSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Supplier Name</Label>
                  <Input id="name" value={newSupplier.name} onChange={handleAddSupplierChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactPersonName" className="text-right">Contact Name</Label>
                  <Input id="contactPersonName" value={newSupplier.contactPersonName} onChange={handleAddSupplierChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactPersonEmail" className="text-right">Contact Email</Label>
                  <Input id="contactPersonEmail" type="email" value={newSupplier.contactPersonEmail} onChange={handleAddSupplierChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="contactPersonPhone" className="text-right">Contact Phone</Label>
                  <Input id="contactPersonPhone" value={newSupplier.contactPersonPhone} onChange={handleAddSupplierChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="categories" className="text-right">Categories (comma-separated)</Label>
                  <Textarea id="categories" value={newSupplier.categories} onChange={handleAddSupplierChange} className="col-span-3" placeholder="e.g., vegetables, fruits, dairy" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="isPreferred" className="text-right">Preferred Supplier</Label>
                  <input type="checkbox" id="isPreferred" checked={newSupplier.isPreferred} onChange={handleAddSupplierChange} className="col-span-3 w-4 h-4" />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Supplier</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Manage your restaurant's food and ingredient suppliers.</p>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search suppliers by name or category..."
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
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Preferred</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson.name} ({supplier.contactPerson.email})</TableCell>
                      <TableCell>{supplier.categories.join(', ')}</TableCell>
                      <TableCell className="flex items-center">
                        {supplier.rating} <Star className="w-4 h-4 ml-1 text-yellow-500 fill-yellow-500" />
                      </TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${supplier.isPreferred ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {supplier.isPreferred ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteSupplier(supplier.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="6" className="text-center py-4 text-gray-500">
                      No suppliers found.
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

export default Suppliers;



