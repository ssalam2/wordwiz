const express = require('express')
const cookieParser = require('cookie-parser');

const router = express.Router() // < - - - Primary router

router.use(express.urlencoded({ extended: true }))
router.use(express.json()); 
router.use(cookieParser());

const { generateToken, removeToken, TokenMiddleware } = require('../middleware/TokenMiddleware');
const UserDAO = require('../daos/UserDAO');
const WordBankDAO = require('../daos/WordBankDAO');
const LeaderboardDAO = require('../daos/LeaderboardDAO');

/* USER ROUTES */
router.post('/users/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password; 
  if (username !== '' && password !== '') {
    UserDAO.getUserByCredentials(username, password).then((user) => {
      console.log("here in login post!")
      generateToken(req, res, user);
      res.json({user: user});
    })
    .catch((error) => {
      console.log("here in login error!")
      const statusCode = typeof error.code === 'number' ? error.code : 500;
      res.status(statusCode).json({ error: error.message });
    }); 
  }
  else {
    res.status(400).json({error: 'Credentials not provided'});
  }

});

// router.post('/guest/login', (req, res) => {
//   const user = { "username": "guest" }
//   try {
//     generateToken(req, res, user);
//     res.json({user: user});
//   } catch (error) {
//     const statusCode = typeof error.code === 'number' ? error.code : 500;
//     res.status(statusCode).json({ error: error.message });
//   }
// });

router.post('/register', (req, res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPass = req.body.confirmPassword; 

  if (username == '' || email == '' || password == '' || confirmPass == '') {
    return res.status(400).json({error: "One or more of the fields are empty"});
  }

  //add code to validate that fields follow proper constraints 
  if (username.length < 6) { return res.status(400).json({error: "Username must be at least 6 characters"}); }
  if (username.length > 20) { return res.status(400).json({error: "Username must be less than 21 characters"}); }

  if (email.length > 30) { return res.status(400).json({error: "Email must be less than 31 characters"}); }

  if (password.length > 255) { return res.status(400).json({error: "Password must be less than 256 characters"}); }

  if (confirmPass !== password) {
    return res.status(400).json({error: "Passwords do not match"});
  }

  // Consulted DeepSeek in generating regex
  // I am largely inexperienced with regex so the only way I could specify my pattern
  // was doing this pseudo-regex ' *@*email.com where the '*' represent any value without spaces'
  const regex = /^[^\s@]+@email\.com$/;
  if (!regex.test(email)) {
    return res.status(400).json({error: "Incorrect email format"});
  }
  
  UserDAO.createUser(username, password, email).then((user) => {
    generateToken(req, res, user);
    res.status(200).json({user: user});
  })
  .catch((error) => {
    if (error.message === "Username already in use") {
      return res.status(400).json({error: "Username already in use"}); 
    }
    else if (error.code === 500) {
      return res.status(error.code).json({error: error.message});
    }
  })
});

router.post('/logout', (req, res) => {
  removeToken(req, res);
  res.status(200).json({success: true}); 
});

/* USER PROFILE ROUTES */
router.get('/users/getCurrentUser', TokenMiddleware, (req, res) => {
  const user = req.user

  UserDAO.getCurrentUser(user.username).then((user) => {
    res.status(200).json(user)
  })
  .catch((error) => {
    return res.status(error.code).json({error: error.message});
  })
})

// router.patch('/users/updateUsername', TokenMiddleware, (req, res) => {
//   const user = req.user
//   const newUsername = req.body.newUsername

//   if (newUsername.length < 6) { return res.status(400).json({error: "Username must be at least 6 characters"}); }
//   if (newUsername.length > 20) { return res.status(400).json({error: "Username must be less than 21 characters"}); }

//   UserDAO.updateUsername(user.username, newUsername).then((user) => {
//     res.status(200).json(user)
//   })
//   .catch((error) => {
//     if (error.code === 500) {
//       return res.status(error.code).json({error: error.message});
//     }
//   })
// })

router.patch('/users/updatePassword', TokenMiddleware, (req, res) => {
  const user = req.user
  const newPassword = req.body.newPassword

  if (newPassword.length > 255) { return res.status(400).json({error: "Password must be less than 256 characters"}); }

  UserDAO.updatePassword(user.username, newPassword).then((user) => {
    res.status(200).json(user)
  })
  .catch((error) => {
    if (error.code === 500) {
      return res.status(error.code).json({error: error.message});
    }
  })
})

router.patch('/users/updateEmail', TokenMiddleware, (req, res) => {
  const user = req.user
  const newEmail = req.body.newEmail

  if (newEmail.length > 30) { return res.status(400).json({error: "Email must be less than 31 characters"}); }

  const regex = /^[^\s@]+@email\.com$/;
  if (!regex.test(newEmail)) {
    return res.status(400).json({error: "Incorrect email format"});
  }

  UserDAO.updateEmail(user.username, newEmail).then((user) => {
    res.status(200).json(user)
  })
  .catch((error) => {
    if (error.code === 500) {
      return res.status(error.code).json({error: error.message});
    }
  })
})

router.patch('/users/updateDescription', TokenMiddleware, (req, res) => {
  const user = req.user
  const newDescription = req.body.newDescription

  if (newDescription.length > 600) { return res.status(400).json({error: "Description must be less than 601 characters"}); }

  UserDAO.updateDescription(user.username, newDescription).then((user) => {
    res.status(200).json(user)
  })
  .catch((error) => {
    if (error.code === 500) {
      return res.status(error.code).json({error: error.message});
    }
  })
})

