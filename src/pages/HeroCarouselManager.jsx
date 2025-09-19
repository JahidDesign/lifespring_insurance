import React, { useState, useEffect } from 'react';
import { Shield, Heart, Car, Home, Umbrella, Plus, Edit2, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';

const HeroCarouselManager = () => {
  const [heroItems, setHeroItems] = useState([
    {
      id: 1,
      title: "Complete Health Protection",
      tagline: "Your Health, Our Priority",
      description: "Comprehensive health insurance coverage for you and your family with nationwide network access.",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=600&fit=crop",
      eventName: "Health Insurance Launch",
      insuranceName: "HealthGuard Pro",
      accent: "from-blue-600 to-cyan-600",
      icon: "Heart",
      stats: { clients: "50K+", coverage: "$2M", years: "15+" },
      active: true
    },
    {
      id: 2,
      title: "Drive with Confidence",
      tagline: "Road Safety Redefined",
      description: "Premium auto insurance with 24/7 roadside assistance and instant claim processing.",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop",
      eventName: "Auto Insurance Special",
      insuranceName: "DriveSecure Plus",
      accent: "from-green-600 to-emerald-600",
      icon: "Car",
      stats: { clients: "75K+", coverage: "$5M", years: "20+" },
      active: true
    },
    {
      id: 3,
      title: "Protect Your Home",
      tagline: "Home Sweet Secured Home",
      description: "Complete home insurance coverage protecting your property and belongings from all risks.",
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&h=600&fit=crop",
      eventName: "Home Protection Plan",
      insuranceName: "HomeSafe Premium",
      accent: "from-purple-600 to-pink-600",
      icon: "Home",
      stats: { clients: "30K+", coverage: "$10M", years: "12+" },
      active: false
    }
  ]);

  // JSON Template Structure
  const jsonTemplate = {
    title: "",
    tagline: "",
    description: "",
    image: "",
    eventName: "",
    insuranceName: "",
    accent: "from-blue-600 to-cyan-600",
    icon: "Shield",
    stats: { clients: "", coverage: "", years: "" }
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [jsonOutput, setJsonOutput] = useState('');

  const iconMap = {
    Shield: Shield,
    Heart: Heart,
    Car: Car,
    Home: Home,
    Umbrella: Umbrella
  };

  const accentOptions = [
    "from-blue-600 to-cyan-600",
    "from-green-600 to-emerald-600",
    "from-purple-600 to-pink-600",
    "from-red-600 to-orange-600",
    "from-indigo-600 to-purple-600",
    "from-yellow-600 to-red-600"
  ];

  const iconOptions = ["Shield", "Heart", "Car", "Home", "Umbrella"];

  // Get active items for carousel
  const activeItems = heroItems.filter(item => item.active);

  useEffect(() => {
    const timer = setInterval(() => {
      if (activeItems.length > 0) {
        setCurrentSlide((prev) => (prev + 1) % activeItems.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [activeItems.length]);

  useEffect(() => {
    setJsonOutput(JSON.stringify(heroItems, null, 2));
  }, [heroItems]);

  const handleAdd = () => {
    const newItem = {
      id: Date.now(),
      ...jsonTemplate,
      active: true
    };
    setEditingItem(newItem);
    setIsEditing(true);
  };

  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editingItem.id && heroItems.find(item => item.id === editingItem.id)) {
      setHeroItems(prev => prev.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
    } else {
      setHeroItems(prev => [...prev, editingItem]);
    }
    setIsEditing(false);
    setEditingItem(null);
  };

  const handleDelete = (id) => {
    setHeroItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleActive = (id) => {
    setHeroItems(prev => prev.map(item => 
      item.id === id ? { ...item, active: !item.active } : item
    ));
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditingItem(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setEditingItem(prev => ({ ...prev, [field]: value }));
    }
  };

  const currentItem = activeItems[currentSlide];
  const CurrentIcon = currentItem ? iconMap[currentItem.icon] : Shield;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel Display */}
      {activeItems.length > 0 && currentItem && (
        <div className={`relative h-screen bg-gradient-to-br ${currentItem.accent} overflow-hidden`}>
          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${currentItem.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent"></div>
          </div>
          
          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-6 lg:px-8">
              <div className="max-w-4xl">
                <div className="flex items-center gap-3 mb-6">
                  <CurrentIcon className="w-12 h-12 text-white" />
                  <span className="text-xl text-white/90 font-medium">{currentItem.insuranceName}</span>
                </div>
                
                <h1 className="text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                  {currentItem.title}
                </h1>
                
                <p className="text-2xl text-white/90 mb-4 font-light">
                  {currentItem.tagline}
                </p>
                
                <p className="text-xl text-white/80 mb-8 max-w-2xl leading-relaxed">
                  {currentItem.description}
                </p>
                
                <div className="flex flex-wrap gap-8 mb-8">
                  {Object.entries(currentItem.stats).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-3xl font-bold text-white">{value}</div>
                      <div className="text-white/70 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-4">
                  <button className="px-8 py-4 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Get Quote
                  </button>
                  <button className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Carousel Indicators */}
          {activeItems.length > 1 && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3">
              {activeItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Management Panel */}
      <div className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Hero Carousel Manager</h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowTable(!showTable)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showTable ? 'Hide Table' : 'Show Table'}
              </button>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add New
              </button>
            </div>
          </div>

          {/* Enhanced Management Table */}
          {showTable && (
            <div className="p-6">
              <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Manage Hero Items</h3>
                <div className="text-sm text-gray-600">
                  Total: {heroItems.length} | Active: {heroItems.filter(item => item.active).length}
                </div>
              </div>
              
              <div className="overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Preview</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Content</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Insurance Info</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Statistics</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {heroItems.map((item, index) => {
                      const ItemIcon = iconMap[item.icon];
                      return (
                        <tr key={item.id} className={`hover:bg-gray-50 transition-colors ${
                          item.active ? 'bg-white' : 'bg-gray-50 opacity-75'
                        }`}>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleActive(item.id)}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                item.active ? 'bg-green-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  item.active ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                            <div className="mt-1 text-xs text-gray-600">
                              {item.active ? 'Active' : 'Inactive'}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg bg-gradient-to-r ${item.accent}`}>
                                <ItemIcon className="w-5 h-5 text-white" />
                              </div>
                              {item.image && (
                                <img
                                  src={item.image}
                                  alt={item.title}
                                  className="w-12 h-8 object-cover rounded border"
                                />
                              )}
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="max-w-xs">
                              <div className="font-semibold text-gray-900 truncate">{item.title || 'Untitled'}</div>
                              <div className="text-sm text-blue-600 truncate">{item.tagline}</div>
                              <div className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-sm">
                              <div className="font-medium text-gray-900">{item.insuranceName}</div>
                              <div className="text-gray-600">{item.eventName}</div>
                              <div className="text-xs text-gray-500 mt-1">{item.accent.replace('from-', '').replace('to-', '→ ')}</div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="text-sm space-y-1">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Clients:</span>
                                <span className="font-medium">{item.stats.clients || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Coverage:</span>
                                <span className="font-medium">{item.stats.coverage || 'N/A'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Years:</span>
                                <span className="font-medium">{item.stats.years || 'N/A'}</span>
                              </div>
                            </div>
                          </td>
                          
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => handleEdit(item)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm('Are you sure you want to delete this item?')) {
                                    handleDelete(item.id);
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                {heroItems.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-lg font-medium">No hero items yet</div>
                    <div className="text-sm">Click "Add New" to create your first hero item</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* JSON Output */}
          <div className="p-6 border-t">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">JSON Structure Template:</h3>
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(jsonTemplate, null, 2))}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Copy Template
              </button>
            </div>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-auto max-h-40 mb-4">
              {JSON.stringify(jsonTemplate, null, 2)}
            </pre>
            
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Current Data (JSON):</h3>
              <button
                onClick={() => navigator.clipboard.writeText(jsonOutput)}
                className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md transition-colors"
              >
                Copy All Data
              </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-60">
              {jsonOutput}
            </pre>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-90vh overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                {editingItem.id && heroItems.find(item => item.id === editingItem.id) ? 'Edit' : 'Add'} Hero Item
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={editingItem?.title || ''}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={editingItem?.tagline || ''}
                    onChange={(e) => handleInputChange('tagline', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editingItem?.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Insurance Name</label>
                  <input
                    type="text"
                    value={editingItem?.insuranceName || ''}
                    onChange={(e) => handleInputChange('insuranceName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Name</label>
                  <input
                    type="text"
                    value={editingItem?.eventName || ''}
                    onChange={(e) => handleInputChange('eventName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={editingItem?.image || ''}
                  onChange={(e) => handleInputChange('image', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Accent Colors</label>
                  <select
                    value={editingItem?.accent || ''}
                    onChange={(e) => handleInputChange('accent', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {accentOptions.map(accent => (
                      <option key={accent} value={accent}>{accent}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                  <select
                    value={editingItem?.icon || ''}
                    onChange={(e) => handleInputChange('icon', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Clients</label>
                  <input
                    type="text"
                    value={editingItem?.stats?.clients || ''}
                    onChange={(e) => handleInputChange('stats.clients', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Coverage</label>
                  <input
                    type="text"
                    value={editingItem?.stats?.coverage || ''}
                    onChange={(e) => handleInputChange('stats.coverage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Years</label>
                  <input
                    type="text"
                    value={editingItem?.stats?.years || ''}
                    onChange={(e) => handleInputChange('stats.years', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HeroCarouselManager;