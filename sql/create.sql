CREATE DATABASE IF NOT EXISTS `mpd-calldata`;
USE `mpd-calldata`;

--
-- CREATE TABLEs
--

CREATE TABLE IF NOT EXISTS `calls` (
  `callnumber` int(10) NOT NULL,
  `timestamp` char(50) NOT NULL,
  `location` char(50) NOT NULL,
  `district` char(25) NOT NULL,
  `calltype` char(25) NOT NULL,
  `status` char(25) NOT NULL,
  PRIMARY KEY (`callnumber`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- CREATE VIEWs
--

CREATE OR REPLACE VIEW `viewEMT` AS SELECT * from `calls`
WHERE (`calls`.`district` = '10') ORDER BY `calls`.`callnumber` DESC;

CREATE OR REPLACE VIEW `viewPolice` AS SELECT * from `calls`
WHERE (`calls`.`district` != '10') ORDER BY `calls`.`callnumber` DESC;

CREATE OR REPLACE VIEW `viewPolice-walk-check` AS SELECT * FROM `viewPolice`
WHERE ((`calltype` = 'PARK AND WALK') OR (`calltype` = 'BUSINESS CHECK'))
ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewShots` AS SELECT * FROM `calls`
WHERE ((`calltype` = 'SHOTS FIRED') OR (`calltype` = 'SHOOTING'))
ORDER BY `callnumber` DESC;

CREATE OR REPLACE VIEW `viewDistrict1-nojunk` AS SELECT * FROM `calls`
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

--
-- CREATE INDEXs
--

CREATE INDEX idx_district ON calls (district);
CREATE INDEX idx_calltype ON calls (calltype);

-- ALTER TABLE calls
-- DROP INDEX idx_district;
-- ALTER TABLE calls
-- DROP INDEX idx_calltype;
