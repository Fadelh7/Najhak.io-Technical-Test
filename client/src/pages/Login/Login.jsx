import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mockUsers, setMockUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMockUsers = async () => {
      try {
        const response = await api.get('/users');
        setMockUsers(response.data);
      } catch (err) {
        console.error('Failed to fetch mock users');
      }
    };
    fetchMockUsers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      setError(null);
      try {
        const response = await api.post('/users/login', { email, password });
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userName', response.data.name);
        
        // Wait just a tiny bit so the user actually sees the smooth loader
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed');
        setLoading(false);
      }
    }
  };

  const handleDemoFill = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
  };

  return (
    <div className={styles.container}>
      <div className={`card ${styles.loginCard}`}>
        <div className={styles.brandContainer}>
          <div className={styles.brandLogo}>N</div>
          <h2 className={styles.title}>Najhak.io</h2>
        </div>
        <p className={styles.subtitle}>Welcome back! Please login to your account.</p>
        
        {error && <div className={styles.errorAlert}>{error}</div>}
        
        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-block" 
            disabled={loading}
            style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
          >
            {loading ? (
              <>
                <span className={styles.loader}></span>
                Signing in...
              </>
            ) : 'Login'}
          </button>
        </form>

        {mockUsers.length > 0 && (
          <div className={styles.mockUsersSection}>
            <p className={styles.mockTitle}>Development Mock Users:</p>
            <ul className={styles.mockList}>
              {mockUsers.map(user => (
                <li key={user._id} onClick={() => handleDemoFill(user.email, 'password123')} className={styles.mockItem}>
                  <span className={styles.mockRole}>{user.role}</span>
                  <span className={styles.mockEmail}>{user.email}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
