import React, { useState } from 'react';
import './HotelList.css';

const HotelList = ({ hotels, onAddClick, onEditClick, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const hotelsPerPage = 10;

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hotel.owner.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedHotels = [...filteredHotels].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = sortedHotels.slice(indexOfFirstHotel, indexOfLastHotel);
  const totalPages = Math.ceil(sortedHotels.length / hotelsPerPage);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="hotel-list-container">
      <div className="list-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search hotels by name or owner..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <button onClick={onAddClick} className="add-button">
          + Add New Hotel
        </button>
      </div>

      <div className="table-responsive">
        <table className="hotels-table">
          <thead>
            <tr>
              <th onClick={() => requestSort('name')}>
                Hotel Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('owner')}>
                Owner {sortConfig.key === 'owner' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Mobile</th>
              <th>Email</th>
              <th onClick={() => requestSort('type')}>
                Type {sortConfig.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => requestSort('createdAt')}>
                Added On {sortConfig.key === 'createdAt' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentHotels.length > 0 ? (
              currentHotels.map((hotel) => (
                <tr key={hotel.id}>
                  <td>{hotel.name}</td>
                  <td>{hotel.owner}</td>
                  <td>{hotel.mobile}</td>
                  <td>{hotel.email}</td>
                  <td>{hotel.type}</td>
                  <td>{hotel.createdAt.toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${hotel.active ? 'active' : 'inactive'}`}>
                      {hotel.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions">
                    <button onClick={() => onEditClick(hotel)} className="edit-button">
                      Edit
                    </button>
                    <button onClick={() => onDelete(hotel.id)} className="delete-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">No hotels found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination-controls">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="page-info">Page {currentPage} of {totalPages}</span>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default HotelList;
