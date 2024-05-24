import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './stylles/ArticleForm.css';

// Modal component
const Modal = ({ show, onClose, articleId }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Статтю збережено успішно!</h2>
        <p>Переглянути її можна за наступним посиланням:</p>
        <a href={`/article/${articleId}`} target="_blank" rel="noopener noreferrer">Переглянути статтю</a>
        <button onClick={onClose}>Закрити</button>
      </div>
    </div>
  );
};

const ArticleForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState({
    'LSAO': false,
    'Про учасників': false,
    'Події': false,
    'Про нас': false,
    'Блог': false
  });
  const [savedArticleId, setSavedArticleId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCategories(prevCategories => ({
      ...prevCategories,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/save-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, categories }),
      });
      if (response.ok) {
        const data = await response.json();
        setSavedArticleId(data.id);
        setShowModal(true);
      } else {
        console.error('Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <form className="article-form" onSubmit={handleSubmit}>
      <input
        className='article-title'
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className='article-checkbox'>
        {Object.entries(categories).map(([category, checked]) => (
          <label key={category}>
            <input
              className='article-checkbox-item'
              type="checkbox"
              name={category}
              checked={checked}
              onChange={handleCheckboxChange}
            />
            {category}
          </label>
        ))}
      </div>
      <a href="https://design.te.ua/tools/rozkladka/" target="_blank" rel="noopener noreferrer">Змінити розкладку клавіатури</a>
      <ReactQuill
        className='article-content'
        value={content}
        onChange={setContent}
        modules={{
          toolbar: [
            [{'size': ['small', false, 'large', 'huge']}],
            ['bold', 'italic', 'underline', 'strike'],
            [{'color': []}, {'background': []}],
            [{'align': []}],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            [{'script': 'sub'}, {'script': 'super'}],
            ['blockquote', 'code-block'],
            ['link', 'image', 'video', 'formula'],
            ['clean']
          ],
        }}
      />
      <button type="submit">Зберегти статтю</button>
      <Modal show={showModal} onClose={closeModal} articleId={savedArticleId} />
    </form>
  );
};

export default ArticleForm;
