import React, { useEffect, useState } from "react";
import { Users, FileText, Shield, Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock, UserCheck, UserX, AlertCircle } from "lucide-react";


const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [users, setUsers] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [activeTab, setActiveTab] = useState('applications');
  const [newPolicy, setNewPolicy] = useState({
    title: "",
    category: "",
    description: "",
    minAge: "",
    maxAge: "",
    coverage: "",
    duration: "",
    rate: "",
    image: "",
  });
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  // Mock data since we can't access localhost API

  
  const mockApplications = [
    {
      _id: "1",
      name: "John Smith",
      email: "john.smith@email.com",
      insuranceType: "Health Insurance Premium",
      date: "2024-08-10",
      status: "Pending",
      agentId: null,
      phone: "+1 (555) 123-4567",
      age: 35
    },
    {
      _id: "2",
      name: "Sarah Johnson",
      email: "sarah.j@email.com",
      insuranceType: "Auto Insurance",
      date: "2024-08-12",
      status: "Approved",
      agentId: "agent1",
      phone: "+1 (555) 987-6543",
      age: 28
    },
    {
      _id: "3",
      name: "Mike Davis",
      email: "mike.davis@email.com",
      insuranceType: "Life Insurance",
      date: "2024-08-14",
      status: "Rejected",
      agentId: "agent2",
      phone: "+1 (555) 456-7890",
      age: 45
    }
  ];

  const mockUsers = [
    { _id: "1", name: "Alice Cooper", email: "alice@company.com", role: "customer", createdAt: "2024-07-15" },
    { _id: "2", name: "Bob Wilson", email: "bob@company.com", role: "agent", createdAt: "2024-07-20" },
    { _id: "3", name: "Charlie Brown", email: "charlie@company.com", role: "customer", createdAt: "2024-08-01" },
    { _id: "agent1", name: "Agent Smith", email: "agent.smith@company.com", role: "agent", createdAt: "2024-06-10" },
    { _id: "agent2", name: "Agent Jones", email: "agent.jones@company.com", role: "agent", createdAt: "2024-06-15" }
  ];

  const mockPolicies = [
    {
      _id: "1",
      title: "Comprehensive Health Coverage",
      category: "Health",
      description: "Complete health insurance with dental and vision",
      minAge: "18",
      maxAge: "65",
      coverage: "$100,000 - $500,000",
      duration: "1-5 years",
      rate: "$200-400/month",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop"
    },
    {
      _id: "2",
      title: "Auto Protection Plus",
      category: "Auto",
      description: "Full coverage auto insurance with roadside assistance",
      minAge: "21",
      maxAge: "75",
      coverage: "$50,000 - $200,000",
      duration: "6 months - 2 years",
      rate: "$150-300/month",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=100&h=100&fit=crop"
    }
  ];

  useEffect(() => {
    // Simulate API calls with mock data
    setApplications(mockApplications);
    setUsers(mockUsers);
    setPolicies(mockPolicies);
  }, []);

  const handleAssignAgent = (id, agentId) => {
    setApplications(prev => prev.map(app => 
      app._id === id ? { ...app, agentId } : app
    ));
  };

  const handleStatusChange = (id, status) => {
    setApplications(prev => prev.map(app => 
      app._id === id ? { ...app, status } : app
    ));
  };

  const promoteUser = (id, role) => {
    setUsers(prev => prev.map(user => 
      user._id === id ? { ...user, role } : user
    ));
  };

  const deleteUser = (id) => {
    setUsers(prev => prev.filter(user => user._id !== id));
  };

  const deletePolicy = (id) => {
    setPolicies(prev => prev.filter(policy => policy._id !== id));
  };

  const handlePolicySubmit = () => {
    if (editingPolicy) {
      setPolicies(prev => prev.map(policy => 
        policy._id === editingPolicy._id ? { ...policy, ...newPolicy } : policy
      ));
    } else {
      const newId = Date.now().toString();
      setPolicies(prev => [...prev, { ...newPolicy, _id: newId }]);
    }
    setNewPolicy({
      title: "", category: "", description: "", minAge: "", maxAge: "", 
      coverage: "", duration: "", rate: "", image: ""
    });
    setEditingPolicy(null);
    setShowPolicyForm(false);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Approved': return <CheckCircle className="text-green-500" size={20} />;
      case 'Rejected': return <XCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-yellow-500" size={20} />;
    }
  };

  const getRoleColor = (role) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'agent': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
  
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
       
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome back, Admin</span>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title="Total Applications" 
            value={applications.length} 
            icon={FileText} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Active Users" 
            value={users.length} 
            icon={Users} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Insurance Policies" 
            value={policies.length} 
            icon={Shield} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Pending Reviews" 
            value={applications.filter(app => app.status === 'Pending').length} 
            icon={AlertCircle} 
            color="bg-orange-500" 
          />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-xl shadow-lg border border-gray-200">
          <div className="flex border-b border-gray-200">
            {[
              { id: 'applications', label: 'Applications', icon: FileText },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'policies', label: 'Policies', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 ${
                  activeTab === tab.id 
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Applications Tab */}
            {activeTab === 'applications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Manage Applications</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                      {applications.filter(app => app.status === 'Pending').length} Pending
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {applications.filter(app => app.status === 'Approved').length} Approved
                    </span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Applicant</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Policy Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Agent</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map(app => (
                        <tr key={app._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-800">{app.name}</p>
                              <p className="text-sm text-gray-600">{app.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{app.insuranceType}</td>
                          <td className="py-4 px-4 text-gray-600">{app.date}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(app.status)}
                              <select 
                                value={app.status} 
                                onChange={(e) => handleStatusChange(app._id, e.target.value)}
                                className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                              >
                                <option>Pending</option>
                                <option>Approved</option>
                                <option>Rejected</option>
                              </select>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <select 
                              onChange={(e) => handleAssignAgent(app._id, e.target.value)} 
                              defaultValue={app.agentId || ""}
                              className="border border-gray-300 rounded-lg px-2 py-1 text-sm"
                            >
                              <option value="">Assign Agent</option>
                              {users.filter(u => u.role === "agent").map(agent => (
                                <option key={agent._id} value={agent._id}>{agent.name}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4 px-4">
                            <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200">
                              <Eye size={16} />
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Manage Users</h2>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {users.filter(u => u.role === 'agent').length} Agents
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                      {users.filter(u => u.role === 'customer').length} Customers
                    </span>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Registered</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(user => (
                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <p className="font-medium text-gray-800">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-600">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              {user.role === "customer" && (
                                <button 
                                  onClick={() => promoteUser(user._id, "agent")} 
                                  className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors duration-200"
                                >
                                  <UserCheck size={16} />
                                  Promote
                                </button>
                              )}
                              {user.role === "agent" && (
                                <button 
                                  onClick={() => promoteUser(user._id, "customer")} 
                                  className="flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
                                >
                                  <UserX size={16} />
                                  Demote
                                </button>
                              )}
                              <button 
                                onClick={() => deleteUser(user._id)} 
                                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Policies Tab */}
            {activeTab === 'policies' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Manage Policies</h2>
                  <button 
                    onClick={() => {
                      setShowPolicyForm(true);
                      setEditingPolicy(null);
                      setNewPolicy({
                        title: "", category: "", description: "", minAge: "", maxAge: "", 
                        coverage: "", duration: "", rate: "", image: ""
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    <Plus size={20} />
                    Add New Policy
                  </button>
                </div>

                {/* Policy Form */}
                {showPolicyForm && (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      {editingPolicy ? 'Edit Policy' : 'Create New Policy'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input 
                        type="text" 
                        placeholder="Policy Title" 
                        value={newPolicy.title} 
                        onChange={(e) => setNewPolicy({ ...newPolicy, title: e.target.value })} 
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Category" 
                        value={newPolicy.category} 
                        onChange={(e) => setNewPolicy({ ...newPolicy, category: e.target.value })} 
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <textarea 
                        placeholder="Description" 
                        value={newPolicy.description} 
                        onChange={(e) => setNewPolicy({ ...newPolicy, description: e.target.value })} 
                        className="md:col-span-2 border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        rows="3"
                      />
                      <input 
                        type="number" 
                        placeholder="Min Age" 
                        value={newPolicy.minAge} 
                        onChange={(e) => setNewPolicy({ ...newPolicy, minAge: e.target.value })} 
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input 
                        type="number" 
                        placeholder="Max Age" 
                        value={newPolicy.maxAge} 
                        onChange={(e) => setNewPolicy({ ...newPolicy, maxAge: e.target.value })} 
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Coverage Range" 
                        value={newPolicy.coverage} 
                        onChange={(e) => setNewPolicy({ ...newPolicy, coverage: e.target.value })} 
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Duration Options" 
                        value={newPolicy.duration} 
                        onChange={(e) => setNewPolicy({ ...newPolicy, duration: e.target.value })} 
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Base Premium Rate" 
                        value={newPolicy.rate} 
                        onChange={(e) => setNewPolicy({ ...newPolicy, rate: e.target.value })} 
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                      <input 
                        type="text" 
                        placeholder="Policy Image URL" 
                        value={newPolicy.image} 
                        onChange={(e) => setNewPolicy({ ...newPolicy, image: e.target.value })} 
                        className="border border-gray-300 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      />
                    </div>
                    <div className="flex gap-3 mt-4">
                      <button 
                        onClick={handlePolicySubmit} 
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                      >
                        {editingPolicy ? "Update Policy" : "Create Policy"}
                      </button>
                      <button 
                        onClick={() => setShowPolicyForm(false)} 
                        className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Policy</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Category</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Age Range</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Rate</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {policies.map(policy => (
                        <tr key={policy._id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={policy.image} 
                                alt={policy.title} 
                                className="w-10 h-10 rounded-lg object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-800">{policy.title}</p>
                                <p className="text-sm text-gray-600 truncate max-w-xs">{policy.description}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                              {policy.category}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{policy.minAge} - {policy.maxAge} years</td>
                          <td className="py-4 px-4 text-gray-700">{policy.rate}</td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => { 
                                  setEditingPolicy(policy); 
                                  setNewPolicy(policy); 
                                  setShowPolicyForm(true); 
                                }} 
                                className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-200"
                              >
                                <Edit size={16} />
                                Edit
                              </button>
                              <button 
                                onClick={() => deletePolicy(policy._id)} 
                                className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;