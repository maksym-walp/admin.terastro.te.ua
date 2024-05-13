//ArticleForm.jsx
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './stylles/ArticleForm.css';

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
        console.log('Article saved successfully!');
      } else {
        console.error('Failed to save article');
      }
    } catch (error) {
      console.error('Error saving article:', error);
    }
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
       <div
        className='article-checkbox'>
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
      <ReactQuill
        className='article-content'
        value={content}
        onChange={setContent}
        modules={{
          toolbar: [
            [{'size': ['small', false, 'large', 'huge']}], //вибір розміру
            ['bold', 'italic', 'underline', 'strike'], //жирний-курсив-підкреслений-перекреслений
            [{ 'color': [] }, { 'background': [] }], //колір тексту та колір виділення
            [{'align': []}], //центрування тексту
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}], //список, відступ
            [{ 'script': 'sub'}, { 'script': 'super' }], //індекси верхні-нижній
            ['blockquote', 'code-block'], //цитата-код
            ['link', 'image', 'video', 'formula'], //посилання-картинка-відео-формула
            ['clean'] //очитити форматування
          ],
        }}
      />
      <button type="submit">Зберегти статтю</button>
    </form>
  );
};

export default ArticleForm;
