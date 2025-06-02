import React from 'react';

const DifficultyRating = ({ difficulty }) => {
  const icons = [];

  // Full icons
  for (let i = 0; i < difficulty; i++) {
    icons.push(<i key={`full-${i}`} className="bx bx-dumbbell" style={{ color: '#4caf50' }}></i>);
  }

  // Empty icons
  for (let i = 0; i < 5 - difficulty; i++) {
    icons.push(<i key={`empty-${i}`} className="bx bx-dumbbell" style={{ color: '#cfd8dc' }}></i>);
  }

  return <div style={{ display: 'flex', gap: '2px' }}>{icons}</div>;
};

export default DifficultyRating;