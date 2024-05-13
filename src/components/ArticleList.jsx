import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylles/ArticleList.css';

const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch('/get-articles');
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles);
        } else {
          console.error('Failed to fetch articles');
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const handleView = (id) => {
    navigate(`/article/${id}`);
  };

  return (
    <div>
      <h2>Article List</h2>
      <table className='article-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Author</th>
            <th>Categories</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, index) => (
            <tr key={index}>
              <td>{article.id}</td>
              <td>{article.title}</td>
              <td>{article.author}</td>
              <td>
                {Object.entries(article.categories)
                  .filter(([_, value]) => value === true)
                  .map(([category]) => category)
                  .join(', ')}
              </td>
              <td>{new Date(article.createdAt).toLocaleString()}</td>
              <td>
                <button onClick={() => handleView(article.id)}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ArticleList;
