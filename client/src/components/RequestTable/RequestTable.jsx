import { useState } from 'react';
import api from '../../services/api';
import styles from './RequestTable.module.css';

const RequestTable = ({ requests, setRequests, loading, onRequestUpdated, pagination, onPageChange, showToast }) => {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const getNextStatus = (currentStatus) => {
    if (currentStatus === 'New') return 'In Progress';
    if (currentStatus === 'In Progress') return 'Done';
    return 'Done';
  };

  const handleStatusUpdate = async (id, currentStatus) => {
    const newStatus = getNextStatus(currentStatus);
    
    // Optimistic Update: instantly update the local state to prevent UI lag
    const originalRequests = [...requests];
    setRequests(requests.map(req => 
      req._id === id ? { ...req, status: newStatus } : req
    ));

    try {
      await api.patch(`/requests/${id}/status`, { status: newStatus });
      onRequestUpdated(); // Silent fetch in background
      showToast(`Status updated to ${newStatus}`, 'success');
    } catch (err) {
      console.error('Failed to update status', err);
      // Revert on failure
      setRequests(originalRequests);
      showToast('Failed to update status', 'error');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'New': return styles.statusNew;
      case 'In Progress': return styles.statusInProgress;
      case 'Done': return styles.statusDone;
      default: return '';
    }
  };

  if (loading) {
    return <div className="card">Loading requests...</div>;
  }

  if (!requests || requests.length === 0) {
    return <div className="card">No requests found. Create one above!</div>;
  }

  return (
    <div className={`card ${styles.tableContainer}`}>
      <h2 className={styles.title}>Client Requests</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Client</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Created Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.clientName}</td>
                <td>{request.email}</td>
                <td className={styles.subjectCell}>
                  <div 
                    className={styles.subjectTruncated}
                    onClick={() => setSelectedSubject(request.subject)}
                  >
                    {request.subject}
                  </div>
                </td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusBadgeClass(request.status)}`}>
                    {request.status}
                  </span>
                </td>
                <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                    onClick={() => handleStatusUpdate(request._id, request.status)}
                    disabled={request.status === 'Done'}
                  >
                    {request.status === 'Done' ? 'Completed' : 'Update Status'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {pagination && pagination.totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className="btn" 
            disabled={pagination.page <= 1}
            onClick={() => onPageChange(pagination.page - 1)}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button 
            className="btn" 
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => onPageChange(pagination.page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {selectedSubject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedSubject(null)}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Full Subject</h3>
              <button 
                className="btn" 
                onClick={() => setSelectedSubject(null)}
                style={{ background: 'transparent', color: '#64748b', border: 'none', padding: '0.5rem' }}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {selectedSubject}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestTable;
