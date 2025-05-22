//The APIClient.js implementation was adapted from Day19 activity APIClient.js file
import HTTPClient from './HTTPClient.js';

const BASE_API_PATH = './api';

/* USER ROUTES */
const logIn = (username, password) => {
    const data = {
        username: username,
        password: password
    };
    return HTTPClient.post(`${BASE_API_PATH}/users/login`, data);
};

const guestLogIn = () => {
    return HTTPClient.post(`${BASE_API_PATH}/guest/login`, {});
}

const register = (username, email, password, confirmPassword) => {
    const data = {
        username: username,
        email: email,
        password: password,
        confirmPassword: confirmPassword
    };
    return HTTPClient.post(`${BASE_API_PATH}/register`, data);
}

const logOut = () => {
    return HTTPClient.post(`${BASE_API_PATH}/logout`, {});
}

/* USER PROFILE ROUTES */
const getCurrentUser = () => {
    return HTTPClient.get(`${BASE_API_PATH}/users/getCurrentUser`);
}

// const updateUsername = (newUsername) => {
//     const data = {
//         newUsername: newUsername
//     };
//     return HTTPClient.patch(`${BASE_API_PATH}/users/updateUsername`, data);
// }

const updatePassword = (newPassword) => {
    const data = {
        newPassword: newPassword
    };
    return HTTPClient.patch(`${BASE_API_PATH}/users/updatePassword`, data);
}

const updateEmail = (newEmail) => {
    const data = {
        newEmail: newEmail
    };
    return HTTPClient.patch(`${BASE_API_PATH}/users/updateEmail`, data);
}

const updateDescription = (newDescription) => {
    const data = {
        newDescription: newDescription
    };
    return HTTPClient.patch(`${BASE_API_PATH}/users/updateDescription`, data);
}

/* WORDBANK ROUTES */
const addWordBank = (wbname, description) => {
    const data = {
        wbname: wbname,
        description: description
    };
    return HTTPClient.post(`${BASE_API_PATH}/users/addWordBank`, data);
}

const retrieveWordBanks = () => {
    return HTTPClient.get(`${BASE_API_PATH}/users/retrieveWordBanks`);
}

const deleteWordBank = (id) => {
    return HTTPClient.delete(`${BASE_API_PATH}/users/deleteWordBank/${id}`, {});
}

const updateWordBankName = (id, newwbName) => {
    const data = {
        newwbName: newwbName
    };
    return HTTPClient.patch(`${BASE_API_PATH}/users/updateWordBankName/${id}`, data);
}

const updateWordBankDescription = (id, newwbDescription) => {
    const data = {
        newwbDescription: newwbDescription
    };
    return HTTPClient.patch(`${BASE_API_PATH}/users/updateWordBankDescription/${id}`, data);
}

/* WORD SPECIFIC ROUTES */
const addWord = (id, word) => {
    const data = {
        word: word
    };
    return HTTPClient.post(`${BASE_API_PATH}/users/wordbanks/${id}/addWord`, data);
}

const getWords = (id) => {
    return HTTPClient.get(`${BASE_API_PATH}/users/wordbanks/${id}/retrieveWords`);
}

const deleteWord = (wordbank_id, word_id) => {
    return HTTPClient.delete(`${BASE_API_PATH}/users/wordbanks/${wordbank_id}/deleteWord/${word_id}`, {});
}

const getWordHint = (wordbank_id, word_id) => {
    return HTTPClient.get(`${BASE_API_PATH}/users/wordbanks/${wordbank_id}/retrieveWordHint/${word_id}`);
}

const updateWordHint = (wordbank_id, word_id, newHint) => {
    const data = {
        newHint: newHint
    };
    return HTTPClient.patch(`${BASE_API_PATH}/users/wordbanks/${wordbank_id}/updateWordHint/${word_id}`, data);
}

const updateScore = (score) => {
    const data = {
        score: score
    };
    return HTTPClient.patch(`${BASE_API_PATH}/leaderboard/ranks/updateScore`, data);
}

const getScore = () => {
    return HTTPClient.get(`${BASE_API_PATH}/leaderboard/ranks/getScore`);
}

export default {
    logIn,
    guestLogIn,
    register,
    logOut,
    getCurrentUser,
    updateEmail,
    updatePassword,
    updateDescription,
    addWordBank,
    retrieveWordBanks,
    deleteWordBank,
    updateWordBankName,
    updateWordBankDescription,
    addWord,
    getWords,
    deleteWord,
    getWordHint,
    updateWordHint,
    updateScore,
    getScore
};