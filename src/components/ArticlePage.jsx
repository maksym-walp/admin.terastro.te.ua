// ArticlePage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/article?id=${id}`, {
          headers: { 'Accept': 'text/html' } // Додано заголовок Accept
        });
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.text(); // Отримати вміст статті у форматі HTML
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [id]);

  return (
    <div className="article-page">
      {article ? (
        <div dangerouslySetInnerHTML={{ __html: article }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ArticlePage;
