CREATE DATABASE IF NOT EXISTS `mpd-calldata`;
USE `mpd-calldata`;

CREATE TABLE IF NOT EXISTS `calls` (
  `callnumber` int(10) NOT NULL,
  `timestamp` char(50) NOT NULL,
  `location` char(50) NOT NULL,
  `district` char(25) NOT NULL,
  `calltype` char(25) NOT NULL,
  `status` char(25) NOT NULL,
  PRIMARY KEY (`callnumber`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE VIEW `viewEMT` AS select * from `calls` where (`calls`.`district` = '10') order by `calls`.`callnumber` desc limit 50;
CREATE VIEW `viewPolice` AS select * from `calls` where (`calls`.`district` != '10') order by `calls`.`callnumber` desc limit 50;
