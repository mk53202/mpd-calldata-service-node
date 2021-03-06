CREATE DATABASE IF NOT EXISTS `mpd-calldata`;
USE `mpd-calldata`;

CREATE TABLE IF NOT EXISTS `calls` (
  `callnumber` int(10) NOT NULL,
  `timestamp` datetime() NOT NULL,
  `location` char(50) NOT NULL,
  `district` char(25) NOT NULL,
  `calltype` char(25) NOT NULL,
  `status` char(25) NOT NULL,
  `lat` double(9,6) NOT NULL,
  `lon` double(9,6) NOT NULL,
  PRIMARY KEY (`callnumber`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE OR REPLACE VIEW `viewEMT` AS SELECT * from `calls`
WHERE (`calls`.`district` = '10') ORDER BY `calls`.`callnumber` DESC;

CREATE OR REPLACE VIEW `viewPolice` AS SELECT * from `calls`
WHERE (`calls`.`district` != '10') ORDER BY `calls`.`callnumber` DESC;

CREATE OR REPLACE VIEW `viewPolice-noDistrict1` AS SELECT * from `calls`
WHERE ((`calls`.`district` != '1') AND (`calls`.`district` != '10')) ORDER BY `calls`.`callnumber` DESC;

CREATE OR REPLACE VIEW `viewPolice-walk-check` AS SELECT * FROM `viewPolice`
WHERE ((`calltype` = 'PARK AND WALK') OR (`calltype` = 'BUSINESS CHECK'))
ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewShots` AS SELECT * FROM `calls`
WHERE ((`calltype` LIKE 'SHOT%') OR (`calltype` = 'SHOOTING'))
ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewDistrict1-nojunk` AS SELECT * FROM `calls`
WHERE ((`district` = '1')
AND (`calltype` <> 'OUT OF SERVICE')
AND (`calltype` <> 'POLICE ADMIN')
AND (`calltype` <> 'COURT DUTY')
AND (`calltype` <> 'BUSINESS CHECK')
AND (`calltype` <> 'PARK AND WALK')
AND (`calltype` <> 'SPECIAL ASSIGN')
AND (`calltype` <> 'TAVERN CHECK')
AND (`calltype` <> 'RETURN STATION')
) ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewDistrict1-walk-check` AS SELECT * FROM `calls`
WHERE ((`district` = '1')
AND ((`calltype` = 'PARK AND WALK')
OR (`calltype` = 'SPECIAL ASSIGN')
OR (`calltype` = 'TAVERN CHECK')
OR (`calltype` = 'BUSINESS CHECK'))
) ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewDistrict1-streets` AS SELECT * FROM `calls`
WHERE ((`district` = '1') OR (`district` = '10'))
AND ((`location` LIKE '%HUMBOLDT%')
OR (`location` LIKE '%PEARSON%')
OR (`location` LIKE '%BRADY%')
OR (`location` LIKE '%HAMILTON%')
OR (`location` LIKE '%ASTOR%'))
ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewDistrict1-entry` AS SELECT * FROM `calls`
WHERE (`district` = '1')
AND (`calltype` LIKE '%ENTRY%')
ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewMomDad` AS SELECT * FROM `calls`
WHERE ((`district` = '6') OR (`district` = '10'))
AND ((`location` LIKE '%OKLAHOMA%')
OR (`location` LIKE '%MANITOBA%'))
ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewDead` AS SELECT * FROM `calls`
WHERE (`calltype` LIKE '%DEAD ON ENTRY%')
ORDER BY `callnumber` DESC;    
    
CREATE OR REPLACE VIEW `viewTableSize` AS SELECT table_schema AS "Database",
ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS "Size (MB)"
FROM information_schema.TABLES
GROUP BY table_schema;
