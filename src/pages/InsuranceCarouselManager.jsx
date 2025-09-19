import React, { useState, useEffect } from 'react';
import { Edit, Trash2, Eye, EyeOff, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';

const InsuranceCarousel = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [showSlideView, setShowSlideView] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  const API_BASE = 'https://insurances-lmy8.onrender.com/InsuranceCarousel';

  // Fetch items from API
  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE);
      if (!response.ok) throw new Error('Failed to fetch items');
      const data = await response.json();
      setItems(data);
      setError('');
    } catch (err) {
      setError('Failed to load carousel items');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new item
  const addItem = async (itemData) => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...itemData, active: true })
      });
      if (!response.ok) throw new Error('Failed to add item');
      await fetchItems();
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add item');
      console.error('Add error:', err);
    }
  };

  // Update item
  const updateItem = async (id, itemData) => {
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemData)
      });
      if (!response.ok) throw new Error('Failed to update item');
      await fetchItems();
      setEditingItem(null);
    } catch (err) {
      setError('Failed to update item');
      console.error('Update error:', err);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete item');
      await fetchItems();
    } catch (err) {
      setError('Failed to delete item');
      console.error('Delete error:', err);
    }
  };

  // Toggle active status
  const toggleActive = async (id, currentStatus) => {
    const item = items.find(item => item.id === id);
    if (!item) return;

    try {
      const response = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, active: !currentStatus })
      });
      if (!response.ok) throw new Error('Failed to update status');
      await fetchItems();
    } catch (err) {
      setError('Failed to update status');
      console.error('Toggle error:', err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const activeItems = items.filter(item => item.active);

  const ItemForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      title: item?.title || '',
      description: item?.description || '',
      image: item?.image || '',
      eventName: item?.eventName || '',
      insuranceName: item?.insuranceName || ''
    });

    const handleSubmit = () => {
      if (!formData.title || !formData.description || !formData.image || !formData.eventName || !formData.insuranceName) {
        alert('Please fill in all fields');
        return;
      }
      onSave(formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {item ? 'Edit Insurance Item' : 'Add New Insurance Item'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Event Name</label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => setFormData({...formData, eventName: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Insurance Name</label>
              <input
                type="text"
                value={formData.insuranceName}
                onChange={(e) => setFormData({...formData, insuranceName: e.target.value})}
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                {item ? 'Update' : 'Add'}
              </button>
              <button
                onClick={onCancel}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SlideView = () => {
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % activeItems.length);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + activeItems.length) % activeItems.length);
    };

    if (activeItems.length === 0) {
      return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="text-center text-white">
            <p className="text-xl mb-4">No active slides to show</p>
            <button
              onClick={() => setShowSlideView(false)}
              className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      );
    }

    const currentItem = activeItems[currentSlide];

    return (
      <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
        <button
          onClick={() => setShowSlideView(false)}
          className="absolute top-4 right-4 text-white hover:text-gray-300 z-60"
        >
          <X size={32} />
        </button>

        <div className="relative w-full max-w-4xl mx-4">
          <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gray-200 flex items-center justify-center">
              {currentItem.image ? (
                <img
                  src={currentItem.image}
                  alt={currentItem.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-gray-500 text-xl">No Image</div>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-3xl font-bold mb-2">{currentItem.title}</h2>
              <p className="text-gray-600 mb-4">{currentItem.description}</p>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Event: {currentItem.eventName}</span>
                <span>Insurance: {currentItem.insuranceName}</span>
              </div>
            </div>
          </div>

          {activeItems.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {activeItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Insurance Carousel Manager</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Item
          </button>
          {activeItems.length > 0 && (
            <button
              onClick={() => {
                setCurrentSlide(0);
                setShowSlideView(true);
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              View Slides ({activeItems.length})
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg overflow-hidden shadow-md transition-all ${
                item.active ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-gray-50'
              }`}
            >
              <div className="aspect-video bg-gray-200 flex items-center justify-center">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500">No Image</div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold truncate">{item.title}</h3>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    item.active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {item.active ? 'Active' : 'Inactive'}
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{item.description}</p>
                <div className="text-xs text-gray-500 mb-3">
                  <div>Event: {item.eventName}</div>
                  <div>Insurance: {item.insuranceName}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => toggleActive(item.id, item.active)}
                    className={`flex-1 px-3 py-2 rounded text-sm transition-colors flex items-center justify-center gap-1 ${
                      item.active
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {item.active ? <EyeOff size={14} /> : <Eye size={14} />}
                    {item.active ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="bg-red-500 text-white px-3 py-2 rounded text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-xl mb-4">No carousel items found</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Your First Item
          </button>
        </div>
      )}

      {editingItem && (
        <ItemForm
          item={editingItem}
          onSave={(data) => updateItem(editingItem.id, data)}
          onCancel={() => setEditingItem(null)}
        />
      )}

      {showAddForm && (
        <ItemForm
          onSave={addItem}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {showSlideView && <SlideView />}
    </div>
  );
};

export default InsuranceCarousel;