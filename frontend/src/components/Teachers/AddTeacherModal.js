import React, { useState, useRef } from 'react';

const AddTeacherModal = ({ show, onHide, onAddTeacher, existingTeachers = [] }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    university_name: '',
    department: '',
    year_joined: new Date().getFullYear(),
    gender: 'male',
    profile_picture: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPEG, PNG, GIF, etc.)');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }

    setError('');
    setFormData({
      ...formData,
      profile_picture: file
    });

    // Create image preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setFormData({
      ...formData,
      profile_picture: null
    });
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.university_name) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      // Generate new ID based on existing teachers
      const newId = existingTeachers.length > 0 
        ? Math.max(...existingTeachers.map(t => t.id)) + 1 
        : 1;
      const newUserId = existingTeachers.length > 0
        ? Math.max(...existingTeachers.map(t => t.user_id || t.id)) + 1
        : 1;

      // Create a simple URL for the profile picture (in real app, you'd upload to server)
      const profilePictureUrl = imagePreview || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.first_name + ' ' + formData.last_name)}&background=random&size=200`;

      const newTeacher = {
        id: newId,
        user_id: newUserId,
        ...formData,
        profile_picture: profilePictureUrl,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      onAddTeacher(newTeacher);
      onHide();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add teacher');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      first_name: '',
      last_name: '',
      email: '',
      university_name: '',
      department: '',
      year_joined: new Date().getFullYear(),
      gender: 'male',
      profile_picture: null
    });
    setImagePreview(null);
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add New Teacher</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {/* Profile Picture Section */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="text-center">
                    <div className="position-relative d-inline-block">
                      <div 
                        className="rounded-circle bg-secondary d-flex align-items-center justify-content-center"
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          backgroundImage: imagePreview ? `url(${imagePreview})` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          cursor: 'pointer'
                        }}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {!imagePreview && (
                          <span className="text-white">
                            <i className="bi bi-camera" style={{ fontSize: '2rem' }}></i>
                            <div className="small mt-1">Add Photo</div>
                          </span>
                        )}
                      </div>
                      {imagePreview && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm rounded-circle position-absolute"
                          style={{ top: '-5px', right: '-5px' }}
                          onClick={removeImage}
                        >
                          <i className="bi bi-x"></i>
                        </button>
                      )}
                    </div>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="d-none"
                    />
                    
                    <div className="mt-2">
                      <small className="text-muted">
                        Click on the circle to upload a profile picture (max 2MB)
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">First Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Last Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">University Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="university_name"
                  value={formData.university_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Gender</label>
                    <select
                      className="form-select"
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Year Joined *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="year_joined"
                      value={formData.year_joined}
                      onChange={handleChange}
                      min="2000"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Adding...
                </>
              ) : (
                'Add Teacher'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTeacherModal;