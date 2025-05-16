import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TaskBoard from './components/TaskBoard';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<TaskBoard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
