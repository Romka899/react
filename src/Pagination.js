import React from 'react';

const Pagination = ({ currentPage, totalPages, handlePageChange, itemsPerPage, handleItemsPerPageChange }) => {
  const generatePagination = () => {
    const pages = [];
    pages.push(1);

    if (currentPage > 4) {
      pages.push('...');
    }

    const start = Math.max(2, currentPage - 2);
    const end = Math.min(totalPages - 1, currentPage + 2);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 3) {
      pages.push('...');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePagination();

  return (
    <div className="pagination">
      {pages.map((page, index) => (
        <button
          key={index}
          onClick={() => handlePageChange(page)}
          className={currentPage === page ? 'active' : ''}
          disabled={page === '...'}
        >
          {page}
        </button>
      ))}

      <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
        <option value={1}>1 элемент</option>
        <option value={6}>6 элементов</option>
        <option value={12}>12 элементов</option>
        <option value={17}>17 элементов</option>
        <option value={18}>18 элементов</option>
      </select>
    </div>
  );
};


export default Pagination;