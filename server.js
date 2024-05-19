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
