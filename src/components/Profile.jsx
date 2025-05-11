import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../pages/AuthContext";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Spinner,
  Alert,
  Table,
  Button,
  Form,
  Modal,
  Tabs,
  Tab,
  ProgressBar,
  OverlayTrigger,
  Tooltip
} from "react-bootstrap";
import {
  PersonCircle,
  BagCheck,
  Calendar,
  EnvelopeFill,
  PencilSquare,
  Camera,
  ExclamationCircle,
  CheckCircle,
  GeoAlt,
  Phone,
  Clock,
  Star,
  StarFill,
  Eye,
  EyeSlash,
  ShieldCheck
} from "react-bootstrap-icons";
import { getStatusDetails, calculateOrderStatus } from './utils/orderUtils';
import { motion } from "framer-motion";
import './Profile.css';

const OrderStatus = ({ status }) => {
  const { bg, icon } = getStatusDetails(status);
  return (
    <Badge 
      bg={bg} 
      className="d-flex align-items-center gap-1 status-badge"
      style={{ minWidth: '100px', justifyContent: 'center' }}
    >
      <span>{icon}</span>
      <span>{status}</span>
    </Badge>
  );
};

function Profile() {
  const { user, updateUserProfile } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    address: '',
    bio: ''
  });
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Please login to view profile");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get('http://localhost:5001/api/profile', {
          headers: {
            Authorization: token
          }
        });
        
        if (response.data) {
          setProfileData(response.data);
        }
      } catch (err) {
        console.error('Profile fetch error:', err);
        if (err.response?.status === 401) {
          setError("Session expired. Please login again.");
        } else {
          setError(err.response?.data?.error || "Failed to load profile data");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData?.user) {
      setEditForm({
        name: profileData.user.name || '',
        phone: profileData.user.phone || '',
        address: profileData.user.address || '',
        bio: profileData.user.bio || ''
      });
      setImagePreview(profileData.user.profilePic || null);
    }
  }, [profileData]);

  useEffect(() => {
    // Password strength checker
    const checkPasswordStrength = (password) => {
      if (!password) return 0;
      
      let strength = 0;
      
      // Length check
      if (password.length >= 8) strength += 25;
      
      // Character variety checks
      if (/[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 25;
      if (/[^A-Za-z0-9]/.test(password)) strength += 25;
      
      return strength;
    };
    
    // Check if passwords match
    const newPw = passwordForm.newPassword;
    const confirmPw = passwordForm.confirmPassword;
    
    if (newPw && confirmPw) {
      setPasswordsMatch(newPw === confirmPw);
    }
    
    setPasswordStrength(checkPasswordStrength(passwordForm.newPassword));
  }, [passwordForm.newPassword, passwordForm.confirmPassword]);

  useEffect(() => {
    const updateOrderStatuses = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const response = await axios.get('http://localhost:5001/api/orders/update-status', {
          headers: { Authorization: token }
        });
        
        if (response.data?.orders) {
          setProfileData(prev => ({
            ...prev,
            orders: response.data.orders
          }));
        }
      } catch (error) {
        console.error('Error updating order statuses:', error);
      }
    };
    
    const intervalId = setInterval(updateOrderStatuses, 60000);
    updateOrderStatuses();
    return () => clearInterval(intervalId);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(file);
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const formData = {
        ...editForm,
        profilePic: imagePreview
      };
      
      const response = await axios.put(
        'http://localhost:5001/api/profile',
        formData,
        {
          headers: {
            Authorization: token,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data?.user) {
        setProfileData(prev => ({
          ...prev,
          user: response.data.user
        }));
        updateUserProfile(response.data.user);
        setShowEditModal(false);
        
        // Use a Bootstrap toast or alert instead of browser alert
        document.getElementById("updateSuccessAlert").classList.remove("d-none");
        setTimeout(() => {
          document.getElementById("updateSuccessAlert").classList.add("d-none");
        }, 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error.response?.data?.error || 'Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await axios.put(
        'http://localhost:5001/api/change-password',
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        },
        { headers: { Authorization: token } }
      );
      
      alert(response.data.message);
      setShowPasswordModal(false);
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Change Password Error:', error);
      alert(error.response?.data?.error || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      
      const response = await axios.delete('http://localhost:5001/api/delete-account', {
        headers: { Authorization: token },
      });
      
      alert(response.data.message);
      localStorage.removeItem('token');
      window.location.href = '/signin';
    } catch (error) {
      console.error('Delete Account Error:', error);
      alert(error.response?.data?.error || 'Failed to delete account');
    }
  };

  const getProgressBarVariant = (strength) => {
    if (strength < 25) return 'danger';
    if (strength < 50) return 'warning';
    if (strength < 75) return 'info';
    return 'success';
  };

  const getProgressBarLabel = (strength) => {
    if (strength < 25) return 'Weak';
    if (strength < 50) return 'Fair';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (loading) {
    return (
      <Container className="mt-5 pt-5 text-center">
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
          <Spinner animation="border" variant="warning" style={{ width: '3rem', height: '3rem' }} />
          <p className="mt-3 text-muted">Loading your profile...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 pt-5">
        <Alert variant="danger" className="shadow-sm">
          <div className="d-flex align-items-center">
            <ExclamationCircle size={24} className="me-2" />
            <div>
              <Alert.Heading>Authentication Error</Alert.Heading>
              <p className="mb-0">{error}</p>
            </div>
          </div>
          <hr />
          <div className="d-flex justify-content-end">
            <Button variant="outline-danger" href="/signin">
              Sign In
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5 pt-4 pb-5">
      {/* Success Alert (hidden by default) */}
      <Alert variant="success" className="position-fixed top-0 start-50 translate-middle-x mt-4 shadow-lg d-none" style={{ zIndex: 1050 }} id="updateSuccessAlert">
        <div className="d-flex align-items-center">
          <CheckCircle className="me-2" />
          <span>Profile updated successfully!</span>
        </div>
      </Alert>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">
            <span className="border-bottom border-warning border-3 pb-2">My Account</span>
          </h2>
          <div>
            <Button variant="outline-warning" onClick={() => setShowEditModal(true)} className="d-flex align-items-center">
              <PencilSquare className="me-2" />
              Edit Profile
            </Button>
          </div>
        </div>

        <Row className="g-4">
          <Col lg={4}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <Card className="mb-4 shadow-lg border-warning profile-card">
                <Card.Body className="text-center p-4">
                  <div className="position-relative mb-4">
                    <div className="profile-pic-container mx-auto">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="rounded-circle img-thumbnail shadow-sm"
                          style={{ width: '160px', height: '160px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm" style={{ width: '160px', height: '160px' }}>
                          <PersonCircle size={100} className="text-warning" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Card.Title className="fs-2 fw-bold text-dark mb-1">
                    {profileData?.user?.name}
                  </Card.Title>
                  <div className="text-muted mb-4">
                    Member since {new Date(profileData?.user?.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                  
                  <div className="d-grid gap-2 mb-4">
                    <Button variant="warning" onClick={() => setShowEditModal(true)} className="d-flex align-items-center justify-content-center">
                      <PencilSquare className="me-2" />
                      Edit Profile
                    </Button>
                  </div>
                  
                  <ListGroup variant="flush" className="text-start profile-details">
                    <ListGroup.Item className="border-warning py-3">
                      <div className="d-flex align-items-center">
                        <EnvelopeFill className="me-3 text-warning" size={22} />
                        <div>
                          <small className="text-muted d-block">Email Address</small>
                          <strong>{profileData?.user?.email}</strong>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-warning py-3">
                      <div className="d-flex align-items-center">
                        <Phone className="me-3 text-warning" size={22} />
                        <div>
                          <small className="text-muted d-block">Phone Number</small>
                          <strong>{profileData?.user?.phone || 'Not provided'}</strong>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-warning py-3">
                      <div className="d-flex align-items-center">
                        <GeoAlt className="me-3 text-warning" size={22} />
                        <div>
                          <small className="text-muted d-block">Address</small>
                          <strong>{profileData?.user?.address || 'Not provided'}</strong>
                        </div>
                      </div>
                    </ListGroup.Item>
                    <ListGroup.Item className="border-warning py-3">
                      <div className="d-flex align-items-start">
                        <PencilSquare className="me-3 text-warning mt-1" size={22} />
                        <div>
                          <small className="text-muted d-block">Bio</small>
                          <div>{profileData?.user?.bio || 'Not provided'}</div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                  
                  <div className="d-grid gap-2 mt-4">
                    <Button variant="outline-warning" onClick={() => setShowPasswordModal(true)} className="d-flex align-items-center justify-content-center">
                      <ShieldCheck className="me-2" />
                      Change Password
                    </Button>
                    <Button variant="outline-danger" onClick={() => setShowDeleteModal(true)} className="d-flex align-items-center justify-content-center">
                      <ExclamationCircle className="me-2" />
                      Delete Account
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
          
          <Col lg={8}>
            <Card className="shadow-lg border-warning h-100">
              <Card.Header className="bg-white border-warning">
                <Tabs 
                  activeKey={activeTab}
                  onSelect={(k) => setActiveTab(k)}
                  className="profile-tabs"
                  fill
                >
                  <Tab eventKey="orders" title={
                    <div className="d-flex align-items-center">
                      <BagCheck className="me-2" />
                      <span>Orders</span>
                      <Badge bg="warning" text="dark" pill className="ms-2">
                        {profileData?.orders?.length || 0}
                      </Badge>
                    </div>
                  } />
                  <Tab eventKey="activity" title={
                    <div className="d-flex align-items-center">
                      <Clock className="me-2" />
                      <span>Activity</span>
                    </div>
                  } />
                  <Tab eventKey="reviews" title={
                    <div className="d-flex align-items-center">
                      <Star className="me-2" />
                      <span>Reviews</span>
                    </div>
                  } />
                </Tabs>
              </Card.Header>
              
              <Card.Body className="p-0">
                {activeTab === 'orders' && (
                  <div style={{ maxHeight: '600px', overflowY: 'auto', paddingBottom: '0' }}>
                    {!profileData?.orders?.length ? (
                      <div className="text-center py-5">
                        <div className="mb-3">
                          <BagCheck size={60} className="text-warning opacity-50" />
                        </div>
                        <h5 className="text-muted mb-3">No orders yet</h5>
                        <p className="text-muted mb-4">Your order history will appear here once you place an order.</p>
                        <Button variant="warning" className="px-4" href="/kitchen">
                          Start Shopping
                        </Button>
                      </div>
                    ) : (
                      <div className="table-responsive" style={{ marginBottom: '0' }}>
                        <Table hover bordered className="align-middle border-light mb-0 border-opacity-25">
                          <thead className="bg-light sticky-top">
                            <tr>
                              <th className="py-3">Order ID</th>
                              <th className="py-3">Date</th>
                              <th className="py-3">Items</th>
                              <th className="py-3">Status</th>
                              <th className="py-3">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {profileData?.orders?.map((order) => (
                              <motion.tr 
                                key={order._id}
                                whileHover={{ backgroundColor: '#fff9e6' }}
                              >
                                <td>
                                  <Badge bg="warning" text="dark">#{order._id.slice(-6)}</Badge>
                                </td>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <Calendar className="me-2 text-warning" />
                                    <div>
                                      <div>{new Date(order.orderDate).toLocaleDateString()}</div>
                                      <small className="text-muted">
                                        {new Date(order.orderDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                      </small>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div style={{ maxWidth: "200px" }}>
                                    {order.items.slice(0, 2).map((item, idx) => (
                                      <div key={idx} className="mb-1">
                                        <small>
                                          <span className="text-warning fw-bold">•</span> {item.name} × {item.quantity}
                                        </small>
                                      </div>
                                    ))}
                                    {order.items.length > 2 && (
                                      <OverlayTrigger
                                        placement="bottom"
                                        overlay={
                                          <Tooltip>
                                            {order.items.slice(2).map((item, idx) => (
                                              <div key={idx}>{item.name} × {item.quantity}</div>
                                            ))}
                                          </Tooltip>
                                        }
                                      >
                                        <small className="text-primary cursor-pointer">
                                          + {order.items.length - 2} more items
                                        </small>
                                      </OverlayTrigger>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <OrderStatus status={order.status} />
                                  <div className="small text-muted mt-1">
                                    <small>Updated: {new Date(order.statusUpdateDate).toLocaleString()}</small>
                                  </div>
                                </td>
                                <td>
                                  <Badge bg="warning" text="dark" className="fs-6 p-2">
                                    ₹{order.totalAmount.toFixed(2)}
                                  </Badge>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </Table>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'activity' && (
                  <div className="p-4">
                    <div className="text-center py-5">
                      <Clock size={60} className="text-warning opacity-50 mb-3" />
                      <h5 className="text-muted mb-3">Activity History</h5>
                      <p className="text-muted">Recent account activity will appear here.</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div className="p-4">
                    <div className="text-center py-5">
                      <Star size={60} className="text-warning opacity-50 mb-3" />
                      <h5 className="text-muted mb-3">Your Reviews</h5>
                      <p className="text-muted">Your product reviews will appear here.</p>
                      <Button variant="outline-warning" className="mt-2">Write a Review</Button>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </motion.div>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-warning bg-opacity-10">
          <Modal.Title>Edit Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <Form>
            <Row>
              <Col md={4} className="text-center mb-4 mb-md-0">
                <div className="position-relative d-inline-block">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="rounded-circle img-thumbnail shadow"
                      style={{ width: '180px', height: '180px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-sm" style={{ width: '180px', height: '180px' }}>
                      <PersonCircle size={100} className="text-warning" />
                    </div>
                  )}
                  <label className="btn btn-warning position-absolute bottom-0 end-0 rounded-circle p-2">
                    <Camera size={20} />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                </div>
                <div className="mt-3 text-muted small">
                  Click the camera icon to change your profile picture
                </div>
              </Col>
              <Col md={8}>
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Enter your full name"
                        className="form-control-lg"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="Enter your phone number"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    placeholder="Enter your address"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Bio</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    placeholder="Tell us a little about yourself"
                  />
                  <Form.Text className="text-muted">
                    This will be displayed on your public profile
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleUpdateProfile}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
        <Modal.Header closeButton className="bg-warning bg-opacity-10">
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <p className="text-muted mb-4">
            Create a strong password using a combination of letters, numbers, and special characters.
          </p>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>Current Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={passwordVisible.current ? "text" : "password"}
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  placeholder="Enter your current password"
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('current')}
                >
                  {passwordVisible.current ? <EyeSlash /> : <Eye />}
                </Button>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={passwordVisible.new ? "text" : "password"}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="Create a new password"
                  className={passwordForm.newPassword ? (passwordStrength >= 75 ? "border-success" : "") : ""}
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('new')}
                >
                  {passwordVisible.new ? <EyeSlash /> : <Eye />}
                </Button>
              </div>
              {passwordForm.newPassword && (
                <div className="mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small>Password Strength:</small>
                    <small>{getProgressBarLabel(passwordStrength)}</small>
                  </div>
                  <ProgressBar 
                    variant={getProgressBarVariant(passwordStrength)} 
                    now={passwordStrength} 
                    className="mt-1"
                  />
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm New Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={passwordVisible.confirm ? "text" : "password"}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="Confirm your new password"
                  className={
                    passwordForm.confirmPassword ? 
                      (passwordsMatch ? "border-success" : "border-danger") : ""
                  }
                />
                <Button 
                  variant="outline-secondary"
                  onClick={() => togglePasswordVisibility('confirm')}
                >
                  {passwordVisible.confirm ? <EyeSlash /> : <Eye />}
                </Button>
              </div>
              {passwordForm.confirmPassword && !passwordsMatch && (
                <Form.Text className="text-danger">
                  Passwords don't match
                </Form.Text>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="warning" 
            onClick={handleChangePassword}
            disabled={!passwordForm.currentPassword || !passwordForm.newPassword || !passwordsMatch}
          >
            Update Password
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton className="bg-danger bg-opacity-10">
          <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <div className="text-center mb-4">
          <ExclamationCircle size={60} className="text-danger mb-3" />
            <h5 className="mb-3">Are you absolutely sure?</h5>
            <p className="text-muted">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </p>
          </div>
          
          <Alert variant="danger">
            <Alert.Heading className="fs-6">You will lose:</Alert.Heading>
            <ul className="mb-0 ps-3">
              <li>Your profile information</li>
              <li>Order history</li>
              <li>Saved payment methods</li>
              <li>Reviews and ratings</li>
            </ul>
          </Alert>
          
          <Form.Group className="mt-4">
            <Form.Check 
              type="checkbox" 
              id="deleteConfirm"
              label="I understand that this action is permanent and cannot be reversed"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteAccount}
            id="deleteAccountBtn"
          >
            Delete My Account
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

// Add this to your CSS file
/* 
.profile-card {
  transition: all 0.3s ease;
  border-radius: 10px;
  overflow: hidden;
}

.profile-tabs .nav-link {
  color: #6c757d;
  font-weight: 500;
  padding: 1rem;
  border: none;
  border-bottom: 3px solid transparent;
}

.profile-tabs .nav-link.active {
  color: #ffc107;
  background-color: transparent;
  border-bottom: 3px solid #ffc107;
}

.profile-tabs .nav-link:hover:not(.active) {
  border-bottom: 3px solid #ffe69c;
  color: #212529;
}

.profile-details .list-group-item {
  transition: all 0.2s ease;
}

.profile-details .list-group-item:hover {
  background-color: rgba(255, 193, 7, 0.05);
}

.status-badge {
  transition: all 0.2s ease;
}

.cursor-pointer {
  cursor: pointer;
}

.table-sticky-header thead {
  position: sticky;
  top: 0;
  z-index: 1;
  background-color: white;
}

.hover-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
}

.profile-pic-container {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-pic-container:hover {
  box-shadow: 0 0 0 4px rgba(255, 193, 7, 0.5);
}
*/

export default Profile;