import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Spinner, Alert, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { teacherAPI } from '../../services/api';

const TeacherDetail = () => {
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const response = await teacherAPI.getById(id);
      setTeacher(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch teacher details');
    } finally {
      setLoading(false);
    }
  };

  const getGenderBadge = (gender) => {
    const variants = {
      male: 'primary',
      female: 'danger',
      other: 'secondary'
    };
    return variants[gender] || 'secondary';
  };

  if (loading) {
    return (
      <Container className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/teachers')}>
          Back to Teachers List
        </Button>
      </Container>
    );
  }

  if (!teacher) {
    return (
      <Container>
        <Alert variant="warning">Teacher not found</Alert>
        <Button variant="primary" onClick={() => navigate('/teachers')}>
          Back to Teachers List
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Button 
        variant="outline-secondary" 
        className="mb-3"
        onClick={() => navigate('/teachers')}
      >
        ← Back to Teachers List
      </Button>

      <Card>
        <Card.Header className="bg-primary text-white">
          <h3 className="mb-0">Teacher Details</h3>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <div className="text-center mb-4">
                <div 
                  className="rounded-circle mx-auto"
                  style={{ 
                    width: '150px', 
                    height: '150px', 
                    backgroundColor: teacher.profile_picture ? 'transparent' : '#6c757d',
                    backgroundImage: teacher.profile_picture ? `url(${teacher.profile_picture})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '3px solid #dee2e6'
                  }}
                >
                  {!teacher.profile_picture && (
                    <span 
                      className="text-white"
                      style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                      }}
                    >
                      {teacher.first_name?.[0]}{teacher.last_name?.[0]}
                    </span>
                  )}
                </div>
                <h4 className="mt-3">{teacher.first_name} {teacher.last_name}</h4>
                <Badge bg={getGenderBadge(teacher.gender)} className="text-capitalize">
                  {teacher.gender}
                </Badge>
                
                {/* Profile Picture Status */}
                {teacher.profile_picture && (
                  <div className="mt-2">
                    <small className="text-muted">
                      <i className="bi bi-image"></i> Profile picture available
                    </small>
                  </div>
                )}
              </div>
            </Col>

            <Col md={8}>
              <h5>Personal Information</h5>
              <hr />
              <Row className="mb-3">
                <Col sm={4}><strong>Email:</strong></Col>
                <Col sm={8}>{teacher.email}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Full Name:</strong></Col>
                <Col sm={8}>{teacher.first_name} {teacher.last_name}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Gender:</strong></Col>
                <Col sm={8} className="text-capitalize">{teacher.gender}</Col>
              </Row>

              <h5 className="mt-4">Professional Information</h5>
              <hr />
              <Row className="mb-3">
                <Col sm={4}><strong>University:</strong></Col>
                <Col sm={8}>{teacher.university_name}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Department:</strong></Col>
                <Col sm={8}>{teacher.department || 'Not specified'}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Year Joined:</strong></Col>
                <Col sm={8}>{teacher.year_joined}</Col>
              </Row>
              <Row className="mb-3">
                <Col sm={4}><strong>Experience:</strong></Col>
                <Col sm={8}>
                  {teacher.year_joined ? 
                    `${new Date().getFullYear() - teacher.year_joined} years` : 
                    'Not available'
                  }
                </Col>
              </Row>

              <h5 className="mt-4">Contact Information</h5>
              <hr />
              <Row className="mb-3">
                <Col sm={4}><strong>Email Address:</strong></Col>
                <Col sm={8}>
                  <a href={`mailto:${teacher.email}`}>{teacher.email}</a>
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-muted">
          Teacher ID: {teacher.id} | User ID: {teacher.user_id}
          {teacher.profile_picture && (
            <span className="float-end">
              <i className="bi bi-image-fill text-primary"></i> Has profile picture
            </span>
          )}
        </Card.Footer>
      </Card>

      {/* Additional Profile Picture Section */}
      {teacher.profile_picture && (
        <Card className="mt-4">
          <Card.Header>
            <h5 className="mb-0">Profile Picture</h5>
          </Card.Header>
          <Card.Body className="text-center">
            <img
              src={teacher.profile_picture}
              alt={`${teacher.first_name} ${teacher.last_name}`}
              className="img-fluid rounded"
              style={{ 
                maxWidth: '300px',
                maxHeight: '300px',
                border: '5px solid #f8f9fa',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="mt-3">
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => window.open(teacher.profile_picture, '_blank')}
              >
                <i className="bi bi-box-arrow-up-right"></i> View Full Image
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default TeacherDetail;