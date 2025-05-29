import React from 'react';
import './TimetableSlot.css'; 

const TimetableSlot = ({ slotData }) => { 
  const renderEmptySlot = () => (
    <td className="timetable-slot-empty">—</td>
  );

  const renderTimeSlot = () => (
    <td className="timetable-slot-time">
      {slotData.time}
    </td>
  );

  const renderLessonSlot = () => (
    <td className="timetable-slot-lesson">
      <div className="slot-content">
        <span className="lesson-category">{slotData.type}</span>
        <h4 className="lesson-title">{slotData.subject}</h4>
        <div className="lesson-details">
          <span className="location">{slotData.place}</span>
          {slotData.teacher && (
            <span className="instructor">{slotData.teacher.name}</span>
          )}
          {slotData.groups && (
            <span className="student-group">{slotData.groups.name}</span>
          )}
        </div>
      </div>
    </td>
  );

  if (!slotData) return renderEmptySlot();
  if (slotData.time) return renderTimeSlot();
  return renderLessonSlot();
};

export default TimetableSlot;