const db = require('../utils/DBConnection')

module.exports = {
  getWordBanks: async (username) => {
      try {
        const wordbanks = await db.query("SELECT * FROM wordbanks WHERE ? = username", [username]);
        return { "wordbanks": wordbanks }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  addWordBank: async (username, wbname, description) => {
      try {
        const check = await db.query("SELECT * FROM wordbanks WHERE name = ? AND username = ?", [wbname, username]);
        if (check.length > 0) {
          const err = new Error("Wordbank already exists");
          err.code = 400;
          throw err; 
        }

        await db.query("INSERT INTO wordbanks (name, description, username) VALUES (?, ?, ?)", [wbname, description, username]);
        const wordbank = await db.query("SELECT * FROM wordbanks WHERE name = ? AND username = ?", [wbname, username]);
        return {
          "wordbank": wordbank
        }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  deleteWordBank: async (id) => {
    try {
      // wordbank for debug purposes
      const wordbank = await db.query("DELETE FROM wordbanks WHERE id = ?", [id]);
      return {
        "isDeleted": "true",
        "id": id
      }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  updateWordBankName: async (id, newwbName) => {
    try {
      // row for debug purposes
      const row = await db.query("UPDATE wordbanks SET name = ? WHERE id = ?", [newwbName, id]);
      return {
        "isUpdated": "true",
        "newName": newwbName,
        "id": id
      }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  updateWordBankDescription: async (id, newwbDescription) => {
    try {
      // row for debug purposes
      const row = await db.query("UPDATE wordbanks SET description = ? WHERE id = ?", [newwbDescription, id]);
      return {
        "isUpdated": "true",
        "newDescription": newwbDescription,
        "id": id
      }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  addWord: async (id, word) => {
    try {
      const wordbank = await db.query("SELECT * FROM wordbanks WHERE id = ?", [id])
      if (wordbank[0].bank_size == 25) {
        const err = new Error("Max size reached! Cannot add word");
        err.code = 400;
        throw err; 
      }
      const check = await db.query("SELECT * FROM words WHERE word = ?", [word])
      if (check.length == 0) {
        await db.query("INSERT INTO words (word) VALUES (?)", [word])
      }
      
      const wordid = await db.query("SELECT * FROM words WHERE word = ?", [word])
      const check2 = await db.query("SELECT * FROM wordbankwords WHERE wordbank_id = ? AND word_id = ?", [id, wordid[0].id])
      if (check2.length > 0) {
        const err = new Error("Word already exists inside wordbank");
        err.code = 400;
        throw err; 
      }
      await db.query("INSERT INTO wordbankwords (wordbank_id, word_id) VALUES (?, ?)", [id, wordid[0].id])
      await db.query("UPDATE wordbanks SET bank_size = bank_size + 1 WHERE id = ?", [id])
      return {
        "id:": id,
        "word_name": word
      }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  getWords: async (id) => {
    try {
      // Consulted DeepSeek on how to structure JOIN with junction table
      // I was already working with this "SELECT * FROM words JOIN wordbankwords ON id = word_id;"
      // I used the feedback to restructure my query since it didn't really get words according to the passed in id
      console.log(id)
      const words = await db.query("SELECT w.id, w.word AS word_name FROM words w JOIN wordbankwords wbw ON w.id = wbw.word_id WHERE wbw.wordbank_id = ?", [id]);
      return { "words": words }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  deleteWord: async (wordbank_id, word_id) => {
    try {
      // row for debug purposes
      const row = await db.query("DELETE FROM wordbankwords WHERE wordbank_id = ? AND word_id = ?", [wordbank_id, word_id])
      await db.query("UPDATE wordbanks SET bank_size = bank_size - 1 WHERE id = ?", [wordbank_id])
      return {
        "isDeleted": "true",
        "wordbank_id": wordbank_id,
        "word_id": word_id
      }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  getWordHint: async (wordbank_id, word_id) => {
    try {
      const hint = await db.query("SELECT * FROM wordbankwords WHERE wordbank_id = ? AND word_id = ?", [wordbank_id, word_id])
      return {
        "hint": hint[0].word_hint
      }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  updateWordHint: async (wordbank_id, word_id, newHint) => {
    try {
      // row for debug purposes
      const row = await db.query("UPDATE wordbankwords SET word_hint = ? WHERE wordbank_id = ? AND word_id = ?", [newHint, wordbank_id, word_id])
      return {
        "hint": newHint
      }; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  }

  // deleteWordGlobally: async (word) => {
  //   let conn; 
  //   try {
  //     conn = await pool.getConnection();
  //     await conn.query("DELETE FROM word WHERE word = ?", [word])
  //     return {
  //       "deleted": "true",
  //       "word": word
  //     }; 
  //   } catch (err) {
  //       throw err;
  //   } finally {
  //       if (conn) conn.release(); // Return connection to the pool
  //   }
  // }
};


