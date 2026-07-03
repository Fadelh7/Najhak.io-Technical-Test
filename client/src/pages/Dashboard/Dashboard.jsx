import { useState, useEffect } from 'react';
import Header from '../../components/Header/Header';
import RequestForm from '../../components/RequestForm/RequestForm';
import RequestTable from '../../components/RequestTable/RequestTable';
import StatCards from '../../components/StatCards/StatCards';
import Toast from '../../components/Toast/Toast';
import api from '../../services/api';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  const fetchRequestsAndStats = async (page = 1, silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [requestsRes, statsRes] = await Promise.all([
        api.get(`/requests?page=${page}&limit=10`),
        api.get('/requests/stats')
      ]);

      setRequests(requestsRes.data.data);
      setPagination({
        page: requestsRes.data.page,
        totalPages: requestsRes.data.totalPages,
      });
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestsAndStats();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchRequestsAndStats(newPage);
    }
  };

  return (
    <div className={styles.dashboard}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle}>Dashboard</h2>
            <button className="btn" onClick={() => setIsModalOpen(true)}>
              + Add Request
            </button>
          </div>

          <StatCards stats={stats} />

          {error && <div className={styles.error}>{error}</div>}

          {isModalOpen && (
            <RequestForm 
              onRequestCreated={() => {
                fetchRequestsAndStats(1);
                setIsModalOpen(false);
              }}
              onClose={() => setIsModalOpen(false)}
              showToast={showToast}
            />
          )}

          <div className={styles.section}>
            <RequestTable 
              requests={requests} 
              setRequests={setRequests}
              loading={loading} 
              onRequestUpdated={() => fetchRequestsAndStats(pagination.page, true)}
              pagination={pagination}
              onPageChange={handlePageChange}
              showToast={showToast}
            />
          </div>
        </div>
      </main>
      
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast({ ...toast, show: false })} 
        />
      )}
    </div>
  );
};

export default Dashboard;
