import React, { useState } from 'react';
import HotelList from './HotelList';
import HotelForm from './HotelForm';

const HotelManagement = () => {
  const [view, setView] = useState('list');
  const [editingHotel, setEditingHotel] = useState(null);
  const [hotels, setHotels] = useState([]);

  const switchToAdd = () => {
    setEditingHotel(null);
    setView('form');
  };

  const switchToEdit = (hotel) => {
    setEditingHotel(hotel);
    setView('form');
  };

  const switchToList = () => {
    setView('list');
  };

  const handleAddOrUpdateHotel = (hotel) => {
    if (editingHotel) {
      setHotels(hotels.map(h => h.id === hotel.id ? hotel : h));
    } else {
      setHotels([...hotels, { 
        ...hotel, 
        id: Date.now(),
        createdAt: new Date()
      }]);
    }
    switchToList();
  };

  const handleDeleteHotel = (id) => {
    if (window.confirm('Are you sure you want to delete this hotel?')) {
      setHotels(hotels.filter(hotel => hotel.id !== id));
    }
  };

  return (
    <div className="hotel-management">
      <h1 className="management-title">Hotels Data</h1>
      
      {view === 'list' ? (
        <HotelList 
          hotels={hotels} 
          onAddClick={switchToAdd} 
          onEditClick={switchToEdit}
          onDelete={handleDeleteHotel}
        />
      ) : (
        <HotelForm 
          hotel={editingHotel} 
          onSubmit={handleAddOrUpdateHotel} 
          onCancel={switchToList}
        />
      )}
    </div>
  );
};

export default HotelManagement;
