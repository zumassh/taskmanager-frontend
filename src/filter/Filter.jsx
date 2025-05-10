import './Filter.css';

function Filter(props) {
    const {
        setFilter,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder,
        priorityFilters,
        setPriorityFilters,
        statusFilters,
        setStatusFilters,
        urgencyFilters,
        setUrgencyFilters,
        onApply,
    } = props;

    const togglePriorityFilter = (level) => {
        setPriorityFilters(prev => ({
            ...prev,
            [level]: !prev[level]
        }));
    };

    const toggleStatusFilter = (status) => {
        setStatusFilters(prev => ({
            ...prev,
            [status]: !prev[status]
        }));
    };

    const toggleUrgencyFilter = (flag) => {
        setUrgencyFilters(prev => ({
            ...prev,
            [flag]: !prev[flag]
        }));
    };

    const handleApply = () => {
        const filters = {
            sortBy,
            sortOrder,
            priorityFilters,
            statusFilters,
            urgencyFilters
        };
        onApply(filters);
    };

    const resetFilters = () => {
        const defaultFilters = {
            sortBy: 'priority',
            sortOrder: 'desc',
            priorityFilters: {
                CRITICAL: false,
                HIGH: false,
                MEDIUM: false,
                LOW: false
            },
            statusFilters: {
                TODO: false,
                IN_PROGRESS: false,
                DONE: false
            },
            urgencyFilters: {
                is_urgent: false,
                is_overdue: false
            }
        };
    
        setSortBy(defaultFilters.sortBy);
        setSortOrder(defaultFilters.sortOrder);
        setPriorityFilters(defaultFilters.priorityFilters);
        setStatusFilters(defaultFilters.statusFilters);
        setUrgencyFilters(defaultFilters.urgencyFilters);
    
        onApply(defaultFilters);
    };

    return (
        <div className='filter-container'>
            <div className='filter-header'>
                <h2>Настройка списка задач</h2>
                <button onClick={() => setFilter(false)} className='close-button'>⨉</button>
            </div>
            <h3>Сортировать по...</h3>
            <div className='sort-block'>
                <div className="sort-options">
                    <label>
                        <input
                            type="radio"
                            name="sortBy"
                            value="priority"
                            checked={sortBy === 'priority'}
                            onChange={() => setSortBy('priority')}
                        /> важности
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="sortBy"
                            value="is_urgent"
                            checked={sortBy === 'is_urgent'}
                            onChange={() => setSortBy('is_urgent')}
                        /> срочности
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="sortBy"
                            value="status"
                            checked={sortBy === 'status'}
                            onChange={() => setSortBy('status')}
                        /> статусу
                    </label>
                </div>

                <div className="sort-direction">
                    <label>
                        <input
                            type="radio"
                            name="sortOrder"
                            value="desc"
                            checked={sortOrder === 'desc'}
                            onChange={() => setSortOrder('desc')}
                        /> убыванию значимости
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="sortOrder"
                            value="asc"
                            checked={sortOrder === 'asc'}
                            onChange={() => setSortOrder('asc')}
                        /> возрастанию значимости
                    </label>
                </div>
            </div>

            <h3>Фильтры</h3>
            <div className="filters-row">
                <h4>Важность</h4>
                <div className="priority-filters filters">
                    {Object.keys(priorityFilters).map(level => (
                        <label key={level}>
                            <input
                                type="checkbox"
                                checked={priorityFilters[level]}
                                onChange={() => togglePriorityFilter(level)}
                            />
                            {level === 'CRITICAL' ? 'критическая' :
                                level === 'HIGH' ? 'высокая' :
                                    level === 'MEDIUM' ? 'средняя' : 'низкая'}
                        </label>
                    ))}
                </div>

                <h4>Срочность</h4>
                <div className="urgency-filters filters">
                    <label>
                        <input
                            type="checkbox"
                            checked={urgencyFilters.is_urgent}
                            onChange={() => toggleUrgencyFilter('is_urgent')}
                        /> срочная
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={urgencyFilters.is_overdue}
                            onChange={() => toggleUrgencyFilter('is_overdue')}
                        /> просроченная
                    </label>
                </div>
                
                <h4>Статус</h4>
                <div className="status-filters filters">
                    {Object.keys(statusFilters).map(status => (
                        <label key={status}>
                            <input
                                type="checkbox"
                                checked={statusFilters[status]}
                                onChange={() => toggleStatusFilter(status)}
                            />
                            {status === 'TODO' ? 'к выполнению' :
                                status === 'IN_PROGRESS' ? 'в работе' : 'выполнено'}
                        </label>
                    ))}
                </div>
            </div>
            <div className="buttons-container">
                <button className="reset-button form-element" onClick={resetFilters}>
                    сбросить фильтры
                </button>
                <button className="apply-button form-element" onClick={handleApply}>
                    применить
                </button>
            </div>
        </div>
    )
}

export default Filter;