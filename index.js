const { log } = require('console');
const fs = require('fs');
const http = require('http');
const { type } = require('os');
const { default: slugify } = require('slugify');
const url = require('url');
const replacetemplates = require('./modules/replacetemplates');




///////////////////////// SERVERS ///////////////////////

//this files are only read when the application rrestarts
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');


const data = fs.readFileSync(`${__dirname}/dev data/data.json`, 'utf-8');
const productData = JSON.parse(data);


const server = http.createServer((req, res) => {
    // const pathName = req.url

    console.log(req.url);
    console.log(url.parse(req.url, true));
    const { query, pathname } = url.parse(req.url, true);

    const slugs = productData.map(el => slugify(el.productName, { lower: true }));
    console.log(slugs);




    //////////////////////////////////////Overview Page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'content-type': 'text/html' });

        const cardsHtml = productData.map(el =>
            replacetemplates(tempCard, el)
        ).join('');
        // converting from an array to a string

        const output = tempOverview.replace(/{%PRODUCTCARDS%}/g, cardsHtml);
        res.end(output);


        /////////////////////////////////////Product Page
    } else if (pathname === '/product') {
        console.log(query);
        const product = productData[query.id];
        console.log(product);
        const output = replacetemplates(tempProduct, product);
        res.end(output);

        //building our API
    } else if (pathname === '/api') {
        //specifying to the browser that we are sending back JSON
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(data);

        //Not found
    } else {
        //if we specify an unknown request,we implement an error
        res.writeHead(404, {
            //the content type header,by specifying html,the browser will expect html code 
            'content-type': 'text / html',
            // creating our own headers
            'my-own-header': 'Hello world'
        });
        res.end('<h1>Page not found!</h1>');
    }
});
server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests on port 800');
});