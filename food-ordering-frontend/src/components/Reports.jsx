import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { BarChart, LineChart, PieChart, Bar, Line, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { FileText, TrendingUp, DollarSign, Utensils, Users, Calendar as CalendarIcon } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Reports = () => {
  const [reportType, setReportType] = useState('daily_sales');
  const [date, setDate] = useState(new Date());
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReportData();
  }, [reportType, date]);

  const fetchReportData = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real application, you would fetch from your Express.js backend
      // const response = await fetch(`/api/reports/${reportType}?date=${format(date, 'yyyy-MM-dd')}`);
      // const data = await response.json();
      // setReportData(data.data);

      // Mock data for demonstration
      let mockData = {};
      switch (reportType) {
        case 'daily_sales':
          mockData = {
            totalRevenue: 1250.75,
            totalOrders: 55,
            averageOrderValue: 22.74,
            salesByMenuItem: [
              { name: 'Margherita Pizza', sales: 250, count: 10 },
              { name: 'Cheeseburger', sales: 180, count: 8 },
              { name: 'Caesar Salad', sales: 120, count: 6 },
              { name: 'Coca-Cola', sales: 80, count: 20 },
              { name: 'French Fries', sales: 70, count: 15 },
            ],
            salesByPaymentMethod: [
              { name: 'Card', value: 800 },
              { name: 'Cash', value: 300 },
              { name: 'Digital Wallet', value: 150 },
            ],
          };
          break;
        case 'monthly_revenue':
          mockData = [
            { month: 'Jan', revenue: 12000 },
            { month: 'Feb', revenue: 15000 },
            { month: 'Mar', revenue: 13500 },
            { month: 'Apr', revenue: 17000 },
            { month: 'May', revenue: 16000 },
            { month: 'Jun', revenue: 19000 },
            { month: 'Jul', revenue: 18500 },
            { month: 'Aug', revenue: 21000 },
            { month: 'Sep', revenue: 20000 },
            { month: 'Oct', revenue: 22000 },
            { month: 'Nov', revenue: 23000 },
            { month: 'Dec', revenue: 25000 },
          ];
          break;
        case 'customer_demographics':
          mockData = {
            totalCustomers: 1500,
            newCustomersThisMonth: 120,
            customersByAgeGroup: [
              { name: '18-24', value: 300 },
              { name: '25-34', value: 600 },
              { name: '35-44', value: 400 },
              { name: '45-54', value: 150 },
              { name: '55+', value: 50 },
            ],
            customersByOrderFrequency: [
              { name: 'Daily', value: 50 },
              { name: 'Weekly', value: 200 },
              { name: 'Monthly', value: 500 },
              { name: 'Rarely', value: 750 },
            ],
          };
          break;
        default:
          mockData = null;
      }
      setReportData(mockData);
    } catch (err) {
      setError("Failed to fetch report data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-green-50 to-teal-100 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold text-teal-800 flex items-center">
            <FileText className="w-6 h-6 mr-2" /> Business Reports
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily_sales">Daily Sales Report</SelectItem>
                <SelectItem value="monthly_revenue">Monthly Revenue Trend</SelectItem>
                <SelectItem value="customer_demographics">Customer Demographics</SelectItem>
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[200px] justify-start text-left font-normal ${!date && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Generate and view various business reports to gain insights.</p>
        </CardContent>
      </Card>

      {loading && <div className="text-center py-8">Loading report data...</div>}
      {error && <div className="text-center py-8 text-red-500">Error: {error}</div>}

      {reportData && reportType === 'daily_sales' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${reportData.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <Utensils className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reportData.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+15% from last month</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${reportData.averageOrderValue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+5.1% from last month</p>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>Sales by Menu Item</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.salesByMenuItem} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                  <Bar dataKey="count" fill="#82ca9d" name="Quantity" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Sales by Payment Method</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.salesByPaymentMethod}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportData.salesByPaymentMethod.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {reportData && reportType === 'monthly_revenue' && (
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#8884d8" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {reportData && reportType === 'customer_demographics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Customer Age Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData.customersByAgeGroup}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {reportData.customersByAgeGroup.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Customer Order Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={reportData.customersByOrderFrequency} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#82ca9d" name="Customers" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default Reports;



