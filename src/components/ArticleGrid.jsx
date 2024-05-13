//ArticleGrid
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import striptags from 'striptags';
import './stylles/ArticleGrid.css';

const ArticleGrid = () => {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('/get-articles')
      .then(response => response.json())
      .then(data => setArticles(data.articles))
      .catch(error => console.error('Error fetching articles:', error));
  }, []);

  return (
    <div className="article-grid">
      {articles.map(article => (
        <div key={article.id} className="article-card">
          <h3>{article.title}</h3>
          <div>{striptags(article.content).substring(0, 50)}...</div>
          <p>{article.author}</p>
          <p>{new Date(article.createdAt).toLocaleDateString()}</p>
          <Link to={`/article?id=${article.id}`}>Розгорнути</Link>
        </div>
      ))}
    </div>
  );
};

export default ArticleGrid;
