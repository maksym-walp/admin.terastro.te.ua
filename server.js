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
app.use(express.static(path.join(__dirname, 'styles')));


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
                    <link rel="stylesheet" type="text/css" href="/ArticleStyles.css">
                </head>
                <body>
                    <header class="header">
                        <div class="container">
                            <div class="header_body">
                                <div class="header_burger">
                                    <span></span>
                                </div>
                                <nav class="header_menu">
                                    <ul class="header_list">
                                        <li class = "list_item">
                                            <a href="./public/index.html" class="header_link">Головна</a>
                                        </li>
                                        <li class = "list_item">
                                            <a href="./public/ter_astro_page.html" class="header_link">Терастро</a>
                                        </li>
                                        <li class = "list_item">
                                            <a href="./public/nebozvid_page.html" class="header_link">Небозвід</a>
                                        </li>
                                        <li class = "list_item">
                                            <a href="./public/lsao_page.html?category=LSAO" class="header_link">Lsao</a>
                                        </li>
                                        <li class = "list_item">
                                            <a class="dropdown-toggle header_link" data-bs-toggle="dropdown" href="./public/catalog.html" role="button" aria-expanded="false" >Статті</a>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item drop_little header_link" href="catalog.html?category=Про учасників">Про учасників</a></li>
                                                <li><a class="dropdown-item drop_little header_link" href="catalog.html?category=Події">Події</a></li>
                                                <li><a class="dropdown-item drop_little header_link" href="catalog.html?category=ЗМІ про нас">ЗМІ про нас</a></li>
                                                <li><a class="dropdown-item drop_little header_link" href="catalog.html?category=Блог">Блог</a>
                                            </ul>
                                        </li>
                                        <li class = "list_item">
                                            <a class="dropdown-toggle header_link" data-bs-toggle="dropdown" href="./public/astrophoto.html" role="button" aria-expanded="false" >Галерея</a>
                                            <ul class="dropdown-menu">
                                                <li><a class="dropdown-item drop_little header_link" href="./public/astrophoto.html">Астрофото</a></li>
                                                <li><a class="dropdown-item drop_little header_link" href="./public/astrovideo.html">Астровідео</a></li>
                                            </ul>
                                        </li>
                                        <li class = "list_item">
                                            <a href="./public/white_swan_page.html" class="header_link">White swan</a>
                                        </li>
                                        <li class = "list_item">
                                            <a href="./public/tsikavi_pos_page.html" class="header_link">Цікаві посилання</a>
                                        </li>
                                        <li class = "list_item">
                                            <a href="./public/contacts_page.html" class="header_link">Контакти</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div class="focus_box">
                                <p class="focus_word">
                                    Клуб любителів 
                                    <br>
                                    астрономії “ТерАстро”
                                </p>
                            </div>
                        </div>
                    </header>

                    <h1>${article.title}</h1>
                    <p><strong>Author:</strong> ${article.author}</p>
                    <p><strong>Content:</strong> ${article.content}</p>
                    <p><strong>Categories:</strong> ${Object.keys(article.categories).filter(category => article.categories[category]).join(', ')}</p>
                    <p><strong>Created At:</strong> ${formattedDate}</p>

                    <footer class="footer">
                        <div class="container">
                            <div class="footer_body">
                                <div class="footer_text">
                                    <h4>Про нас</h4>
                                    <div class="footer_texr">
                                        <p>
                                            Клуб любителів астрономії “ТерАстро”.
                                            Астрономічне товариство Тернопільського району “Небозвід”.
                                        </p>
                                    </div>    
                                </div>
                                <div class="logo">
                                    <img src="./public/img/logo/logo1.jpg" alt="Логотип">
                                </div>
                                <div class="footer_social_network">
                                    <a href="https://facebook.com/groups/astroTernopil/" target="_blank">
                                        <img src="./public/img/for footer/facebook.png" alt="Посилання на фейсбук">
                                    </a>
                                    <a href="https://instagram.com/astroternopil/" target="_blank">
                                        <img src="./public/img/for footer/instagram.png" alt="Посилання на інстаграм">
                                    </a>
                                    <a href="https://nebozvid.blogspot.com/" target="_blank">
                                        <img src="./public/img/for footer/blog-text.png" alt="Посилання на блогспот">
                                    </a>
                                    <a href="mailto:terastro2017@gmail.com">
                                        <img src="./public/img/for footer/envelope.png" alt="Напишіть нам!">
                                    </a>
                                </div>
                            </div>  
                        </div>
                    </footer>
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

