// useExternalFilter.js
import { useCallback, useRef } from 'react';

const useExternalFilter = (fieldsToCheck) => {
  const filTypeRef = useRef('');
  const gridRef = useRef(null);

  const externalFilterChanged = useCallback((newValue) => {
    filTypeRef.current = newValue;
    if (gridRef.current) {
      gridRef.current.api.onFilterChanged();
      if (gridRef.current.api.rowModel.rowsToDisplay?.length > 0) {
        const element = document.querySelector(".ag-overlay");
        if (element) {
          document.querySelector(".ag-overlay-no-rows-wrapper").innerHTML = "";
          element.classList.add("ag-hidden");
        }
      } else {
        const element = document.querySelector(".ag-overlay");
        if (element) {
          document.querySelector(".ag-overlay-no-rows-wrapper").innerHTML = "No Record Found!";
          element.classList.remove("ag-hidden");
        }
      }
    }
  }, []);

  const isExternalFilterPresent = useCallback(() => {
    return filTypeRef.current && filTypeRef.current?.length > 0;
  }, []);

  const doesExternalFilterPass = useCallback(
    (node) => {
      const searchValue = filTypeRef.current;
      if (!searchValue) return true; // If no filter value, pass all rows
      return fieldsToCheck.some(field => {
        const value = node.data[field];
        return value ? value?.toLowerCase()?.includes(searchValue?.toLowerCase()) : false;
      });
    },
    []
  );

  return {
    externalFilterChanged,
    isExternalFilterPresent,
    doesExternalFilterPass,
    gridRef,
  };
};

export default useExternalFilter;
