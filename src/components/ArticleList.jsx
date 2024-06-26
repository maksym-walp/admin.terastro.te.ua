import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './stylles/ArticleList.css';

//articles temp storage init
const ArticleList = () => {
  const [articles, setArticles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const navigate = useNavigate();

  //get all articles from server
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

  const handleViewArticle = (id) => {
    navigate(`/article/${id}`);
  };

  const confirmDeleteArticle = (id) => {
    setArticleToDelete(id);
    setShowModal(true);
  };

  const handleDeleteArticle = async () => {
    if (articleToDelete) {
      try {
        const response = await fetch(`/delete-article/${articleToDelete}`, { method: 'DELETE' });
        if (response.ok) {
          setArticles(articles.filter(article => article.id !== articleToDelete));
          setShowModal(false);
          setArticleToDelete(null);
        } else {
          console.error('Failed to delete article');
        }
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setArticleToDelete(null);
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
              <td>{new Date(article.createdAt).toLocaleDateString()}</td>
              <td>
                <button className='button view-button' onClick={() => handleViewArticle(article.id)}>
                  View
                </button>
                <button className='button delete-button' onClick={() => confirmDeleteArticle(article.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this article?</p>
            <button onClick={handleDeleteArticle}>Delete</button>
            <button onClick={handleCancelDelete}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleList;
