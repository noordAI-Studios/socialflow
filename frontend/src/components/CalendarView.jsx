// src/components/CalendarView.jsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTHS, DAYS } from '../utils/constants';
import { getStatusColor } from '../utils/helpers';

export const CalendarView = ({ 
  posts, 
  darkMode, 
  onPostDrop 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedPost, setDraggedPost] = useState(null);

  const cardBg = darkMode ? 'bg-gray-800' : 'bg-white';
  const textSecondary = darkMode ? 'text-gray-400' : 'text-gray-600';
  const borderClass = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900';

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getPostsForDate = (date) => {
    if (!date) return [];
    const dateStr = date.toISOString().split('T')[0];
    return posts.filter(post => post.publishDate === dateStr);
  };

  const handleDrop = (date, e) => {
    e.preventDefault();
    if (!draggedPost || !date) return;
    
    const newDate = date.toISOString().split('T')[0];
    onPostDrop(draggedPost.id, newDate);
    setDraggedPost(null);
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className={`${cardBg} rounded-lg border ${borderClass} p-4`}>
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => changeMonth(-1)}
          className={`p-2 rounded-lg ${inputBg} hover:opacity-80`}
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-xl font-semibold">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => changeMonth(1)}
          className={`p-2 rounded-lg ${inputBg} hover:opacity-80`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {DAYS.map(day => (
          <div key={day} className={`text-center font-semibold py-2 ${textSecondary}`}>
            {day}
          </div>
        ))}
        
        {getDaysInMonth(currentDate).map((date, index) => {
          const postsForDay = date ? getPostsForDate(date) : [];
          const isToday = date && date.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`min-h-[100px] p-2 border ${borderClass} rounded-lg ${
                !date ? 'bg-transparent' : isToday ? 'bg-blue-900/20' : ''
              }`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleDrop(date, e)}
            >
              {date && (
                <>
                  <div className={`text-sm mb-1 ${textSecondary}`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {postsForDay.map(post => (
                      <div
                        key={post.id}
                        draggable
                        onDragStart={() => setDraggedPost(post)}
                        className={`text-xs p-1 rounded cursor-move ${getStatusColor(post.status, darkMode)}`}
                        title={post.title}
                      >
                        <div className="truncate font-medium">{post.title}</div>
                        <div className="truncate opacity-75">{post.platform}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};