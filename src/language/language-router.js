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
      const wordsList = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      );
      const linkedList = new linkedListService.LinkedList();
      for(let i = 0; i < wordsList.length; i++){
        linkedList.push(wordsList[i]);
      }
      const firstWord = linkedList.head.value;
      // incorrect guess
      if(guess !== firstWord.translation){
        linkedList.updateIncorrect();
        linkedList.shift(firstWord.memory_value);
        linkedList.updateIdAndNext(firstWord.id, firstWord.next);
        res.status(200).json({
          nextWord: wordsList[1].original,
          wordCorrectCount: firstWord.correct_count,
          wordIncorrectCount: firstWord.incorrect_count,
          totalScore: req.language.total_score,
          answer: firstWord.translation,
          isCorrect: false
        })
      }
      // correct guess
      if(guess === firstWord.translation){
        linkedList.updateCorrect();
        linkedList.shift(firstWord.memory_value);
        linkedList.updateIdAndNext(firstWord.id, firstWord.next);
        await LanguageService.updateLanguageTotalScore(
          req.app.get('db'),
          req.language.id,
          req.language.total_score +=1
        )
        res.status(200).json({
          nextWord: wordsList[1].original,
          wordCorrectCount: firstWord.correct_count,
          wordIncorrectCount: firstWord.incorrect_count,
          totalScore: req.language.total_score,
          answer: firstWord.translation,
          isCorrect: true
        })
      }
      let newWordsList = [];
      let current = linkedList.head;
      let i = 0;
      while(i < wordsList.length){
        newWordsList.push(current.value);
        current = current.next;
        i++
      }
      // update words table
      for(let i = 0; i < newWordsList.length; i++){
        await LanguageService.updateWordTable(req.app.get('db'), newWordsList[i]);
      }
      res.status(200).json({
        wordsList,
        newWordsList
      })
    } catch (error) {
      next(error)
    }
   
  })

module.exports = languageRouter
