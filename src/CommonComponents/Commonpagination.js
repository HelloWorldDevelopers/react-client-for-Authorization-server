


export function handlePageSizeChange(newPageSize, setPageSize, gridContainerRef) {
    function setGridHeight(pageSize) {
        if (pageSize === 20 || pageSize === 50) {
            if (gridContainerRef.current) {
                gridContainerRef.current.style.height = '383px';
                gridContainerRef.current.style.width = '100.8%';
                gridContainerRef.current.style.overflowY = 'scroll';
            }
        } else {
            if (gridContainerRef.current) {
                gridContainerRef.current.style.height = '';
            }
        }
    };
    setGridHeight(newPageSize);
    setPageSize(newPageSize)
};



