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
      if(!guess) return res.status(400).json({
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
      let firstWord = linkedList.head.value;
      let nextWord = linkedList.head.next.value;
      let score = req.language.total_score;
      let isCorrect = false;
      // incorrect guess
      if(guess !== firstWord.translation){
        linkedList.updateIncorrect();
      }
      
      // correct guess
      
      if(guess === firstWord.translation){
        await LanguageService.updateLanguageTotalScore(
          req.app.get('db'),
          req.language.id,
          req.language.total_score +=1
        )
        linkedList.updateCorrect();
        score +=1;
        isCorrect = true;
      }
      linkedList.shift(firstWord.memory_value);
      await linkedList.updateIdAndNext(firstWord.id, firstWord.next);
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
        nextWord: nextWord.original,
        totalScore: score,
        wordCorrectCount: nextWord.correct_count,
        wordIncorrectCount: nextWord.incorrect_count,
        answer: firstWord.translation,
        isCorrect: isCorrect
      })
    } catch (error) {
      next(error)
    }
   
  })

module.exports = languageRouter