/* WORDBANK ROUTES */
router.post('/users/addWordBank', TokenMiddleware, (req, res) => {
  const user = req.user
  const wbname = req.body.wbname
  const description = req.body.description

  if (wbname.length > 20) { return res.status(400).json({error: "Wordbank name must be less than 21 characters"}); }
  if (description.length > 600) { return res.status(400).json({error: "Description must be less than 601 characters"}); }

  WordBankDAO.addWordBank(user.username, wbname, description).then((wordbank) => {
    res.status(200).json(wordbank)
  })
  .catch((error) => {
    if (error.code === 500) {
      return res.status(error.code).json({error: error.message});
    }
  })
})

router.get('/users/retrieveWordBanks', TokenMiddleware, (req, res) => {
  const user = req.user
  WordBankDAO.getWordBanks(user.username).then((wordbanks) => {
    res.status(200).json(wordbanks)
  })
  .catch((error) => {
    if (error.code === 500) {
      return res.status(error.code).json({error: error.message});
    }
  })
})

router.delete('/users/deleteWordBank/:id', TokenMiddleware, (req, res) => {
  const id = req.params.id
  WordBankDAO.deleteWordBank(id).then((wordbank) => {
    res.status(200).json(wordbank)
  })
  .catch((error) => {
    if (error.code === 500) {
      return res.status(error.code).json({error: error.message});
    }
  })
})

router.patch('/users/updateWordBankName/:id', TokenMiddleware, (req, res) => {
  const id = req.params.id
  const newwbName = req.body.newwbName

  if (newwbName.length > 20) { return res.status(400).json({error: "Wordbank name must be less than 21 characters"}); }

  WordBankDAO.updateWordBankName(id, newwbName).then((wordbank) => {
    res.status(200).json(wordbank)
  })
  .catch((error) => {
    if (error.code === 500) {
      return res.status(error.code).json({error: error.message});
    }
  })
})

router.patch('/users/updateWordBankDescription/:id', TokenMiddleware, (req, res) => {
  const id = req.params.id
  const newwbDescription = req.body.newwbDescription

  if (newwbDescription.length > 600) { return res.status(400).json({error: "Description must be less than 601 characters"}); }

  WordBankDAO.updateWordBankDescription(id, newwbDescription).then((wordbank) => {
    res.status(200).json(wordbank)
  })
  .catch((error) => {
    if (error.code === 500) {
      return res.status(error.code).json({error: error.message});
    }
  })
})

/* WORD SPECIFIC ROUTES */
router.post('/users/wordbanks/:id/addWord', TokenMiddleware, (req, res) => {
  const id = req.params.id
  const word = req.body.word

  if (word.length > 20) { return res.status(400).json({error: "Word must be less than 21 characters"}); }

  WordBankDAO.addWord(id, word).then((word) => {
    res.status(200).json(word)
  })
  .catch((error) => {
    return res.status(error.code).json({error: error.message});
  })
})

router.delete('/users/wordbanks/:wordbank_id/deleteWord/:word_id', TokenMiddleware, (req, res) => {
  const wordbank_id = req.params.wordbank_id
  const word_id = req.params.word_id
  WordBankDAO.deleteWord(wordbank_id, word_id).then((word) => {
    res.status(200).json(word)
  })
  .catch((error) => {
    return res.status(error.code).json({error: error.message});
  })
})

router.get('/users/wordbanks/:id/retrieveWords', TokenMiddleware, (req, res) => {
  const id = req.params.id
  WordBankDAO.getWords(id).then((words) => {
    res.status(200).json(words)
  })
  .catch((error) => {
    return res.status(error.code).json({error: error.message});
  })
})

router.get('/users/wordbanks/:wordbank_id/retrieveWordHint/:word_id', TokenMiddleware, (req, res) => {
  const wordbank_id = req.params.wordbank_id
  const word_id = req.params.word_id
  WordBankDAO.getWordHint(wordbank_id, word_id).then((words) => {
    res.status(200).json(words)
  })
  .catch((error) => {
    return res.status(error.code).json({error: error.message});
  })
})

router.patch('/users/wordbanks/:wordbank_id/updateWordHint/:word_id', TokenMiddleware, (req, res) => {
  const wordbank_id = req.params.wordbank_id
  const word_id = req.params.word_id
  const newHint = req.body.newHint

  if (newHint.length > 600) { return res.status(400).json({error: "Hint must be less than 601 characters"}); }

  WordBankDAO.updateWordHint(wordbank_id, word_id, newHint).then((words) => {
    res.status(200).json(words)
  })
  .catch((error) => {
    return res.status(error.code).json({error: error.message});
  })
})

router.patch('/leaderboard/ranks/updateScore', TokenMiddleware, (req, res) => {
  const user = req.user
  const score = req.body.score
  
  LeaderboardDAO.updateScore(user.username, score).then((user) => {
    res.status(200).json(user)
  })
  .catch((error) => {
    return res.status(error.code).json({error: error.message});
  })
})

router.get('/leaderboard/ranks/getScore', TokenMiddleware, (req, res) => {
  const user = req.user
  
  LeaderboardDAO.getScore(user.username).then((score) => {
    res.status(200).json(score)
  })
  .catch((error) => {
    return res.status(error.code).json({error: error.message});
  })
})

/* TODO: Feature to remove multiple words at once? */

module.exports = router