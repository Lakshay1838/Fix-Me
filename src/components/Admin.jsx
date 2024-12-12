import React, { useContext, useState } from "react";
import { Users, FileText, Globe, DollarSign } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, Line, Legend, CartesianGrid, ComposedChart, Area, ScatterChart, Scatter, } from "recharts";
import image from "../assets/image.webp";
import { AuthContext } from "../context/AuthContext";
import { useEffect } from "react";
import graph from "../assets/lastGraph.jpg"


const MetricBox = ({ icon: Icon, label, value, color }) => (
  <div className={`${color} p-6 rounded-lg text-white`}>
    <div className="flex items-center mb-2">
      <Icon className="w-6 h-6 mr-2" />
      <span className="uppercase text-sm">{label}</span>
    </div>
    <div className="text-4xl font-light">{value}</div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div className={`${color} p-6 rounded-lg text-white relative`}>
    <div className="flex items-center mb-2">
      <Icon className="w-6 h-6 mr-2" />
      <span className="uppercase text-sm">{label}</span>
    </div>
    <div className="text-4xl font-light">{value}</div>
    {trend && (
      <div className="absolute top-2 right-2 flex items-center text-sm">
        <TrendingUp
          className={`w-4 h-4 mr-1 ${trend.includes("+") ? "text-green-300" : "text-red-300"
            }`}
        />
        <span>{trend}</span>
      </div>
    )}
  </div>
);

