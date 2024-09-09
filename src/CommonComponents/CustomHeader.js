import React from 'react';

const CustomHeader = (props) => {
  const { displayName, enableSorting, column } = props;

  // Function to handle sort change
  const onSortRequested = (order, event) => {
    props.progressSort(event.shiftKey);
  };

  return (
    <div className="custom-header">
      <span>{displayName}</span>
      {enableSorting && (
        <span>
          <div
            onClick={(event) => onSortRequested('asc', event)}
            className={`sort-arrow ${column.getSort() === 'asc' ? 'active' : ''}`}
          >
            ▲
          </div>
          <div
            onClick={(event) => onSortRequested('desc', event)}
            className={`sort-arrow ${column.getSort() === 'desc' ? 'active' : ''}`}
          >
            ▼
          </div>
        </span>
      )}
    </div>
  );
};

export default CustomHeader;