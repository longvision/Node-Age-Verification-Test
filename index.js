const express = require('express')
const nunjucks = require('nunjucks')

const app = express()

nunjucks.configure('views', {
  autoscape: true,
  express: app,
  watch: true
})

app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'njk')

// Middleware
const checkMiddleware = (req, res, next) => {
  // Imprime no console dados das requisicoes.
  console.log(
    `HOST: ${req.headers.host} | URL: ${req.url} | METHOD: ${req.method}`
  )
  // Caso o campo de idade esteja vazio, permanece na página.
  req.query.age === '' ? res.render('age') : next()
}

// Rota do formulário inicial
app.get('/', (req, res) => {
  return res.render('age')
})

// Rota que redireciona para a página correta( maior de idade, ou menor de idade)
app.get('/check', checkMiddleware, (req, res) => {
  if (req.query.age >= 18 && req.query.age > 0) {
    return res.redirect('/major/?age=' + req.query.age)
  }
  if (req.query.age < 18 && req.query.age > 0) {
    return res.redirect('/minor/?age=' + req.query.age)
  }
  if (req.query.age <= 0) {
    return res.redirect('/ops/?age=' + req.query.age)
  }
})

// Rota caso a idade digitada seja negativa.
app.get('/ops', checkMiddleware, (req, res) => {
  if (req.query.age == -1) {
    return res.render('ops', { age: req.query.age, anos: 'ano' })
  }
  if (req.query.age < -1) {
    return res.render('ops', { age: req.query.age, anos: 'anos' })
  }
  if (req.query.age == 0) {
    return res.render('ops2')
  }
})

// Rota que mostra a página de maior de idade.
app.get('/major', checkMiddleware, (req, res) => {
  return res.render('major', { age: req.query.age })
})

// Rota que mostra a página de menor de idade.
app.get('/minor', checkMiddleware, (req, res) => {
  return res.render('minor', { age: req.query.age })
})

app.listen(3000)
