import './TasksBlock.css';
import searchIcon from '../img/searchIcon.svg'
import api from '../api';
import { useState, useEffect } from 'react';


function TasksBlock({ setCreateTaskPopup, setEditTask, tasks, fetchTasks, setFilterPopup }) {
    const [timeUpdated, setTimeUpdated] = useState(Date.now());
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeUpdated(Date.now());
        }, 60000);

        return () => clearInterval(interval);
    }, []);

    const handleCompleteTask = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'DONE' ? 'TODO' : 'DONE';
    try {
        await api.patch(`tasks/${taskId}/`, { status: newStatus });
        fetchTasks();
    } catch (error) {
        console.error('Ошибка при обновлении статуса задачи:', error.response?.data || error.message);
    }
};

    const getUrgencyClass = (task) => {
        if (task.status === 'DONE') return 'done';

        if (task.deadline) {
            const deadlineDate = new Date(task.deadline);
            const now = new Date();
            const diffMs = deadlineDate - now;
            const diffSec = diffMs / 1000;

            if (diffSec < 0) return 'overdue';
            if (diffSec <= 86400) return 'urgent';
        }
        return 'normal';
    };

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='tasks-block block'>
            <div className='filter-panel'>
                <div className='input-container'>
                    <input type='text'
                        className='search-input'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} />
                    <img className="search-icon" src={searchIcon} alt="поиск" />
                </div>
                <button className='filter-button button' onClick={() => setFilterPopup(true)}>фильтровать</button>
            </div>
            <div className='tasks-list-container'>
                <ul className='tasks-list'>
                    {filteredTasks.map(task => (
                        <li key={task.id} className={`list-element ${getUrgencyClass(task)}`} onClick={() => {
                            setEditTask(task); window.scrollTo({
                                top: 0,
                                behavior: 'smooth'
                            });
                        }}>
                            <div>{task.title}</div>
                            <span
                                className='status-square'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleCompleteTask(task.id, task.status);
                                }}
                            >
                                {task.status === 'DONE' && (
                                    <svg
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="black"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            <div className='create-button-container'>
                <button className='create-button button' onClick={() => {
                    setCreateTaskPopup(true); window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }}>создать задачу</button>
            </div>
        </div>
    )
}

export default TasksBlock;