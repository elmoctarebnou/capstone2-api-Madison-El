'use strict';
const express = require('express')
const LanguageService = require('./language-service')
const linkedListService = require('./linked-list-service')
const { requireAuth } = require('../middleware/jwt-auth')
const languageRouter = express.Router()
const jsonBodyParser = express.json()



languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )
      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })
      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })
languageRouter
.get('/head', async (req, res, next) => {
    try {
      const nextWord = await LanguageService.getLanguageHead(
        req.app.get("db"),
        req.language.id
      )
      res.json({
        nextWord: nextWord.original,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
        totalScore: req.language.total_score
      });
      next();
    }catch(error){
      next(error);
  }
});

languageRouter
  .post('/guess', jsonBodyParser, async (req, res, next) => {
    try {
      const {guess} = req.body;
      if(!guess) res.status(400).send({
        error: `Missing 'guess' in request body`,
      })
      const linkedList = new linkedListService.LinkedList();
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )
      
      res.send(words);
    } catch (error) {
      next(error)
    }
   
  })

module.exports = languageRouter
