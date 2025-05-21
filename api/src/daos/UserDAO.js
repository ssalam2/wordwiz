// Built on top of the Day21 Activity
//for generating hashed password
const crypto = require('crypto');
const db = require('../utils/DBConnection')

// Recommended by ChatGPT to promisify pbkdf2Async so that
// a callback function is not necessary, making it easier
// to use the resulting hash to query the db in createUser function
const { promisify } = require("util"); 

const pbkdf2Async = promisify(crypto.pbkdf2);

module.exports = {
  // testInsert: async () => {
  //   let conn;
  //   try {
  //     conn = await pool.getConnection();
  //     console.log("Connected to DB");
  //     const result = await conn.query("INSERT INTO users (username, user_password, salt) VALUES (?, ?, ?)", ["testuser", "testpass", "testsalt"]);
  //     console.log("Insert successful:", result);
  //     return; 
  //   } catch (err) {
  //     console.error("Insert failed:", err);
  //   } finally {
  //     if (conn) conn.release();
  //   }
  // },
  getUserByCredentials: async (username, password) => {
    try {
        const user = await db.query("SELECT username, user_password, salt, email FROM users WHERE username = ?", [username])
        if (user.length == 0) {
          const err = new Error("No such user");
          throw err;
        }

        console.log(user)

        const derivedKey = await pbkdf2Async(password, user[0].salt, 100000, 64, 'sha512')
        const digest = derivedKey.toString('hex');

        if (user[0].user_password === digest) {
          const userObj = {"username": user[0].username};
          return userObj; 
        }
        else {
          const err = new Error("Invalid password");
          err.code = 401;
          throw err; 
        }
    } catch (err) {
        throw err;
    } finally {
      db.close()
    }
  },

  getCurrentUser: async (username) => {
    try {
        const user = await db.query("SELECT username, email FROM users WHERE username = ?", [username])
        return {
          "user": user
        }
    } catch (err) {
        throw err;
    } finally {
      db.close()
    }
  },

  createUser: async (username, password, email) => {
    console.log("made it here to createuser")
    try {
      const user = await db.query("SELECT username, user_password, salt, email FROM users WHERE username = ?", [username])
      if (user.length > 0) {
        const err = new Error("Username already in use");
        err.code = 401; 
        throw err; 
      }

      //generate salt
      const salt = crypto.randomBytes(16).toString("hex");
 
      //hash the password then query the database to store the newly created user info
      //Code from ChatGPT
      const derivedKey = await pbkdf2Async(password, salt, 100000, 64, 'sha512');
      const digest = derivedKey.toString("hex"); 
      
      //result may be useful for debugging
      const result = await db.query("INSERT INTO users (username, user_password, salt, email) VALUES (?, ?, ?, ?)", [username, digest, salt, email])

      //not sure what to return on success, so i just return a json object with the users username
      const userObj = {"username": username}; 
      return userObj; 
    } catch (err) {
        throw err;
    } finally {
      db.close()
    }
  },

  // updateUsername: async (username, newUsername) => {
  //   try {
  //     // row for debug purposes
  //     const row = await db.query("UPDATE users SET username = ? WHERE username = ?", [newUsername, username]);

  //     const userObj = {"isUpdated": "true", "username": newUsername}; 
  //     return userObj; 
  // } catch (err) {
  //     throw err;
  // } finally {
  //     db.close()
  // }
  // },

  updateEmail: async (username, newEmail) => {
    try {
      const user = await db.query("UPDATE users SET email = ? WHERE username = ?", [newEmail, username]);

      const userObj = {"isUpdated": "true", "email": newEmail}; 
      return userObj; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  updatePassword: async (username, newPassword) => {
    try {
      //generate salt
      const salt = crypto.randomBytes(16).toString("hex");
 
      //hash the password then query the database to store the newly created user info
      //Code from ChatGPT
      const derivedKey = await pbkdf2Async(newPassword, salt, 100000, 64, 'sha512');
      const digest = derivedKey.toString("hex");

      const user = await db.query("UPDATE users SET user_password = ?, salt = ? WHERE username = ?", [digest, salt, username]);

      // Not putting new password in JSON
      const userObj = {"isUpdated": "true"}; 
      return userObj; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  },

  updateDescription: async (username, newDescription) => {
    try {
      // row for debug purposes
      const row = await db.query("UPDATE users SET description = ? WHERE username = ?", [newDescription, username]);

      const userObj = {"isUpdated": "true", "description": newDescription}; 
      return userObj; 
    } catch (err) {
        throw err;
    } finally {
        db.close()
    }
  }
};


