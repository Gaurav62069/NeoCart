import React, { useState, useEffect, useCallback } from 'react'; // useCallback add kiya
import ReactDOM from 'react-dom'; // Portal ke liye
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx'; // Auth check ke liye

// Helper component (FormInput)
const FormInput = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-[var(--text-secondary)] mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input 
      type={type} 
      id={name} 
      name={name}
      className="input-neumo"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
    />
  </div>
);

// --- Edit Modal Component ---
const EditProductModal = ({ product, onClose, onProductUpdated }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    description: product.description || '',
    original_price: product.original_price || 0,
    retail_price: product.retail_price || 0,
    wholesaler_price: product.wholesaler_price || 0,
    image_url: product.image_url || '',
    stock: product.stock || 0
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    toast.loading('Updating product...');

    try {
      const dataToSend = {
        ...formData,
        original_price: parseFloat(formData.original_price),
        retail_price: parseFloat(formData.retail_price),
        wholesaler_price: parseFloat(formData.wholesaler_price),
        stock: parseInt(formData.stock, 10)
      };

      await axios.put(`http://localhost:8000/api/admin/products/${product.id}`, dataToSend);
      
      toast.dismiss();
      toast.success('Product updated successfully!');
      onProductUpdated(); // List ko refresh karega
      onClose(); // Modal band karega

    } catch (error) {
      toast.dismiss();
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.detail || "Failed to update product.");
    }
    setIsUpdating(false);
  };

  return (
    // Modal hamesha screen ke beech mein rahega (items-center)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="card-neumo w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex justify-between items-center mb-4 p-4 border-b border-[var(--neumo-dark-shadow)] sticky top-0 bg-[var(--bg-base)] z-10">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)]">Edit Product</h2>
          <button onClick={onClose} className="text-[var(--text-secondary)] text-3xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
          <FormInput label="Product Name" name="name" value={formData.name} onChange={handleChange} required />
          <FormInput label="Description" name="description" value={formData.description} onChange={handleChange} />
          <FormInput label="Image URL" name="image_url" value={formData.image_url} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Original Price (MRP)" name="original_price" type="number" value={formData.original_price} onChange={handleChange} required />
            <FormInput label="Retail Price" name="retail_price" type="number" value={formData.retail_price} onChange={handleChange} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="Wholesaler Price" name="wholesaler_price" type="number" value={formData.wholesaler_price} onChange={handleChange} required />
            <FormInput label="Stock" name="stock" type="number" value={formData.stock} onChange={handleChange} required />
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-[var(--neumo-dark-shadow)] sticky bottom-0 bg-[var(--bg-base)] z-10">
            <button type="button" onClick={onClose} className="btn-neumo">Cancel</button>
            <button type="submit" className="btn-neumo !text-cyan-500" disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Delete Confirm Modal ---
const DeleteConfirmModal = ({ product, onClose, onConfirmDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    toast.loading('Deleting product...');
    try {
      await axios.delete(`http://localhost:8000/api/admin/products/${product.id}`);
      toast.dismiss();
      toast.success('Product deleted successfully!');
      onConfirmDelete(); // List ko refresh karega
      onClose(); // Modal band karega
    } catch (error) {
      toast.dismiss();
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.detail || "Failed to delete product.");
    }
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="card-neumo w-full max-w-lg m-4">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">Confirm Deletion</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Are you sure you want to delete <strong className="text-[var(--text-primary)]">{product.name}</strong>?
            <br />
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-4">
            <button 
              onClick={onClose} 
              className="btn-neumo"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm} 
              className="btn-neumo !bg-red-600 hover:!bg-red-700 !text-white font-bold"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Yes, Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- "Delete All" Confirm Modal ---
const DeleteAllConfirmModal = ({ onClose, onConfirmDeleteAll }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const handleConfirm = async () => {
    setIsDeleting(true);
    toast.loading('Deleting ALL products...');
    try {
      const response = await axios.delete('http://localhost:8000/api/admin/products-all');
      toast.dismiss();
      toast.success(`Successfully deleted ${response.data.products_deleted} products.`);
      onConfirmDeleteAll(); // List ko refresh karega
      onClose(); // Modal band karega
    } catch (error) {
      toast.dismiss();
      console.error("Error deleting all products:", error);
      toast.error(error.response?.data?.detail || "Failed to delete all products.");
    }
    setIsDeleting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 animate-[fadeIn_0.2s_ease-out_forwards]">
      <div className="card-neumo w-full max-w-lg m-4">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-red-500 mb-4">DANGER: FINAL WARNING</h2>
          <p className="text-[var(--text-secondary)] mb-4">
            This action will permanently delete all products from the database. This cannot be undone.
          </p>
          <p className="text-[var(--text-secondary)] mb-4">
            To confirm, please type <strong className="text-red-400">DELETE</strong> in the box below.
          </p>
          <input
            type="text"
            className="input-neumo !border-red-500"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            placeholder="DELETE"
          />
          <div className="flex justify-end gap-4 mt-6">
            <button 
              onClick={onClose} 
              className="btn-neumo"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button 
              onClick={handleConfirm} 
              className="btn-neumo !bg-red-600 hover:!bg-red-700 !text-white font-bold"
              disabled={isDeleting || confirmationText !== "DELETE"}
            >
              {isDeleting ? 'Deleting...' : 'Confirm Delete All'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- AdminPage Component ---
function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const { user, loading: authLoading } = useAuth(); 

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Har page par 10 product
  const [totalProducts, setTotalProducts] = useState(0);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  // Form States
  const [productData, setProductData] = useState({
    name: '', description: '', original_price: '', retail_price: '', wholesaler_price: '', image_url: '', stock: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Background Scroll Lock
  useEffect(() => {
    const isAnyModalOpen = isEditModalOpen || isDeleteModalOpen || isDeleteAllModalOpen;
    if (isAnyModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isEditModalOpen, isDeleteModalOpen, isDeleteAllModalOpen]);

  // --- Data Fetching ---
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await axios.get('http://localhost:8000/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error.response?.data?.detail || "Failed to fetch users.");
    }
    setLoadingUsers(false);
  };

  // --- PAGINATION KE LIYE UPDATED FUNCTION ---
  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const skip = (currentPage - 1) * productsPerPage;
      // Naya API endpoint call karo
      const response = await axios.get(
        `http://localhost:8000/api/admin/products-list?skip=${skip}&limit=${productsPerPage}`
      );
      setProducts(response.data.products);
      setTotalProducts(response.data.total_count);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.detail || "Failed to fetch products.");
    }
    setLoadingProducts(false);
  }, [currentPage, productsPerPage]); // Yeh tab re-run hoga jab page badlega

  useEffect(() => {
    if (!authLoading) {
      if (user && user.email === "62069gaurav@gmail.com") {
        fetchUsers();
      } else {
        setLoadingUsers(false);
      }
    }
  }, [authLoading, user]); 
  
  // Products fetch karne ke liye alag effect
  useEffect(() => {
    if (!authLoading && user && user.email === "62069gaurav@gmail.com") {
      fetchProducts();
    }
  }, [authLoading, user, fetchProducts]); // fetchProducts ko dependency mein daala

  // --- Handlers ---
  const handleVerify = async (userId) => {
    try {
      await axios.post(`http://localhost:8000/api/admin/verify/${userId}`);
      toast.success('User verified successfully!');
      fetchUsers(); 
    } catch (error) {
      console.error("Error verifying user:", error);
      toast.error(error.response?.data?.detail || "Failed to verify user.");
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    toast.loading('Adding product...');
    try {
      const dataToSend = { ...productData,
        original_price: parseFloat(productData.original_price), retail_price: parseFloat(productData.retail_price),
        wholesaler_price: parseFloat(productData.wholesaler_price), stock: parseInt(productData.stock, 10)
      };
      await axios.post('http://localhost:8000/api/admin/products', dataToSend);
      toast.dismiss();
      toast.success('Product added successfully!');
      setProductData({ name: '', description: '', original_price: '', retail_price: '', wholesaler_price: '', image_url: '', stock: '' });
      fetchProducts(); // List refresh karo
    } catch (error) {
      toast.dismiss();
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.detail || "Failed to add product.");
    }
    setIsSubmitting(false);
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleExcelUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return toast.error("Please select an Excel file.");
    setIsUploading(true);
    toast.loading('Uploading and processing file...');
    const formData = new FormData();
    formData.append('file', selectedFile);
    try {
      const response = await axios.post('http://localhost:8000/api/admin/upload-excel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.dismiss();
      toast.success(`Upload successful! Added: ${response.data.added}, Updated: ${response.data.updated}`);
      setSelectedFile(null);
      e.target.reset();
      fetchProducts(); // List refresh karo
    } catch (error) {
      toast.dismiss();
      console.error("Error uploading Excel:", error);
      toast.error(error.response?.data?.detail || "Failed to upload file.");
    }
    setIsUploading(false);
  };

  // MODAL HANDLERS
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteClick = (product) => {
    setDeletingProduct(product);
    setIsDeleteModalOpen(true);
  };
  
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingProduct(null);
  };

  const handleProductDeleted = () => {
    fetchProducts();
  };

  const handleDeleteAllClick = () => {
    setIsDeleteAllModalOpen(true); 
  };

  const handleCloseDeleteAllModal = () => {
    setIsDeleteAllModalOpen(false);
  };

  const handleAllProductsDeleted = () => {
    fetchProducts();
  };

  const handleDownloadExcel = async () => {
    toast.loading('Generating Excel file...');
    try {
      const response = await axios.get('http://localhost:8000/api/admin/products/download-excel', {
        responseType: 'blob', 
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'all_products_backup.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.dismiss();
      toast.success('File download successful!');
    } catch (error) {
      toast.dismiss();
      console.error("Error downloading Excel:", error);
      toast.error("Failed to download file.");
    }
  };

  // --- NAYA PAGINATION HANDLERS ---
  const totalPages = Math.ceil(totalProducts / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  // --- Loading Check ---
  if (authLoading) {
    return <p className="text-center text-xl text-[var(--text-secondary)] p-10">Loading admin data...</p>;
  }

  // --- Security Check ---
  if (!user || user.email !== "62069gaurav@gmail.com") {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-3xl font-bold text-red-500">Access Denied</h1>
        <p className="text-[var(--text-secondary)]">You do not have permission to view this page.</p>
      </div>
    );
  }

  // --- JSX (UI) ---
  return (
    <div className="container mx-auto p-4 animate-[fadeInUp_0.5s_ease-out_forwards]">
      
      {/* --- Section 1: User Management --- */}
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-5">Admin Panel - User Management</h1>
      <div className="overflow-x-auto card-neumo mb-12">
        {loadingUsers ? <p className="p-4">Loading users...</p> : (
          <table className="min-w-full divide-y divide-[var(--neumo-dark-shadow)]">
            <thead className="bg-transparent">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Business ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-transparent divide-y divide-[var(--neumo-dark-shadow)]">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-primary)]">{u.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{u.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{u.business_id || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {u.is_verified ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300">Verified</span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300">Not Verified</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {u.role === 'wholesaler' && !u.is_verified && (
                      <button onClick={() => handleVerify(u.id)} className="btn-neumo !px-3 !py-1 !text-indigo-500">
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* --- Section 2: Product Management (Forms) --- */}
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-5">Product Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Card 1: Manual Add Form */}
        <div className="card-neumo !p-6">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Add Single Product</h2>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <FormInput label="Product Name" name="name" value={productData.name} onChange={handleProductChange} placeholder="e.g., iPhone 15" required />
            <FormInput label="Description" name="description" value={productData.description} onChange={handleProductChange} placeholder="Product details" />
            <FormInput label="Image URL" name="image_url" value={productData.image_url} onChange={handleProductChange} placeholder="https://example.com/image.png" required />
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Original Price (MRP)" name="original_price" type="number" value={productData.original_price} onChange={handleProductChange} placeholder="e.g., 1000" required />
              <FormInput label="Retail Price" name="retail_price" type="number" value={productData.retail_price} onChange={handleProductChange} placeholder="e.g., 800" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormInput label="Wholesaler Price" name="wholesaler_price" type="number" value={productData.wholesaler_price} onChange={handleProductChange} placeholder="e.g., 600" required />
              <FormInput label="Stock" name="stock" type="number" value={productData.stock} onChange={handleProductChange} placeholder="e.g., 50" required />
            </div>
            <button type="submit" className="w-full mt-4 btn-neumo !text-cyan-500 font-bold" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </form>
        </div>
        
        {/* Card 2: Excel Upload Form */}
        <div className="card-neumo !p-6">
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-4">Upload Excel File</h2>
          <form onSubmit={handleExcelUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Product Excel File (.xlsx)</label>
              <input type="file" onChange={handleFileChange} accept=".xlsx" className="w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--bg-base)] file:text-[var(--text-primary)] file:shadow-neumo file:active:shadow-neumo-inset hover:file:bg-[var(--neumo-light-shadow)]" required />
            </div>
            <p className="text-xs text-[var(--text-secondary)]">Note: This will update existing products with the same name, or create new ones.</p>
            <button type="submit" className="w-full mt-4 btn-neumo !text-green-500 font-bold" disabled={isUploading}>
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
          </form>
        </div>
      </div>

      {/* --- Section 3: Existing Products List --- */}
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-5">Existing Products</h1>
      <div className="card-neumo mb-12">
        
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 p-4 border-b border-[var(--neumo-dark-shadow)]">
          <button onClick={handleDownloadExcel} className="btn-neumo !text-green-500">
            Download as Excel
          </button>
          <button onClick={handleDeleteAllClick} className="btn-neumo !text-red-500">
            Delete ALL Products
          </button>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          {loadingProducts ? <p className="p-4">Loading products...</p> : (
            <table className="min-w-full divide-y divide-[var(--neumo-dark-shadow)]">
              <thead className="bg-transparent">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Retail Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Wholesaler Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[var(--text-secondary)] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-transparent divide-y divide-[var(--neumo-dark-shadow)]">
                {products.map((prod) => (
                  <tr 
                    key={prod.id}
                    className={
                      deletingProduct && deletingProduct.id === prod.id 
                      ? 'shadow-neumo border-[var(--hover-border-color)]' // Highlight class
                      : ''
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[var(--text-primary)]">{prod.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">₹{prod.retail_price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">₹{prod.wholesaler_price}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--text-secondary)]">{prod.stock}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex gap-2">
                      <button onClick={() => handleEditClick(prod)} className="btn-neumo !px-3 !py-1 !text-cyan-500">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteClick(prod)} className="btn-neumo !px-3 !py-1 !text-red-500">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        
        {/* --- NAYA PAGINATION CONTROLS --- */}
        {totalProducts > 0 && (
          <div className="flex justify-between items-center p-4 border-t border-[var(--neumo-dark-shadow)]">
            <p className="text-sm text-[var(--text-secondary)]">
              Showing <span className="font-bold text-[var(--text-primary)]">{(currentPage - 1) * productsPerPage + 1}</span>
              -
              <span className="font-bold text-[var(--text-primary)]">{Math.min(currentPage * productsPerPage, totalProducts)}</span>
              {' '} of <span className="font-bold text-[var(--text-primary)]">{totalProducts}</span> products
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="btn-neumo !px-4 !py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button 
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="btn-neumo !px-4 !py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}

      </div>

      {/* --- Modals (Portal ka istemal) --- */}
      {isEditModalOpen && editingProduct && ReactDOM.createPortal(
        <EditProductModal 
          product={editingProduct} 
          onClose={handleCloseEditModal}
          onProductUpdated={fetchProducts} 
        />,
        document.getElementById('modal-root')
      )}
      
      {isDeleteModalOpen && deletingProduct && ReactDOM.createPortal(
        <DeleteConfirmModal
          product={deletingProduct}
          onClose={handleCloseDeleteModal}
          onConfirmDelete={handleProductDeleted} 
        />,
        document.getElementById('modal-root')
      )}

      {isDeleteAllModalOpen && ReactDOM.createPortal(
        <DeleteAllConfirmModal
          onClose={handleCloseDeleteAllModal}
          onConfirmDeleteAll={handleAllProductsDeleted}
        />,
        document.getElementById('modal-root')
      )}
    </div>
  );
}

export default AdminPage;