import React, { Fragment, useEffect, useState } from "react";
import MetaData from "./layouts/MetaData";

const StudyMaterial = () => {
  const [booksByCategory, setBooksByCategory] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch("/api/v1/products");
        const data = await response.json();

        if (data.success) {
          setBooksByCategory(data.booksByCategory);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <Fragment>
      <MetaData title={"Study Material"} />
      <div className="head-exam">
        <h1>Study Material</h1>
      </div>
      <div>
        {loading ? (
          <p>Loading books...</p>
        ) : Object.keys(booksByCategory).length > 0 ? (
          Object.entries(booksByCategory).map(([category, books]) => {
            // Define category title mappings
            const categoryTitles = {
              NDA: "National Defence Academy",
              CDS: "Combined Defence Services",
              SSB: "Services Selection Board",
            };

            return (
              <div key={category} className="books-exam books-all">
                <div className="h3-exam h3-all">
                  {categoryTitles[category] || category}{" "}
                  {/* Default to category if not mapped */}
                </div>
                <div className="source-exam">
                  {books.map((book) => (
                    <div className="b1-exam" key={book._id}>
                      <a
                        href={book.images?.[0]?.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img src={book.images?.[0]?.url} alt="Book" />
                      </a>
                    </div>
                  ))}
                </div>
                <p className="scroll">
                  Scroll for more <img src="/images/more.svg" alt="more" />
                </p>
              </div>
            );
          })
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </Fragment>
  );
};

export default StudyMaterial; 