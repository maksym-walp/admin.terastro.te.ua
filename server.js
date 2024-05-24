const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const HTTP = require('http');
const ARTICLES_DIR = 'articles';
const TRASH_DIR = 'trash';

const app = express();
const WebServer = HTTP.createServer(app);
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '127.1.2.89';

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('build'));

WebServer.listen(PORT, HOST, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/save-article', async (req, res) => {
    const { title, content, categories } = req.body;
    const author = req.body.author || 'default author';

    // Get current date and format it as YYYY-MM-DD
    const createdAt = new Date().toISOString().split('T')[0];

    try {
        await fs.mkdir(ARTICLES_DIR, { recursive: true });

        const articles = await fs.readdir(ARTICLES_DIR);

        // Create a set of occupied IDs
        const occupiedIds = new Set(
            articles.map(file => parseInt(file.split('-')[0], 10))
        );

        // Find the first available ID greater than 0
        let id = 1;
        while (occupiedIds.has(id)) {
            id++;
        }

        const fileName = `${id}-${title.replace(/ /g, '_')}.json`;

        const filePath = path.join(ARTICLES_DIR, fileName);
        await fs.writeFile(filePath, JSON.stringify({ id, title, content, author, createdAt, categories }, null, 2));
        res.status(200).json({ message: 'Article saved successfully!', id });
    } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).send('Failed to save article');
    }
});



app.get('/get-articles', async (req, res) => {
    try {
        const articles = [];
        const files = await fs.readdir(ARTICLES_DIR);

        for (const file of files) {
            const filePath = path.join(ARTICLES_DIR, file);
            const data = await fs.readFile(filePath);
            const article = JSON.parse(data);
            const { id, title, author, createdAt, categories } = article;
            articles.push({ id, title, author, createdAt, categories });
        }

        res.status(200).json({ articles });
    } catch (error) {
        console.error('Error getting articles:', error);
        res.status(500).send('Failed to get articles');
    }
});

app.get('/article/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const files = await fs.readdir(ARTICLES_DIR);
        const articleFile = files.find(file => file.startsWith(`${id}-`));

        if (!articleFile) {
            return res.status(404).send('Article not found');
        }

        const filePath = path.join(ARTICLES_DIR, articleFile);
        const data = await fs.readFile(filePath);
        const article = JSON.parse(data);

        // Reformat the createdAt date to DD-MM-YYYY
        const [year, month, day] = article.createdAt.split('-');
        const formattedDate = `${day}-${month}-${year}`;

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
                    <p><strong>Created At:</strong> ${formattedDate}</p>
                    <button onclick="deleteArticle(${article.id})">Delete</button>
                    <script>
                      async function deleteArticle(id) {
                        const response = await fetch('/delete-article/' + id, { method: 'DELETE' });
                        if (response.ok) {
                          alert('Article deleted successfully!');
                          window.location.href = '/';
                        } else {
                          alert('Failed to delete article');
                        }
                      }
                    </script>
                </body>
            </html>
        `;

        res.status(200).send(htmlContent);
    } catch (error) {
        console.error('Error getting article:', error);
        res.status(500).send('Failed to get article');
    }
});

app.delete('/delete-article/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const files = await fs.readdir(ARTICLES_DIR);
        const articleFile = files.find(file => file.startsWith(`${id}-`));

        if (!articleFile) {
            return res.status(404).send('Article not found');
        }

        await fs.mkdir(TRASH_DIR, { recursive: true });
        const filePath = path.join(ARTICLES_DIR, articleFile);
        const trashPath = path.join(TRASH_DIR, articleFile);

        await fs.rename(filePath, trashPath);

        res.status(200).send('Article moved to trash successfully');
    } catch (error) {
        console.error('Error moving article to trash:', error);
        res.status(500).send('Failed to move article to trash');
    }
});

