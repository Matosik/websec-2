import React from 'react';
import TimetableDay from '../timetableDay/timetableDay';
import styles from './TimetableGrid.module.css';

const TimetableGrid = ({ timetableData }) => {
  if (!timetableData) return <div className={styles.noData}>Нет данных для отображения</div>;

  const [firstDay, ...remainingDays] = timetableData.days;

  return (
    <div className={styles.gridContainer}>
      <div className={styles.gridScrollWrapper}>
        <table className={styles.gridTable}>
          <thead>
            <tr>
              <th className={styles.timeHeader}>Время</th>
              {firstDay.sessions.map((day, idx) => (
                <th key={`day-${idx}`} className={styles.dayHeader}>
                  <div className={styles.dayName}>{day.weekday}</div>
                  <div className={styles.dayDate}>{day.date}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {remainingDays.map((daySchedule, dayIdx) => (
              <TimetableDay 
                key={`day-schedule-${dayIdx}`} 
                daySchedule={daySchedule} 
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimetableGrid;