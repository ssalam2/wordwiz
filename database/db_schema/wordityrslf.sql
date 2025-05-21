CREATE TABLE IF NOT EXISTS `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL UNIQUE,
  `description` varchar(600) DEFAULT NULL,
  `email` varchar(30) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `salt` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE IF NOT EXISTS `wordbanks` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) NOT NULL,
  `description` varchar(600) DEFAULT NULL,
  `bank_size` int(10) DEFAULT 0,
  `username` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_USERNAME` (`username`),
  CONSTRAINT `FK_USERNAME` FOREIGN KEY (`username`) REFERENCES `users` (`username`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `words` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `word` varchar(20) NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `wordbankwords` (
  `wordbank_id` int(10) unsigned NOT NULL,
  `word_id` int(10) unsigned NOT NULL,
  `word_hint` varchar(600) DEFAULT NULL,
  PRIMARY KEY (`wordbank_id`, `word_id`),
  KEY `FK_WORDBANK_ID` (`wordbank_id`),
  CONSTRAINT `FK_WORDBANK_ID` FOREIGN KEY (`wordbank_id`) REFERENCES `wordbanks` (`id`) ON DELETE CASCADE,
  KEY `FK_WORD_ID` (`word_id`),
  CONSTRAINT `FK_WORD_ID` FOREIGN KEY (`word_id`) REFERENCES `words` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `leaderboard` (
  `user_id` int(10) unsigned NOT NULL,
  `user_rank` int(10) unsigned DEFAULT NULL,
  `user_score` int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `FK_USER_ID` (`user_id`),
  CONSTRAINT `FK_USER_ID` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;