import { useState, useEffect, useCallback } from 'react';
import { fetchTimetable } from './api/timetableService';
import TimetableGrid from './components/Timetable/TimetableGrid';
import styles from './App.module.css';

const TimetableApp = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [activeEntity, setActiveEntity] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(null);
  const [entitiesData, setEntitiesData] = useState({ 
    academicGroups: {}, 
    teachingStaff: {} 
  });

  const DEFAULT_GROUP_ID = "1282690279";

  const extractWeekNumber = useCallback((weekInfo) => {
    return weekInfo ? Number(weekInfo.match(/\d+/)?.[0]) : null;
  }, []);

  const initializeData = useCallback(async () => {
    try {
      const [groupData, teacherData] = await Promise.all([
        fetch('/academic-groups.json').then(r => r.json()),
        fetch('/teaching-staff.json').then(r => r.json())
      ]);

      const defaultGroup = Object.entries(groupData)
        .find(([_, id]) => id === DEFAULT_GROUP_ID);
      
      if (defaultGroup) {
        setActiveEntity({ 
          identifier: DEFAULT_GROUP_ID, 
          entityType: "academicGroup", 
          displayName: defaultGroup[0] 
        });
      }

      setEntitiesData({
        academicGroups: groupData,
        teachingStaff: teacherData
      });
    } catch (err) {
      console.error('Data initialization failed:', err);
    }
  }, []);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const normalizedQuery = query.toLowerCase();
    const matches = [];

    Object.entries(entitiesData.academicGroups).forEach(([name, id]) => {
      if (name.toLowerCase().includes(normalizedQuery)) {
        matches.push({ 
          identifier: id, 
          displayName: name, 
          entityType: 'academicGroup' 
        });
      }
    });

    Object.entries(entitiesData.teachingStaff).forEach(([name, id]) => {
      if (name.toLowerCase().includes(normalizedQuery)) {
        matches.push({ 
          identifier: id, 
          displayName: name, 
          entityType: 'teachingStaff' 
        });
      }
    });

    setSearchResults(matches);
  }, [query, entitiesData]);

  const { timetable, isLoading, fetchError } = fetchTimetable(
    activeEntity && { 
      entityType: activeEntity.entityType, 
      entityId: activeEntity.identifier, 
      week: currentWeek 
    }
  );

  useEffect(() => {
    if (timetable?.currentWeek) {
      setCurrentWeek(extractWeekNumber(timetable.currentWeek));
    }
  }, [timetable, extractWeekNumber]);

  const handleEntitySelect = (entity) => {
    setActiveEntity(entity);
    setQuery(entity.displayName);
    setSearchResults([]);
  };

  const adjustWeek = (adjustment) => {
    setCurrentWeek(prev => {
      if (prev === null) return null;
      const newWeek = prev + adjustment;
      return newWeek < 1 ? 1 : newWeek;
    });
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.headerSection}>
        <h1 className={styles.mainTitle}>
          Academic Schedule: {activeEntity?.displayName || "Select Entity"}
        </h1>
        
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Search for group or instructor"
            className={styles.searchField}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {searchResults.length > 0 && (
            <ul className={styles.resultsDropdown}>
              {searchResults.map((result, idx) => (
                <li 
                  key={idx} 
                  className={styles.resultItem}
                  onClick={() => handleEntitySelect(result)}
                >
                  {result.displayName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.weekControls}>
          <span className={styles.weekIndicator}>
            {currentWeek !== null ? `Week ${currentWeek}` : 'Loading...'}
          </span>
          <div className={styles.weekButtons}>
            <button
              onClick={() => adjustWeek(-1)}
              className={styles.weekNavButton}
              disabled={!activeEntity || isLoading || currentWeek === null || currentWeek <= 1}
            >
              ◀ Previous Week
            </button>
            <button
              onClick={() => adjustWeek(1)}
              className={styles.weekNavButton}
              disabled={!activeEntity || isLoading || currentWeek === null}
            >
              Next Week ▶
            </button>
          </div>
        </div>
      </div>

      {fetchError && (
        <div className={styles.errorNotification}>
          Error loading data: {fetchError.message}
        </div>
      )}

      {timetable && <TimetableGrid timetableData={timetable} />}
    </div>
  );
};

export default TimetableApp;