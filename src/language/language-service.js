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
      .select('*')
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
  updateWordTable(db, word){
    return db
      .select('*')
      .from('word')
      .where('id', word.id)
      .update({
        'id': word.id,
        'original': word.original,
        'translation': word.translation,
        'memory_value': word.memory_value,
        'correct_count': word.correct_count,
        'incorrect_count': word.incorrect_count,
        'language_id': word.language_id,
        'next': word.next
      })
  },
  updateLanguageTotalScore(db, language_id, totalScore){
    return db
      .select('total_score')
      .from('language')
      .where('id', language_id)
      .update('total_score', totalScore);
  }


}

module.exports = LanguageService
