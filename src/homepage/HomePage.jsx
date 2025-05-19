import './HomePage.css';
import TasksBlock from '../tasksBlock/TasksBlock';
import api from '../api';
import { useState, useEffect } from 'react';
import TaskPopup from '../taskPopup/TaskPopup';
import Filter from '../filter/Filter';
import DiagramPopup from '../diagramPopup/DiagramPopup';


function HomePage() {

  const [tasks, setTasks] = useState([]);
  const [createTaskPopup, setCreateTaskPopup] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [diagram, setDiagram] = useState(null);
  const [filterPopup, setFilterPopup] = useState(false);
  const [sortBy, setSortBy] = useState('priority');
  const [sortOrder, setSortOrder] = useState('desc');
  const [priorityFilters, setPriorityFilters] = useState({
    CRITICAL: false,
    HIGH: false,
    MEDIUM: false,
    LOW: false
  });
  const [statusFilters, setStatusFilters] = useState({
    TODO: false,
    IN_PROGRESS: false,
    DONE: false
  });
  const [urgencyFilters, setUrgencyFilters] = useState({
    is_urgent: false,
    is_overdue: false
  });

  const fetchTasks = async () => {
    try {
      const response = await api.get('tasks/');
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchFilteredTasks = async (filters) => {
    const params = new URLSearchParams();

    Object.keys(filters.priorityFilters).forEach(level => {
      if (filters.priorityFilters[level]) {
        params.append('priority[]', level);
      }
    });

    Object.keys(filters.statusFilters).forEach(status => {
      if (filters.statusFilters[status]) {
        params.append('status[]', status);
      }
    });

    if (filters.urgencyFilters.is_urgent) {
      params.append('is_urgent', 'true');
    }
    if (filters.urgencyFilters.is_overdue) {
      params.append('is_overdue', 'true');
    }

    let orderingParam;

    if (filters.sortBy === 'priority') {
      orderingParam = filters.sortOrder === 'desc' ? 'priority' : '-priority';
    } else {
      orderingParam = filters.sortOrder === 'desc' ? `-${filters.sortBy}` : filters.sortBy;
    }

    params.append('ordering', orderingParam);

    try {
      const response = await api.get(`tasks/?${params.toString()}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Ошибка при загрузке задач:', error);
    }
  };

  const handleApplyFilters = (filters) => {
    fetchFilteredTasks(filters);
    setFilterPopup(false);
  };

  const handleLogout = async () => {
    try {
      await api.post('logout/');
    } catch (error) {
      console.error('Ошибка выхода', error);
    }
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <div className='app'>
      <header className='app-header'>
        <h1>Управление задачами</h1>
        <button className='exit-button' onClick={handleLogout}>выход</button>
      </header>
      <div className='main-container'>
        <div className='main'>
          <TasksBlock
            setCreateTaskPopup={setCreateTaskPopup}
            setEditTask={setEditTask}
            tasks={tasks}
            fetchTasks={fetchTasks}
            setFilterPopup={setFilterPopup}
          />
          <div className='info-block block'>
            {filterPopup && (
              <Filter
                setFilter={setFilterPopup}
                sortBy={sortBy}
                setSortBy={setSortBy}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                priorityFilters={priorityFilters}
                setPriorityFilters={setPriorityFilters}
                statusFilters={statusFilters}
                setStatusFilters={setStatusFilters}
                urgencyFilters={urgencyFilters}
                setUrgencyFilters={setUrgencyFilters}
                onApply={handleApplyFilters}
              />
            )}
            {createTaskPopup && (
              <TaskPopup
                task={null}
                setPopup={setCreateTaskPopup}
                fetchTasks={fetchTasks}
              />
            )}
            {editTask && (
              <TaskPopup
                task={editTask}
                setPopup={setEditTask}
                fetchTasks={fetchTasks}
              />
            )}
            {diagram && (
              <DiagramPopup
                type={diagram}
                tasks={tasks}
                setDiagram={setDiagram}
                setPopup={setEditTask}
              />
            )}
          </div>
          <div className='stats-block block'>
            <div className='stats-container'>
              <h2>Матрица Эйзенхауэра</h2>
              <div onClick={() => setDiagram('matrix')}>
                <svg width="260" height="260" viewBox="0 0 260 260" fill="none" xmlns="http://www.w3.org/2000/svg" className='matrix-svg'>
                  <rect x="130" y="130" width="130" height="130" fill="#DCFEDA" />
                  <rect x="130" width="130" height="130" fill="#FFDBCC" />
                  <rect width="130" height="130" fill="#FFD0E1" />
                  <rect y="130" width="130" height="130" fill="#D3F3FF" />
                </svg>
              </div>
            </div>
            <div className='stats-container'>
              <h2>Статистика задач</h2>
              <div onClick={() => setDiagram('pie')}>
                <svg width="260" height="260" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg" className='pie-svg'>
                  <path d="M130,130 L130,0 A130,130 0 0,1 243.3,195 Z" fill="#FFD0E1" />
                  <path d="M130,130 L243.3,195 A130,130 0 0,1 16.7,195 Z" fill="#DCFEDA" />
                  <path d="M130,130 L16.7,195 A130,130 0 0,1 130,0 Z" fill="#D3F3FF" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;