import './DiagramPopup.css';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useState } from 'react';

function DiagramPopup({ type, tasks, setDiagram, setPopup }) {
    const COLORS = ['#FFD0E1', '#DCFEDA', '#D3F3FF', '#F0D6FF'];
    const [comparisonType, setComparisonType] = useState('status');

    const important = task => task.priority === 'CRITICAL' || task.priority === 'HIGH';
    const urgent = task => task.is_urgent;
    const overdue = task => task.is_overdue;
    const done = task => task.status === 'DONE';

    const quadrant1 = tasks.filter(task => important(task) && (urgent(task) || overdue(task)) && !done(task));
    const quadrant2 = tasks.filter(task => important(task) && !urgent(task) && !overdue(task) && !done(task));
    const quadrant3 = tasks.filter(task => !important(task) && (urgent(task) || overdue(task)) && !done(task));
    const quadrant4 = tasks.filter(task => !important(task) && !urgent(task) && !overdue(task) && !done(task));

    const getGroupedData = () => {
        const counts = {};
        tasks.forEach(task => {
            let key;
            if (comparisonType === 'status') {
                key = task.status;
            } else if (comparisonType === 'priority') {
                key = task.priority;
            } else if (comparisonType === 'is_urgent') {
                const urgentOrOverdue = task.is_urgent || task.is_overdue;
                key = urgentOrOverdue ? 'Срочная' : 'Не срочная';
            } else {
                key = 'Неизвестно';
            }
            counts[key] = (counts[key] || 0) + 1;
        });

        const translation = {
            'CRITICAL': 'Критическая',
            'HIGH': 'Высокая',
            'MEDIUM': 'Средняя',
            'LOW': 'Низкая',
            'TODO': 'К выполнению',
            'IN_PROGRESS': 'В работе',
            'DONE': 'Завершена',
            'true': 'Срочная',
            'false': 'Не срочная'
        };

        return Object.keys(counts).map(key => ({
            name: translation[key] || key,
            value: counts[key]
        }));
    };

    const data = getGroupedData();

    if (type === 'matrix') {
        return (
            <div className='popup-container'>
                <div className='popup-header'>
                    <h2>Матрица Эйзенхауэра</h2>
                    <button onClick={() => setDiagram(null)} className='close-button'>⨉</button>
                </div>
                <div className='matrix-container'>
                    <div className='matrix'>
                        <div className='important-urgent quadrant'>
                            <h3>Важно и срочно</h3>
                            {quadrant1.map(task => (
                                <div key={task.id} className="task-card" onClick={() => setPopup(task)}>{task.title}</div>
                            ))}
                        </div>
                        <div className='important-noturgent quadrant'>
                            <h3>Важно и не срочно</h3>
                            {quadrant2.map(task => (
                                <div key={task.id} className="task-card" onClick={() => setPopup(task)}>{task.title}</div>
                            ))}
                        </div>
                        <div className='notimportant-urgent quadrant'>
                            <h3>Не важно и срочно</h3>
                            {quadrant3.map(task => (
                                <div key={task.id} className="task-card" onClick={() => setPopup(task)}>{task.title}</div>
                            ))}
                        </div>
                        <div className='notimportant-noturgent quadrant'>
                            <h3>Не важно и не срочно</h3>
                            {quadrant4.map(task => (
                                <div key={task.id} className="task-card" onClick={() => setPopup(task)}>{task.title}</div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    } else if (type === 'pie') {
        return (
            <div className='popup-container'>
                <div className='popup-header'>
                    <h2>Статистика задач по {comparisonType === 'status' ? 'статусу' : comparisonType === 'priority' ? 'важности' : 'срочности'}</h2>
                    <button onClick={() => setDiagram(null)} className='close-button'>⨉</button>
                </div>
                <div className='pie-container'>
                    <div className='comparison-selector'>
                        <label>
                            <input
                                type="radio"
                                name="comparison"
                                value="status"
                                checked={comparisonType === 'status'}
                                onChange={() => setComparisonType('status')}
                            />
                            По статусу
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="comparison"
                                value="priority"
                                checked={comparisonType === 'priority'}
                                onChange={() => setComparisonType('priority')}
                            />
                            По важности
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="comparison"
                                value="is_urgent"
                                checked={comparisonType === 'is_urgent'}
                                onChange={() => setComparisonType('is_urgent')}
                            />
                            По срочности
                        </label>
                    </div>

                    <PieChart width={300} height={300}>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={120}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>
            </div>
        );
    } else {
        setDiagram(null);
        return null;
    }
}

export default DiagramPopup;