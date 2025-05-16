import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome to TaskBoard Pro</h1>
      </div>
      
      <div className="dashboard-actions">
        <button 
          className="button button-primary"
          onClick={() => navigate('/tasks')}
        >
          Create New Task
        </button>
      </div>

    </div>
  );
}

export default Dashboard; 