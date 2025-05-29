import React from 'react';
import TimetableSlot from '../timetableSlot/timetableSlot'; 
const TimetableRow = ({ daySchedule }) => { 
  return (
    <tr className="timetable-day-row">
      {daySchedule.periods.map((timeslot, idx) => ( 
        <TimetableSlot key={`slot-${idx}`} slotData={timeslot} />
      ))}
    </tr>
  );
};

export default TimetableRow;