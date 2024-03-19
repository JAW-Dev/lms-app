import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash.debounce';
// Components
import { Main } from '../components/layouts/Layouts';
import Pagination from '../components/Pagination';
import SearchInput from '../components/SearchInput';
// Helpers
import Button from '../components/Button';
// Hooks
import useResponsive from '../hooks/useResponsive';

const BookSummariesContent = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useCallback(debounce(setSearch, 300), []);

  useEffect(() => () => {
    debouncedSearch.cancel();
  }, []);

  useEffect(() => {
    fetch(
      `https://admiredleadership.com/wp-json/wp/v2/book-summary?per_page=10&page=${currentPage}&search=${search.replaceAll(
        ' ',
        '+'
      )}`
    )
      .then((response) => {
        // Get the total number of pages from the 'X-WP-TotalPages' header
        setTotalPages(Number(response.headers.get('X-WP-TotalPages')));
        return response.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, [currentPage, search]);

  const { isTablet, isMobile } = useResponsive();

  const cardStyles = {
    borderRadius: '32px',
    backgroundColor: '#F6F5F5',
    gap: '18px',
    fontSize: '12px',
    lineHeight: '16px',
    fontFamily: 'Nunito Sans',
    width: isTablet ? 'calc(100% - 24px)' : 'calc(50% - 24px)',
    flexDirection: isMobile ? 'column' : 'row',
    color: '#3c3c3c',
  };

  const imageStyles = {
    width: '119px',
    height: '180px',
    margin: isMobile ? 'auto' : '0',
  };

  return (
    <>
      <h1
        style={{ fontSize: '48px' }}
        className="text-charcoal font-extrabold  mb-4"
      >
        Book Summaries
      </h1>

      <div className="flex flex-wrap content-start mb-6">
        <SearchInput setSearchQuery={debouncedSearch} />
      </div>
      <div
        className="flex flex-wrap content-start mb-12 justify-between"
        style={{ gap: '24px' }}
      >
        {posts &&
          posts?.map((post) => (
            <div
              key={crypto.randomUUID()}
              className="p-6 flex"
              style={cardStyles}
            >
              <img
                src={post.uagb_featured_image_src.medium[0]}
                style={imageStyles}
                alt={post.title.rendered}
              />
              <div className="flex flex-col justify-between pt-2">
                <div>
                  <h2
                    className="mb-1"
                    style={{
                      fontSize: '14px',
                      lineHeight: '20px',
                      fontWeight: '900',
                    }}
                    dangerouslySetInnerHTML={{ __html: post.title.rendered }}
                  />
                  <p className="mb-3">{post.subtitle}</p>
                  <p className="mb-3">{post.book_author}</p>
                  <p
                    className="mb-3"
                    dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                  />
                </div>
                <div className="pt-4 flex flex-col justify-end items-end flex-1 flex-wrap content-end">
                  <Button type="button" href={post.link} variant="purpleText">
                    Read Summary
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPage={totalPages}
        onPageChange={setCurrentPage}
      />
    </>
  );
};

const options = {
  layout: 'full',
  content: <BookSummariesContent />,
  wrapperClasses: 'flex justify-center',
  innerStyle: { width: '100%', maxWidth: '1400px' },
};

const BookSummaries = () => <Main options={options} />;

export default BookSummaries;
