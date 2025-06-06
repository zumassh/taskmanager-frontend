import './TaskPopup.css';
import api from '../api';
import { useState, useEffect } from 'react';

function TaskPopup({ task, setPopup, fetchTasks }) {

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState('');
    const [priority, setPriority] = useState('CRITICAL');
    const [status, setStatus] = useState('TODO');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const finalDeadline = deadline === '' ? null : deadline;
        const finalDescription = description === '' ? null : description;
        const formData = { title, description: finalDescription, deadline: finalDeadline, priority, status };
        try {
            const response = await api.post('tasks/', formData);
            setPopup(false);
            fetchTasks();
            console.log('Задача создана:', response.data);
            setMessage('Задача добавлена!');
        } catch (error) {
            console.error('Ошибка при создании задачи:', error.response?.data || error.message);
            setMessage('Ошибка при создании задачи. Попробуйте снова.');
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const finalDeadline = deadline === '' ? null : deadline;
        const finalDescription = description === '' ? null : description;
        const updatedData = { title, description: finalDescription, deadline: finalDeadline, priority, status };

        try {
            const response = await api.patch(`tasks/${task.id}/`, updatedData);
            setPopup(false);
            fetchTasks();
            console.log('Задача обновлена:', response.data);
            setMessage('Задача обновлена!');
        } catch (error) {
            console.error('Ошибка при обновлении задачи:', error.response?.data || error.message);
            setMessage('Ошибка при обновлении задачи. Попробуйте снова.');
        }
    };

    const handleDeleteTask = async () => {
        try {
            await api.delete(`tasks/${task.id}/`);
            setPopup(false);
            fetchTasks();
            console.log('Задача удалена');
            setMessage('Задача удалена!');
        } catch (error) {
            console.error('Ошибка при удалении задачи:', error.response?.data || error.message);
            setMessage('Ошибка при удалении задачи. Попробуйте снова.');
        }
    };

    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description || '');
            setDeadline(task.deadline ? task.deadline.slice(0, 16) : '');
            setPriority(task.priority);
            setStatus(task.status);
        } else {
            setTitle('');
            setDescription('');
            setDeadline('');
            setPriority('CRITICAL');
            setStatus('TODO');
        }
    }, [task]);

    const downloadTaskIcs = async (taskId) => {
        try {
            const response = await api.get(`tasks/${taskId}/generate_ics/`, {
                responseType: 'blob'
            });
    
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `task_${taskId}.ics`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Ошибка при скачивании задачи:', error.response?.data || error.message);
        }
    };

    return (
        task ? (
            <div className='popup-container'>
                <div className='popup-header'>
                    <h2>Изменить задачу</h2>
                    <button onClick={() => setPopup(false)} className='close-button'>⨉</button>
                </div>
                <form className="create-form form" onSubmit={handleUpdateSubmit}>
                    <input
                        className="form-element"
                        type="text"
                        placeholder="Название"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        maxLength="37"
                    />
                    <textarea
                        className="form-element"
                        placeholder="Описание"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <input
                        className="form-element"
                        type="datetime-local"
                        placeholder="Дедлайн"
                        value={deadline}
                        min="2025-05-01T00:00"
                        max="9999-12-31T23:59"
                        onChange={e => setDeadline(e.target.value)}
                    />

                    <div className='select-container'>
                        <select className="form-element" value={priority} id="priority" onChange={(e) => setPriority(e.target.value)}>
                            <option value="CRITICAL">Критическая</option>
                            <option value="HIGH">Высокая</option>
                            <option value="MEDIUM">Средняя</option>
                            <option value="LOW">Низкая</option>
                        </select>
                        <label htmlFor="priority">Важность задачи</label>
                    </div>

                    <div className='select-container'>
                        <select className="form-element" value={status} id="status" onChange={(e) => setStatus(e.target.value)}>
                            <option value="TODO">К выполнению</option>
                            <option value="IN_PROGRESS">В работе</option>
                            <option value="DONE">Завершена</option>
                        </select>
                        <label htmlFor="status">Статус выполнения задачи</label>
                    </div>
                    <div className='buttons-container'>
                        <button type="button" className='delete-button form-element' onClick={handleDeleteTask}>удалить задачу</button>
                        {task.deadline && <button type="button" className='download-button form-element' onClick={() => downloadTaskIcs(task.id)}>скачать задачу</button>}
                        <button type="submit" className='post-button form-element'>сохранить изменения</button>
                    </div>
                    <div>{message}</div>
                </form>
            </div>
        ) : (
            <div className='popup-container'>
                <div className='popup-header'>
                    <h2>Создать задачу</h2>
                    <button onClick={() => setPopup(false)} className='close-button'>⨉</button>
                </div>
                <form className="create-form form" onSubmit={handleSubmit}>
                    <input
                        className="form-element"
                        type="text"
                        placeholder="Название"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        maxLength="37"
                    />
                    <textarea
                        className="form-element"
                        placeholder="Описание"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                    <input
                        className="form-element"
                        type="datetime-local"
                        placeholder="Дедлайн"
                        value={deadline}
                        onChange={e => setDeadline(e.target.value)}
                    />

                    <div className='select-container'>
                        <select className="form-element" value={priority} id="priority" onChange={(e) => setPriority(e.target.value)}>
                            <option value="CRITICAL">Критическая</option>
                            <option value="HIGH">Высокая</option>
                            <option value="MEDIUM">Средняя</option>
                            <option value="LOW">Низкая</option>
                        </select>
                        <label htmlFor="priority">Важность задачи</label>
                    </div>

                    <div className='select-container'>
                        <select className="form-element" value={status} id="status" onChange={(e) => setStatus(e.target.value)}>
                            <option value="TODO">К выполнению</option>
                            <option value="IN_PROGRESS">В работе</option>
                            <option value="DONE">Завершена</option>
                        </select>
                        <label htmlFor="status">Статус выполнения задачи</label>
                    </div>

                    <button type="submit" className='post-button form-element'>cоздать задачу</button>
                    <div>{message}</div>
                </form>
            </div>
        )
    )
}

export default TaskPopup;