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


CREATE OR REPLACE VIEW `viewEMT` AS select * from `calls`
where (`calls`.`district` = '10') order by `calls`.`callnumber` DESC;

CREATE OR REPLACE VIEW `viewPolice` AS select * from `calls`
where (`calls`.`district` != '10') order by `calls`.`callnumber` DESC;

CREATE OR REPLACE VIEW `viewShots` AS SELECT * FROM `calls`
WHERE `calltype` LIKE '%SHOTS%' OR `calltype` = 'SHOOTING' ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewDistrict1` AS SELECT * FROM `calls`
WHERE ((`district` = '1')
AND (`calltype` <> 'OUT OF SERVICE')
AND (`calltype` <> 'POLICE ADMIN')
AND (`calltype` <> 'COURT DUTY')
AND (`calltype` <> 'BUSINESS CHECK')
AND (`calltype` <> 'PARK AND WALK')
AND (`calltype` <> 'RETURN STATION')
) ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewDistrict1-walk-check` AS SELECT * FROM `calls`
WHERE ((`district` = '1')
AND ((`calltype` = 'PARK AND WALK')
OR (`calltype` = 'BUSINESS CHECK'))
) ORDER BY `callnumber` DESC;
