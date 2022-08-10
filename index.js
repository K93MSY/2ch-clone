const express = require('express');
const session = require('express-session');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));

function writeFile(path, data) {
    const jsonStr = JSON.stringify(data);
    fs.writeFile(path, jsonStr, (err) => {
      if (err) rej(err);
      if (!err) {
        console.log('data updated!');
        console.log(data);
      }
    });
  }

  const sess = {
    secret: 'secretsecretsecret',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }
  
  if (app.get('env') === 'production') {
    app.set('trust proxy', 1)
    sess.cookie.secure = true
  }
  
  app.use(session(sess))
  
  app.use(bodyParser.urlencoded({ extended: true }));
  
  app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
  });

  app.get('/mmm', (req, res) => {
    let data = require('./data/data.json');
    res.send(data);
  });

  app.get('/reset', (req, res) => {
    let json = ([])
    writeFile('./data/data.json', json);
    res.redirect('./');
  });
  
  app.post('/message', (req, res) => {
    const username = req.body.username;
    const message = req.body.MESSAGE;
    let data = require('./data/data.json');
    data.push({username:username,message:message});
    writeFile('./data/data.json', data);
    res.redirect('./');
  });

  app.get('/main', (req, res) => {
    let data = require('./data/data.json');
    function aaa(data){
      let ck;
      let mg=0;
      const datalong = Object.keys(data).length;
      for(let i=0;i<datalong;i++){
        function cc(name){
          let k;
          if(name== undefined||name==""||name==null){
            k = "風が吹けば名無し";
            console.log("ななし")
          }else{
            k = name;
          }
          return k;
        }
        if(mg==0){/*
          let nm = 0;
          if(data[i].name==""){
            nm = "風が吹けば名無し";
          }else{
            nm = data[i].name;
          }*/
          ck = '<div class="ll"><span class="name">'+cc(data[i].username)+'</span><span class="message">'+data[i].message+'</span></div>';
          mg++;
        }else{
          ck = ck+'<div class="ll"><span class="name">'+cc(data[i].username)+'</span><span class="message">'+data[i].message+'</span></div>';
        }
      }
      return ck;
    }
    res.send('<head><link rel="stylesheet" href=./main.css /></head>'+aaa(data));
  });
  
  app.listen('3000', () => {
    console.log('Application started');
  });