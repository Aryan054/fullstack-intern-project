import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { teacherAPI } from '../../services/api';
import AddTeacherModal from './AddTeacherModal';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [usingMockData, setUsingMockData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    // Filter teachers based on search term
    if (searchTerm === '') {
      setFilteredTeachers(teachers);
    } else {
      const filtered = teachers.filter(teacher =>
        teacher.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (teacher.department && teacher.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
        teacher.university_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
    }
  }, [searchTerm, teachers]);

  const fetchTeachers = async () => {
    try {
      const response = await teacherAPI.getAll();
      const teachersData = response.data.data || response.data || [];
      setTeachers(teachersData);
      setFilteredTeachers(teachersData);
      
      if (teachersData.length > 0 && !teachersData[0].id) {
        setUsingMockData(true);
      }
    } catch (err) {
      setError('Failed to fetch teachers. Using demo data instead.');
      setUsingMockData(true);
      const mockData = [
        {
          id: 1,
          user_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          email: 'john.doe@university.edu',
          university_name: 'Savitribai Phule Pune University',
          department: 'Computer Science',
          year_joined: 2020,
          gender: 'male'
        },
        {
          id: 2,
          user_id: 2,
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'jane.smith@university.edu',
          university_name: 'Savitribai Phule Pune University',
          department: 'Mathematics',
          year_joined: 2019,
          gender: 'female'
        },
        {
          id: 3,
          user_id: 3,
          first_name: 'Aryan',
          last_name: 'Rathod',
          email: 'aryanrathod791@gmail.com',
          university_name: 'Savitribai Phule Pune University',
          department: 'Artificial Intelligence and Machine Learning',
          year_joined: 2021,
          gender: 'male'
        }
      ];
      setTeachers(mockData);
      setFilteredTeachers(mockData);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (id) => {
    navigate(`/teachers/${id}`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleAddTeacher = (newTeacher) => {
    setTeachers([...teachers, newTeacher]);
    setFilteredTeachers([...teachers, newTeacher]);
    setSuccessMessage('Teacher added successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  if (loading) {
    return (
      <div className="container my-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading teachers...</p>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Teachers List</h2>
        <div>
          <button 
            className="btn btn-outline-primary me-2"
            onClick={fetchTeachers}
            title="Refresh teachers list"
          >
            <i className="bi bi-arrow-clockwise"></i> Refresh
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle"></i> Add Teacher
          </button>
        </div>
      </div>
      
      {usingMockData && (
        <div className="alert alert-info mb-3">
          <strong>Note:</strong> Using demo data. Backend server is not available.
        </div>
      )}
      
      {error && (
        <div className="alert alert-warning mb-3">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="alert alert-success mb-3">
          {successMessage}
        </div>
      )}
      
      {/* Search Box */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search teachers by name, email, department, or university..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={clearSearch}
                  >
                    <i className="bi bi-x"></i>
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center h-100">
                <span className="text-muted">
                  {filteredTeachers.length} of {teachers.length} teachers found
                  {searchTerm && ` for "${searchTerm}"`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Teachers Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>University</th>
              <th>Department</th>
              <th>Year Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTeachers.map((teacher) => (
              <tr key={teacher.id}>
                
                <td>{teacher.id}</td>
                <td>
                  {teacher.first_name} {teacher.last_name}
                  {searchTerm && (
                    <span className="text-info">
                      {' '}
                      <i className="bi bi-search"></i>
                    </span>
                  )}
                </td>
                <td>{teacher.email}</td>
                <td>{teacher.university_name}</td>
                <td>{teacher.department}</td>
                <td>{teacher.year_joined}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => handleRowClick(teacher.user_id || teacher.id)}
                    title="View details"
                  >
                    <i className="bi bi-eye"></i> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {filteredTeachers.length === 0 && !loading && (
        <div className="text-center py-5">
          <div className="text-muted mb-3">
            <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
          </div>
          <h4>No teachers found</h4>
          <p className="text-muted">
            {searchTerm
              ? `No teachers match your search for "${searchTerm}"`
              : 'No teachers available'}
          </p>
          {searchTerm ? (
            <button className="btn btn-primary me-2" onClick={clearSearch}>
              Clear Search
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <i className="bi bi-plus-circle"></i> Add First Teacher
            </button>
          )}
        </div>
      )}

      {/* Add Teacher Modal */}
      <AddTeacherModal 
  show={showAddModal}
  onHide={() => setShowAddModal(false)}
  onAddTeacher={handleAddTeacher}
  existingTeachers={teachers}
/>
    </div>
  );
};

export default TeacherList;