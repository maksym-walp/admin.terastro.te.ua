//file ArticlePage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/article?id=${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.json(); // Отримання даних статті у форматі JSON
        setArticle(data); // Оновлення стану компонента
      } catch (error) {
        console.error('Error fetching article:', error);
      }
    };

    fetchArticle();
  }, [id]);

  return (
    <div className="article-page">
      {article ? (
        <div>
          <h2>{article.title}</h2>
          <p>Author: {article.author}</p>
          <p>Created At: {new Date(article.createdAt).toLocaleString()}</p>
          <p>Content: {article.content}</p>
          <p>Categories: {article.categories.join(', ')}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ArticlePage;
