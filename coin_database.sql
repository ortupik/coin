-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.1.21-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             9.3.0.4984
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Dumping structure for table coin_database.user
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `password` text NOT NULL,
  `activation_code` text NOT NULL,
  `user_role` enum('user','admin') NOT NULL DEFAULT 'user',
  `time_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.


-- Dumping structure for table coin_database.user_data
CREATE TABLE IF NOT EXISTS `user_data` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL DEFAULT '0',
  `setup_2fa` enum('Y','N') NOT NULL DEFAULT 'N',
  `add_bank_Account` enum('Y','N') NOT NULL DEFAULT 'N',
  `verify_identity` enum('Y','N') NOT NULL DEFAULT 'N',
  `upload_docs` enum('Y','N') NOT NULL DEFAULT 'N',
  `complete` enum('Y','N') NOT NULL DEFAULT 'N',
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.


-- Dumping structure for table coin_database.user_details
CREATE TABLE IF NOT EXISTS `user_details` (
  `user_id` int(11) DEFAULT NULL,
  `country` varchar(50) DEFAULT '',
  `state` varchar(50) DEFAULT '',
  `fname` varchar(50) DEFAULT '',
  `mname` varchar(50) DEFAULT '',
  `lname` varchar(50) DEFAULT '',
  `city` varchar(50) DEFAULT '',
  `ssn` varchar(50) DEFAULT '',
  `dob` varchar(50) DEFAULT '',
  `occupation` varchar(50) DEFAULT '',
  `unit` varchar(50) DEFAULT '',
  `zip` varchar(50) DEFAULT '',
  `id_type` varchar(50) DEFAULT '',
  `address` varchar(50) DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- Data exporting was unselected.
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
