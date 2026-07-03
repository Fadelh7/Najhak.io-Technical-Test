import { useState } from 'react';
import api from '../../services/api';
import styles from './RequestForm.module.css';

const RequestForm = ({ onRequestCreated, onClose, showToast }) => {
  const [formData, setFormData] = useState({
    clientName: '',
    email: '',
    subject: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const wordCount = formData.description.trim().split(/\s+/).filter(word => word.length > 0).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (wordCount > 300) {
      setError('Description cannot exceed 300 words.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post('/requests', formData);
      if (showToast) showToast('Request created successfully!', 'success');
      onRequestCreated();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Failed to create request';
      setError(errorMsg);
      if (showToast) showToast(errorMsg, 'error');
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={`card ${styles.formCard}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2 className={styles.title}>Create Request</h2>
        {error && <div className={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="clientName">
                <span>Client Name <span className={styles.required}>*</span></span>
              </label>
              <input
                type="text"
                id="clientName"
                name="clientName"
                placeholder="e.g. Acme Corp"
                value={formData.clientName}
                onChange={handleChange}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">
                <span>Email <span className={styles.required}>*</span></span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="e.g. contact@acmecorp.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="subject">
              <span>Subject <span className={styles.required}>*</span></span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="e.g. Backend API Upgrade"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description">
              <span>Description <span className={styles.required}>*</span></span>
              <span className={styles.wordCount} style={{ color: wordCount > 300 ? 'var(--danger-color)' : 'var(--text-muted)' }}>
                {wordCount} / 300 words
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              placeholder="Please describe your requirements in detail..."
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>
          <div className={styles.formActions}>
            <button type="button" className="btn btn-danger" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn" disabled={loading || wordCount > 300}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
