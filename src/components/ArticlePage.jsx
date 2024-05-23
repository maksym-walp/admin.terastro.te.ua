import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const ArticlePage = () => {
  const { id } = useParams();
  const [htmlContent, setHtmlContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/article/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch article');
        }
        const data = await response.text(); // Отримання HTML контенту
        setHtmlContent(data); // Оновлення стану компонента
      } catch (error) {
        setError(error.message);
        console.error('Error fetching article:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="article-page">
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
};

export default ArticlePage;
