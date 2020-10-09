'use strict';
const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score',
      )
      .where('language.user_id', user_id)
      .first()
  },

  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count',
      )
      .where({ language_id })
  },
  getLanguageHead(db, language_id){
    return db
      .select('*')
      .from('language')
      .where({language_id})
      .join('word', {'word.id':'language.head'})
      .first();
  },
  // updateId(db, language_id){
  //   return db
  //   .from("word")
  //   .select()
  // }
  // getWordById(db, current, nextNode){
  //   return db('word')
  //     .where({ id: current.id, language_id: current.language_id})
  //     .update({
  //       correct_count: current.correct_count,
  //       incorrect_count: current.incorrect_count,
  //       memory_value: current.memory_value,
  //       next: nextNode != null ? nextNode.id: null
  //     })
  // }
  // [entraine toi, bonjour, maison, developpeur, traduire]
}

module.exports = LanguageService
