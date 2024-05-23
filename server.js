//file server.js

//import modules and dependencies
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const HTTP = require('http');
const ARTICLES_DIR = 'articles';

//creating app and server at http://127.1.2.89:3000/
const app = express();
const WebServer = HTTP.createServer(app);
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.1.2.89';

//express limit setting and build connecting
app.use(express.json({ limit: '50mb' })); // збільште значення до потрібного розміру
app.use(express.urlencoded({ limit: '50mb', extended: true })); // для обробки форм з великими даними
app.use(express.static('build'));

//starting server
WebServer.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
});

//saving articles via post
app.post('/save-article', async (req, res) => {
    //gettin article data
    const { title, content, categories } = req.body;
    const author = req.body.author || 'default author';
    const createdAt = new Date().toISOString();

    try {
        //create articles folder if it doesnt exist
        await fs.mkdir(ARTICLES_DIR, { recursive: true });

        //getting list of existing articles
        const articles = await fs.readdir(ARTICLES_DIR);

        //unique ID geneeration
        const id = articles.length + 1;

        //file name generation
        const fileName = `${id}-${title.replace(/ /g, '_')}.json`;

        //saving article
        const filePath = path.join(ARTICLES_DIR, fileName);
        await fs.writeFile(filePath, JSON.stringify({ id, title, content, author, createdAt, categories }, null, 2));
        res.status(200).send('Article saved successfully!');

    } catch (error) {
        //error handling
        console.error('Error saving article:', error);
        res.status(500).send('Failed to save article');
    }  
});

//geting all articles list via get
app.get('/get-articles', async (req, res) => {
    try {
        //array with all articles data initialization
        const articles = [];

        //read all files in the articles directory
        const files = await fs.readdir(ARTICLES_DIR);

        //read content of each article file
        for (const file of files) {
            const filePath = path.join(ARTICLES_DIR, file);
            const data = await fs.readFile(filePath);
            const article = JSON.parse(data);

            //adding content to articles array
            const { id, title, author, createdAt, categories } = article;
            articles.push({ id, title, author, createdAt, categories });
        }

        //sending array to client
        res.status(200).json({ articles });

    } catch (error) {
        //error handling
        console.error('Error getting articles:', error);
        res.status(500).send('Failed to get articles');
    }
});

// Update the article route to use path parameter instead of query parameter
app.get('/article/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Read the article file with the corresponding ID
    const files = await fs.readdir(ARTICLES_DIR);
    const articleFile = files.find(file => file.startsWith(`${id}-`));

    if (!articleFile) {
      return res.status(404).send('Article not found');
    }

    const filePath = path.join(ARTICLES_DIR, articleFile);
    const data = await fs.readFile(filePath);
    const article = JSON.parse(data);

    // Generate HTML content for the article
    const htmlContent = `
      <html>
        <head>
          <title>${article.title}</title>
        </head>
        <body>
          <h1>${article.title}</h1>
          <p><strong>Author:</strong> ${article.author}</p>
          <p><strong>Content:</strong> ${article.content}</p>
          <p><strong>Categories:</strong> ${Object.keys(article.categories).filter(category => article.categories[category]).join(', ')}</p>
          <p><strong>Created At:</strong> ${article.createdAt}</p>
        </body>
      </html>
    `;

    // Send the HTML content
    res.status(200).send(htmlContent);
  } catch (error) {
    console.error('Error getting article:', error);
    res.status(500).send('Failed to get article');
  }
});