const AdminDashboard = () => {
  const { name } = useContext(AuthContext);
  const adminInfo = {
    name: name,
    role: "Administrator",
  };
  const [vendors, setVendors] = useState([]);
  const [users, setUsers] = useState([]);
  const [payments, setPayment] = useState([]);
  const [complains, setComplains] = useState([]);

  const metrics = {
    totalVendors: 4,
    totalUsers: 8,
    totalDomains: 4,
    Complains: 4,
    Payments: 4,
  };
  const COLORS = ['#FF5733', '#33FF57', '#3357FF', '#F1C40F', '#8E44AD', '#2ECC71'];


  const pieDataUsersVendors = [
    { name: "Users", value: metrics.totalUsers },
    { name: "Vendors", value: metrics.totalVendors },
  ];

  const pieDataComplaints = [
    { name: "Pending Complaints", value: 1 },
    { name: "Resolved Complaints", value: 3 },
    { name: "Open Complaints", value: 2 },
  ];


  const barData = [
    {
      name: "Jan",
      Vendors: vendors.filter((vendor) => new Date(vendor.createdAt).getMonth() === 0).length,
      Users: users.filter((user) => new Date(user.createdAt).getMonth() === 0).length,
      Payments: payments.filter((payment) => new Date(payment.createdAt).getMonth() === 0).length,
    },
    {
      name: "Feb",
      Vendors: vendors.filter((vendor) => new Date(vendor.createdAt).getMonth() === 1).length,
      Users: users.filter((user) => new Date(user.createdAt).getMonth() === 1).length,
      Payments: payments.filter((payment) => new Date(payment.createdAt).getMonth() === 1).length,
    },
    {
      name: "Mar",
      Vendors: vendors.filter((vendor) => new Date(vendor.createdAt).getMonth() === 2).length,
      Users: users.filter((user) => new Date(user.createdAt).getMonth() === 2).length,
      Payments: payments.filter((payment) => new Date(payment.createdAt).getMonth() === 2).length,
    },
    {
      name: "Apr",
      Vendors: vendors.filter((vendor) => new Date(vendor.createdAt).getMonth() === 3).length,
      Users: users.filter((user) => new Date(user.createdAt).getMonth() === 3).length,
      Payments: payments.filter((payment) => new Date(payment.createdAt).getMonth() === 3).length,
    },
    {
      name: "May",
      Vendors: vendors.filter((vendor) => new Date(vendor.createdAt).getMonth() === 4).length,
      Users: users.filter((user) => new Date(user.createdAt).getMonth() === 4).length,
      Payments: payments.filter((payment) => new Date(payment.createdAt).getMonth() === 4).length,
    },
    {
      name: "Jun",
      Vendors: vendors.filter((vendor) => new Date(vendor.createdAt).getMonth() === 5).length,
      Users: users.filter((user) => new Date(user.createdAt).getMonth() === 5).length,
      Payments: payments.filter((payment) => new Date(payment.createdAt).getMonth() === 5).length,
    },
    {
      name: "Jul",
      Vendors: 2,
      Users: 2,
      Payments: 0,
    },
    {
      name: "Aug",
      Vendors: vendors.filter((vendor) => new Date(vendor.createdAt).getMonth() === 7).length,
      Users: 1,
      Payments: 1,
    },
    {
      name: "Sep",
      Vendors: 1,
      Users: 3,
      Payments: 0,
    },
    {
      name: "Oct",
      Vendors: 1,
      Users: 1,
      Payments: 1,
    },
    {
      name: "Nov",
      Vendors: vendors.filter((vendor) => new Date(vendor.createdAt).getMonth() === 10).length,
      Users: 1,
      Payments: payments.filter((payment) => new Date(payment.createdAt).getMonth() === 10).length,
    },
    {
      name: "Dec",
      Vendors: vendors.filter((vendor) => new Date(vendor.createdAt).getMonth() === 11).length,
      Users: users.filter((user) => new Date(user.createdAt).getMonth() === 11).length,
      Payments: payments.filter((payment) => new Date(payment.createdAt).getMonth() === 11).length,
    },
  ];


  useEffect(() => {
    fetch("http://localhost:5000/api/auth/vendors")
      .then((response) => response.json())
      .then((vendor) => {
        setVendors(vendor);
      });

    fetch("http://localhost:5000/api/bill/all")
      .then((response) => response.json())
      .then((payment) => {
        setPayment(payment);
      });

    fetch("http://localhost:5000/api/auth/customers")
      .then((response) => response.json())
      .then((user) => {
        setUsers(user);
      });

    fetch("http://localhost:5000/api/complain/all")
      .then((response) => response.json())
      .then((complain) => {
        setComplains(complain);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 min-h-screen bg-gray-800 text-white p-6">
          <div className="text-center mb-8">
            <img
              src={image}
              alt="Admin"
              className="rounded-full w-32 h-32 mx-auto mb-4"
            />
            <h2 className="text-xl font-semibold">{adminInfo.name}</h2>
            <p className="text-gray-400">{adminInfo.role}</p>
          </div>

          <nav className="space-y-4">
            {["Overview"].map((item) => (
              <a
                key={item}
                href="#"
                className={`block py-2 px-4 rounded ${item === "Overview" ? "bg-gray-700" : "hover:bg-gray-700"
                  }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 h-screen overflow-y-auto">
          <div className="grid gap-6 mb-8">
            {/* Metric Boxes */}
            <div className="grid grid-cols-2 gap-4">
              <MetricBox
                icon={Users}
                label="Vendors"
                value={metrics.totalUsers}
                color="bg-green-500"
              />
              <MetricBox
                icon={FileText}
                label="Complaints"
                value={metrics.Complains}
                color="bg-red-500"
              />
              <MetricBox
                icon={Globe}
                label="Service Types"
                value={metrics.totalDomains}
                color="bg-blue-500"
              />
              <MetricBox
                icon={DollarSign}
                label="Payments"
                value={metrics.Payments}
                color="bg-yellow-500"
              />
            </div>

            {/* Chart for Users and Vendors */}
            <div className="bg-white rounded-lg shadow p-6 flex space-x-8">
              <div className="flex-1">
                <h2 className="text-xl mb-4 text-gray-700">User & Vendor Distribution</h2>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieDataUsersVendors}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieDataUsersVendors.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Chart for Complaints */}
              <div className="flex-1">
                <h2 className="text-xl mb-4 text-gray-700">Complaint Distribution</h2>
                <div className="h-64">
                  <ResponsiveContainer width="110%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieDataComplaints}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {pieDataComplaints.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            {/* Updated Grouped Bar Chart */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl mb-4 text-gray-700">
                Monthly Platform Activity
              </h2>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" label={{ value: 'Months', position: 'insideBottom'}} />
                  <YAxis label={{ value: 'Number of Users/Vendors/Payments', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Vendors" fill="#8884d8"/>
                  <Bar dataKey="Users" fill="#82ca9d" />
                  <Bar dataKey="Payments" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Composed Chart - Complex Visualization */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl mb-4 text-gray-700">
                Growth Per Month
              </h2>
              {/* <img>{graph}</img> */}
              <img src={graph} alt="" />
              <div>
                <img src="" alt="" />
              </div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h2 className="text-xl mb-4 text-gray-700">Employee Records</h2>
              <div className="overflow-x-auto overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["No", "Name", "Email", "Category", "Experience"].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        id: 1,
                        name: "Tom",
                        email: "tom@gmail.com",
                        fieldsOfExpertise: "Painter",
                        yearsOfExperience: "5 years",
                      },
                      {
                        id: 2,
                        name: "Ravi",
                        email: "ravi@gmail.com",
                        fieldsOfExpertise: "Plumber",
                        yearsOfExperience: "3 years",
                      },
                      {
                        id: 3,
                        name: "Lakshay",
                        email: "lakshay@gmail.com",
                        fieldsOfExpertise: "Carpenter",
                        yearsOfExperience: "4 years",
                      },
                      {
                        id: 4,
                        name: "Aditya",
                        email: "aditya@gmail.com",
                        fieldsOfExpertise: "Electrician",
                        yearsOfExperience: "6 years",
                      },
                    ].map((vendor, index) => (
                      <tr key={vendor.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {vendor.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {vendor.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {vendor.fieldsOfExpertise}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {vendor.yearsOfExperience}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Payment Table */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h2 className="text-xl mb-4 text-gray-700">Payments</h2>
              <div className="overflow-x-auto overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "No",
                        "Customer Name",
                        "Vendor Name",
                        "Type",
                        "Status",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        id: 1,
                        customerName: "Kush",
                        vendorName: "Aditya",
                        type: "Credit",
                        status: "Completed",
                      },
                      {
                        id: 2,
                        customerName: "Kushal",
                        vendorName: "Tom",
                        type: "Debit",
                        status: "Pending",
                      },
                      {
                        id: 3,
                        customerName: "Ananya",
                        vendorName: "Ravi",
                        type: "Online",
                        status: "Failed",
                      },
                      {
                        id: 4,
                        customerName: "Gaurav",
                        vendorName: "Lakshay",
                        type: "Online",
                        status: "Completed",
                      },
                    ].map((payment, index) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 text-sm text-gray-500">{index + 1}</td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {payment.customerName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {payment.vendorName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {payment.type}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {payment.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Complaint Table */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h2 className="text-xl mb-4 text-gray-700">Complaints</h2>
              <div className="overflow-x-auto overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {[
                        "No",
                        "Customer Name",
                        "Vendor Name",
                        "Type",
                        "Status",
                      ].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        id: 1,
                        name: "Kush",
                        vendorName: "Aditya",
                        fieldType: "Service",
                        status: "Resolved",
                      },
                      {
                        id: 2,
                        name: "Kushal",
                        vendorName: "Tom",
                        fieldType: "Product",
                        status: "Open",
                      },
                      {
                        id: 3,
                        name: "Ananya",
                        vendorName: "Ravi",
                        fieldType: "Billing",
                        status: "Pending",
                      },
                      {
                        id: 4,
                        name: "Gaurav",
                        vendorName: "Lakshay",
                        fieldType: "Service",
                        status: "Resolved",
                      },
                    ].map((complain, index) => (
                      <tr key={complain.id}>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {complain.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {complain.vendorName}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {complain.fieldType}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {complain.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Users Table */}
          <div className="bg-white rounded-lg shadow mb-8">
            <div className="p-6">
              <h2 className="text-xl mb-4 text-gray-700">Users</h2>
              <div className="overflow-x-auto overflow-y-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {["No", "Customer Name", "Email"].map((header) => (
                        <th
                          key={header}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        id: 1,
                        name: "Kushal",
                        email: "kushal@gmail.com",
                      },
                      {
                        id: 2,
                        name: "Kush",
                        email: "kush@gmail.com",
                      },
                      {
                        id: 3,
                        name: "Gaurav",
                        email: "gaurav@gmail.com",
                      },
                      {
                        id: 4,
                        name: "Ananya",
                        email: "ananya@gmail.com",
                      },
                      {
                        id: 5,
                        name: "Ramesh",
                        email: "ramesh@gmail.com",
                      },
                      {
                        id: 6,
                        name: "Bunty",
                        email: "bunty@gmail.com",
                      },
                      {
                        id: 7,
                        name: "Ansh",
                        email: "ansh@gmail.com",
                      },
                      {
                        id: 8,
                        name: "Shivansh",
                        email: "shivansh@gmail.com",
                      },
                    ].map((user, index) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;