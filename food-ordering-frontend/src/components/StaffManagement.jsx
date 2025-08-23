import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Users, UserPlus, Search, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./ui/dialog";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Add Staff dialog
  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'staff',
    isActive: true,
  });

  // Edit Staff dialog
  const [isEditStaffDialogOpen, setIsEditStaffDialogOpen] = useState(false);
  const [editStaff, setEditStaff] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock data for demo
      const mockStaff = [
        { id: "1", username: "john.doe", email: "john.doe@example.com", role: "staff", isActive: true, firstName: "John", lastName: "Doe" },
        { id: "2", username: "jane.smith", email: "jane.smith@example.com", role: "staff", isActive: false, firstName: "Jane", lastName: "Smith" },
        { id: "3", username: "peter.jones", email: "peter.jones@example.com", role: "staff", isActive: true, firstName: "Peter", lastName: "Jones" },
      ];
      setStaff(mockStaff);
    } catch (err) {
      setError("Failed to fetch staff data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStaff = staff.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id) => {
    setStaff(staff.map(member => 
      member.id === id ? { ...member, isActive: !member.isActive } : member
    ));
  };

  const handleDeleteStaff = (id) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  const handleAddStaffChange = (e) => {
    const { id, value } = e.target;
    setNewStaff(prev => ({ ...prev, [id]: value }));
  };

  const handleAddStaffSubmit = (e) => {
  e.preventDefault();
  const newEntry = {
    ...newStaff,
    id: crypto.randomUUID(), // ✅ ensures unique id every time
  };

  setStaff(prev => [...prev, newEntry]);

  setNewStaff({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: 'staff',
    isActive: true,
  });

  setIsAddStaffDialogOpen(false);
};

  // -------- EDIT HANDLERS --------
  const handleEditClick = (member) => {
    setEditStaff(member);
    setIsEditStaffDialogOpen(true);
  };

  const handleEditChange = (e) => {
    const { id, value } = e.target;
    setEditStaff(prev => ({ ...prev, [id]: value }));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setStaff(prev => prev.map(member => 
      member.id === editStaff.id ? editStaff : member
    ));
    setIsEditStaffDialogOpen(false);
    setEditStaff(null);
  };

  if (loading) return <div className="text-center py-8">Loading staff data...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* --- Add Staff Card --- */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-100 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-indigo-800 flex items-center">
            <Users className="w-6 h-6 mr-2" /> Staff Management
          </CardTitle>
          <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                <UserPlus className="w-4 h-4 mr-2" /> Add New Staff
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStaffSubmit} className="grid gap-4 py-4">
                {/* Inputs same as before */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="firstName" className="text-right">First Name</Label>
                  <Input id="firstName" value={newStaff.firstName} onChange={handleAddStaffChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="lastName" className="text-right">Last Name</Label>
                  <Input id="lastName" value={newStaff.lastName} onChange={handleAddStaffChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="username" className="text-right">Username</Label>
                  <Input id="username" value={newStaff.username} onChange={handleAddStaffChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" type="email" value={newStaff.email} onChange={handleAddStaffChange} className="col-span-3" required />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">Password</Label>
                  <Input id="password" type="password" value={newStaff.password} onChange={handleAddStaffChange} className="col-span-3" required />
                </div>
                <DialogFooter>
                  <Button type="submit">Add Staff</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Manage your restaurant staff accounts and their access.</p>
        </CardContent>
      </Card>

      {/* --- Staff Table --- */}
      <Card className="shadow-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-gray-500" />
            <Input
              placeholder="Search staff by name or email..."
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
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.length > 0 ? (
                  filteredStaff.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{member.username}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>{member.role}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEditClick(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className={member.isActive ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                          onClick={() => handleToggleStatus(member.id)}
                        >
                          {member.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-gray-600 hover:bg-gray-50" 
                          onClick={() => handleDeleteStaff(member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan="5" className="text-center py-4 text-gray-500">
                      No staff members found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* --- Edit Staff Dialog --- */}
      <Dialog open={isEditStaffDialogOpen} onOpenChange={setIsEditStaffDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Staff Member</DialogTitle>
          </DialogHeader>
          {editStaff && (
            <form onSubmit={handleEditSubmit} className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="firstName" className="text-right">First Name</Label>
                <Input id="firstName" value={editStaff.firstName} onChange={handleEditChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastName" className="text-right">Last Name</Label>
                <Input id="lastName" value={editStaff.lastName} onChange={handleEditChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">Username</Label>
                <Input id="username" value={editStaff.username} onChange={handleEditChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">Email</Label>
                <Input id="email" type="email" value={editStaff.email} onChange={handleEditChange} className="col-span-3" required />
              </div>
              <DialogFooter>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default StaffManagement;
