import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '' });

  // Add Product Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    category: 'Laptops',
    price: '',
    description: '',
    imageFile: null
  });

  // Edit Product Modal State
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [isUpdatingProduct, setIsUpdatingProduct] = useState(false);
  const [editProductForm, setEditProductForm] = useState({
    id: '',
    name: '',
    category: 'Laptops',
    price: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
      showToast('Failed to load products.');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message) => {
    setToast({ show: true, message });
    setTimeout(() => setToast({ show: false, message: '' }), 4000);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error logging out:', err);
      navigate('/login');
    }
  };

  const handleProductInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditProductInputChange = (e) => {
    const { name, value } = e.target;
    setEditProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProductForm(prev => ({ ...prev, imageFile: e.target.files[0] }));
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price || !productForm.imageFile) {
      showToast('Please fill in required fields and select an image.');
      return;
    }

    setIsSubmittingProduct(true);
    try {
      const file = productForm.imageFile;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(filePath);

      const { error: insertError } = await supabase
        .from('products')
        .insert([{
          name: productForm.name,
          category: productForm.category,
          price: parseFloat(productForm.price),
          description: productForm.description,
          image: publicUrl
        }]);

      if (insertError) throw insertError;

      showToast('Product added successfully!');
      setShowProductModal(false);
      setProductForm({
        name: '',
        category: 'Laptops',
        price: '',
        description: '',
        imageFile: null
      });
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
      showToast(`Failed to add product: ${err.message || 'Unknown error'}`);
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleOpenEditProduct = (prod) => {
    setEditProductForm({
      id: prod.id,
      name: prod.name || '',
      category: prod.category || 'Laptops',
      price: prod.price || '',
      description: prod.description || '',
      image: prod.image || ''
    });
    setShowEditProductModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    setIsUpdatingProduct(true);
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editProductForm.name,
          category: editProductForm.category,
          price: parseFloat(editProductForm.price),
          description: editProductForm.description
        })
        .eq('id', editProductForm.id);

      if (error) throw error;

      showToast('Product updated successfully!');
      setShowEditProductModal(false);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
      showToast(`Failed to update product: ${err.message}`);
    } finally {
      setIsUpdatingProduct(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product from the database?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      showToast('Product deleted successfully!');
      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
      showToast(`Failed to delete product: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 transition-all text-xs font-medium">
          <svg className="w-4 h-4 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Admin Navbar matching Admin Portal */}
      <nav className="bg-white border-b border-gray-200/60 sticky top-0 z-40 px-6 py-4 flex items-center justify-between shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex items-center space-x-3">
          <span className="font-bold text-gray-900 tracking-tight text-lg">
            <span className="text-blue-600">V</span>-Mac
          </span>
          <button 
            onClick={() => navigate('/admin-portal')}
            className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-semibold border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
          >
            Admin Portal
          </button>
        </div>

        {/* Center Tab Switcher */}
        <div className="hidden md:flex items-center bg-gray-100/80 p-1 rounded-full border border-gray-200/60 shadow-inner">
          <button
            onClick={() => navigate('/admin-portal')}
            className="px-5 py-1.5 rounded-full text-xs font-semibold text-gray-600 hover:text-gray-900 transition-all cursor-pointer"
          >
            Repair Requests
          </button>
          <button
            className="px-5 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-900 shadow-sm transition-all cursor-pointer"
          >
            Products Inventory
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/')}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer hidden sm:block"
          >
            View Site
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        
        {/* Header Section with Title & Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-gray-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
                Products Inventory
              </h1>
              <span className="text-[11px] bg-blue-50 text-blue-600 font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                {products.length} Items
              </span>
            </div>
            <p className="text-gray-500 text-xs mt-1">
              Manage live store listings, update pricing, and upload catalog items.
            </p>
          </div>

          <button
            onClick={() => setShowProductModal(true)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-semibold shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add New Product</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-gray-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
          {isLoading ? (
            <div className="p-16 text-center text-xs text-gray-400 flex flex-col items-center justify-center space-y-3">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading products inventory...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 text-center text-xs text-gray-400 flex flex-col items-center justify-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 mb-1">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <p className="font-semibold text-gray-600 text-sm">No products found in database</p>
              <p className="text-gray-400 text-xs">Click "Add New Product" to publish your first store listing.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/70 text-gray-400 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3.5 px-4 pl-6">Preview</th>
                    <th className="py-3.5 px-4">Product Name</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3.5 px-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100/80">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="py-3.5 px-4 pl-6">
                        <div className="w-11 h-11 rounded-2xl overflow-hidden border border-gray-200/80 bg-gray-50 shrink-0 shadow-sm">
                          <img 
                            src={prod.image || 'https://via.placeholder.com/50'} 
                            alt={prod.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">
                        {prod.name}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium text-[10px] border border-blue-100/50">
                          {prod.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-gray-900">
                        ${Number(prod.price).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-600 max-w-xs truncate" title={prod.description}>
                        {prod.description || '—'}
                      </td>
                      <td className="py-3.5 px-4 pr-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEditProduct(prod)}
                          className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-blue-600 hover:text-white text-gray-700 font-semibold transition-all cursor-pointer shadow-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          className="px-3.5 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 font-semibold transition-all cursor-pointer shadow-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Add Product Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xl w-full max-w-lg overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Add New Store Product</h2>
                <p className="text-xs text-gray-500 mt-0.5">Upload product details and image directly to Supabase.</p>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="w-8 h-8 rounded-full bg-gray-200/60 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="p-8 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={productForm.name}
                  onChange={handleProductInputChange}
                  placeholder="e.g. MacBook Pro M3"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#FBFBFD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Category</label>
                  <select
                    name="category"
                    value={productForm.category}
                    onChange={handleProductInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#FBFBFD]"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Monitors">Monitors</option>
                    <option value="CCTV">CCTV</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Keyboards">Keyboards</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    value={productForm.price}
                    onChange={handleProductInputChange}
                    placeholder="e.g. 1299"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#FBFBFD] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={productForm.description}
                  onChange={handleProductInputChange}
                  placeholder="Enter product features and specs..."
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#FBFBFD]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Product Image</label>
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center bg-gray-50/50 hover:bg-gray-50 transition-colors relative cursor-pointer group">
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-700 font-semibold">
                      {productForm.imageFile ? productForm.imageFile.name : 'Click to browse or drag image here'}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">Supports PNG, JPG, WEBP</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingProduct ? 'Uploading...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-200/60 shadow-2xl w-full max-w-lg overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-base font-semibold text-gray-900">Edit Product</h2>
                <p className="text-xs text-gray-500 mt-0.5">Modify product details in the database.</p>
              </div>
              <button
                onClick={() => setShowEditProductModal(false)}
                className="w-8 h-8 rounded-full bg-gray-200/60 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="p-8 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Product Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={editProductForm.name}
                  onChange={handleEditProductInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#FBFBFD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Category</label>
                  <select
                    name="category"
                    value={editProductForm.category}
                    onChange={handleEditProductInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#FBFBFD]"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Monitors">Monitors</option>
                    <option value="CCTV">CCTV</option>
                    <option value="Mouse">Mouse</option>
                    <option value="Keyboards">Keyboards</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    required
                    value={editProductForm.price}
                    onChange={handleEditProductInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#FBFBFD] font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-1.5">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  value={editProductForm.description}
                  onChange={handleEditProductInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200/80 text-xs focus:outline-none focus:ring-2 focus:ring-blue-600 bg-[#FBFBFD]"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowEditProductModal(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingProduct}
                  className="px-6 py-2.5 rounded-full text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingProduct ? 'Saving...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}