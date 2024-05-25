#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter a number (1 for vanilla, 2 for frontend, 3 for backend): ', (answer) => {
    switch (parseInt(answer, 10)) {
        case 1:
            createVanillaFiles();
            break;
        case 2:
            createFrontendFiles();
            break;
        case 3:
            createBackendFiles();
            break;
        default:
            console.log('Invalid selection. Please enter 1, 2, or 3.');
            rl.close();
            break;
    }
});

function createVanillaFiles() {
    fs.writeFile('index.html', '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Document</title><link rel="stylesheet" href="style.css"><script src="script.js"></script></head><body></body></html>', (err) => {
        if (err) {
            console.error(`Error creating index.html: ${err.message}`);
        } else {
            console.log('index.html created successfully.');
        }
    });

    fs.writeFile('style.css', '', (err) => {
        if (err) {
            console.error(`Error creating style.css: ${err.message}`);
        } else {
            console.log('style.css created successfully.');
        }
    });

    fs.writeFile('script.js', '', (err) => {
        if (err) {
            console.error(`Error creating script.js: ${err.message}`);
        } else {
            console.log('script.js created successfully.');
        }
    });

    rl.close();
}

function createFrontendFiles() {
    fs.mkdir('frontend-app', { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating frontend directory: ${err.message}`);
            rl.close();
            return;
        }
        console.log('frontend directory created successfully.');

        // fs.writeFile('frontend/index.html', '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>React App</title></head><body><div id="root"></div><script src="bundle.js"></script></body></html>', (err) => {
        //     if (err) {
        //         console.error(`Error creating frontend/index.html: ${err.message}`);
        //     } else {
        //         console.log('frontend/index.html created successfully.');
        //     }
        // });

        exec('npx create-react-app frontend-app', (err, stdout, stderr) => {
            if (err) {
                console.error(`Error creating React app: ${err.message}`);
            } else {
                console.log(stdout);
                console.log('React app created successfully.');
            }
            rl.close();
        });
    });
}

function createBackendFiles() {
    fs.mkdir('backend', { recursive: true }, (err) => {
        if (err) {
            console.error(`Error creating backend directory: ${err.message}`);
            rl.close();
            return;
        }
        console.log('backend directory created successfully.');

        const packageJson = `{
    "name": "backend",
    "version": "1.0.0",
    "main": "index.js",
    "scripts": {
        "start": "node index.js"
    },
    "dependencies": {
        "express": "^4.17.1"
    }
}`;

        fs.writeFile('backend/package.json', packageJson, (err) => {
            if (err) {
                console.error(`Error creating backend/package.json: ${err.message}`);
                rl.close();
                return;
            }
            console.log('backend/package.json created successfully.');

            const indexJsContent = `const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello from  kairvee World!');
});

app.listen(port, () => {
    console.log(\`Server is running at http://localhost:\${port}\`);
});`;

            fs.writeFile('backend/index.js', indexJsContent, (err) => {
                if (err) {
                    console.error(`Error creating backend/index.js: ${err.message}`);
                    rl.close();
                    return;
                }
                console.log('backend/index.js created successfully.');

                execPromise('cd backend && npm install')
                    .then(stdout => {
                        console.log(stdout);
                        console.log('Dependencies installed successfully.');
                        return execPromise('cd backend && npm start');
                    })
                    .then(stdout => {
                        console.log(stdout);
                        console.log('Server started successfully.');
                        rl.close();
                    })
                    .catch(err => {
                        console.error(`Error: ${err.message}`);
                        rl.close();
                    });
            });
        });
    });
}

function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else {
                resolve(stdout);
            }
        });
    });
}
