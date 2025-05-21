const db = require('../utils/DBConnection')

module.exports = {
    updateScore: async (username, score) => {
        try {
            const user = await db.query("SELECT * FROM users WHERE username = ?", [username]);
            const check1 = await db.query("SELECT * FROM leaderboard WHERE user_id = ?", [user[0].id]);
            if (check1.length == 0) {
                const row1 = await db.query("INSERT INTO leaderboard (user_id, user_score) VALUES (?, ?)", [user[0].id, score]);
            } else {
                const row2 = await db.query("UPDATE leaderboard SET user_score = user_score + ? WHERE user_id = ?", [score, user[0].id])
            }
            
            return {
            "isUpdated": "true",
            "username": username,
            "score": score
            }; 
        } catch (err) {
            throw err;
        } finally {
            db.close()
        }
    },
    
    getScore: async (username) => {
        try {
            const user = await db.query("SELECT * FROM users WHERE username = ?", [username]);
            const row = await db.query("SELECT * FROM leaderboard WHERE user_id = ?", [user[0].id]);
            if (row.length == 0 || typeof row[0].user_score != "number" ) {
                return {
                    "username": username,
                    "score": "N/A"
                }; 
            }

            return {
            "username": username,
            "score": row[0].user_score
            }; 
        } catch (err) {
            throw err;
        } finally {
            db.close()
        }
    }
}