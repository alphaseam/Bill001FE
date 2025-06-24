import React, { useState, useEffect } from 'react';
import './HotelForm.css';

// State to store hotel form data
const HotelForm = ({ hotel, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    owner: '',
    mobile: '',
    email: '',
    address: '',
    gst: '',
    type: '3-star',
    active: false
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


// Fetch hotel data when editing an existing hotel
  useEffect(() => {
    if (hotel) {
      setFormData(hotel);
    }
  }, [hotel]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Hotel name is required';
    if (!formData.owner.trim()) newErrors.owner = 'Owner name is required';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile number is required';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Invalid mobile number';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSubmit(formData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hotel-form-container">
      <h2 className="form-title">{hotel ? 'Edit Hotel' : 'Add New Hotel'}</h2>
      
      <form onSubmit={handleSubmit} className="hotel-form">
        <div className="form-row">
          <div className={`form-group ${errors.name ? 'has-error' : ''}`}>
            <label htmlFor="name">Hotel Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>
          
          <div className={`form-group ${errors.owner ? 'has-error' : ''}`}>
            <label htmlFor="owner">Owner Name *</label>
            <input
              type="text"
              id="owner"
              name="owner"
              value={formData.owner}
              onChange={handleChange}
            />
            {errors.owner && <span className="error-message">{errors.owner}</span>}
          </div>
        </div>
        
        <div className="form-row">
          <div className={`form-group ${errors.mobile ? 'has-error' : ''}`}>
            <label htmlFor="mobile">Mobile Number *</label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              maxLength="10"
            />
            {errors.mobile && <span className="error-message">{errors.mobile}</span>}
          </div>
          
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
        </div>
        
        <div className={`form-group ${errors.address ? 'has-error' : ''}`}>
          <label htmlFor="address">Address *</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
          ></textarea>
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="gst">GST Number (Optional)</label>
            <input
              type="text"
              id="gst"
              name="gst"
              value={formData.gst}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="type">Hotel Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="1-star">1-star</option>
              <option value="2-star">2-star</option>
              <option value="3-star">3-star</option>
              <option value="4-star">4-star</option>
              <option value="5-star">5-star</option>
            </select>
          </div>
        </div>
        
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            <span className="checkbox-label">Active Status</span>
          </label>
        </div>
        
        <div className="form-actions">
          <button 
            type="button" 
            onClick={onCancel} 
            className="cancel-button"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                {hotel ? 'Updating...' : 'Adding...'}
              </>
            ) : (
              hotel ? 'Update Hotel' : 'Add Hotel'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelForm;
