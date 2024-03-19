import React from 'react';
import useResponsive from '../hooks/useResponsive';

const Pagination = ({ currentPage, totalPage, onPageChange }) => {
  const { isTablet } = useResponsive();
  const maxVisiblePages = isTablet ? 2 : 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPage, startPage + maxVisiblePages - 1);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="pagination w-full flex justify-center mt-4">
      <button
        type="button"
        onClick={() => handlePageChange(currentPage - 1)}
        className={`hover:bg-white-faint  ${currentPage === 1 && 'hidden'}`}
      >
        <i className="far fa-chevron-left mr-2" />
        Prev
      </button>

      {startPage > 1 && (
        <>
          <button type="button" onClick={() => handlePageChange(1)}>
            1
          </button>
          <span>...</span>
        </>
      )}

      {Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
      ).map((page) => (
        <button
          type="button"
          key={page}
          onClick={() => handlePageChange(page)}
          className={`hover:bg-white-faint ${
            page === currentPage ? 'font-semibold bg-white-faint' : ''
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPage && (
        <>
          <span>...</span>
          <button
            type="button"
            className="hover:bg-white-faint"
            onClick={() => handlePageChange(totalPage)}
          >
            {totalPage}
          </button>
        </>
      )}

      <button
        type="button"
        className={`hover:bg-white-faint  ${currentPage === 1 && 'hidden'}`}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
        <i className="far fa-chevron-right ml-2" />
      </button>
    </div>
  );
};

export default Pagination;
