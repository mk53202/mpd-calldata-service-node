SET NAMES utf8;
SET time_zone = '-05:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

#DROP DATABASE IF EXISTS `mpd-calldata`;
CREATE DATABASE `mpd-calldata`;
USE `mpd-calldata`;

DROP TABLE IF EXISTS `calls`;
CREATE TABLE `calls` (
  `callnumber` int(10) NOT NULL,
  `timestamp` char(50) NOT NULL,
  `location` char(50) NOT NULL,
  `district` int(2) NOT NULL,
  `calltype` char(25) NOT NULL,
  `status` char(25) NOT NULL,
  PRIMARY KEY (`callnumber`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
