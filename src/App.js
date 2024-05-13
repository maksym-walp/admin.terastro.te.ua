import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ArticleList from './components/ArticleList';
import ArticleForm from './components/ArticleForm';
import ArticleGrid from './components/ArticleGrid';
import ArticlePage from './components/ArticlePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Відображення ArticleForm та ArticleGrid на головній сторінці */}
          <Route path="/" element={<>
            <ArticleForm />
            <ArticleGrid />
          </>} />
          {/* Додаткові маршрути, якщо вони потрібні */}
          <Route path="/list" element={<ArticleList />} />
          {/* <Route path="/article/:id" element={<ArticlePage />} /> */}
          <Route path="/article" element={<ArticlePage />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
