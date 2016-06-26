-- db changes for 0.3.6.0

ALTER TABLE competitions
ADD onlineRegistrationEnd timestamp without time zone;
ALTER TABLE competitions
ADD onlineRegistrationPossible boolean default false;
ALTER TABLE competitions
ADD onlineRegistrationKey character varying(255);
-- --------------------------------------
CREATE TABLE onlineRegistrations
(
  uuid character varying(255) NOT NULL,
  deleted boolean NOT NULL,
  saved timestamp without time zone,
  synced timestamp without time zone,
  alias character varying(255),
  club character varying(255),
  country character varying(255),
  deviceid character varying(255),
  email character varying(255),
  firstname character varying(255),
  lastname character varying(255),
  phone character varying(255),
  competition_uuid character varying(255) NOT NULL,
  CONSTRAINT onlineRegistration_pkey PRIMARY KEY (uuid),
  CONSTRAINT onlineRegistration_fk_competition FOREIGN KEY (competition_uuid)
      REFERENCES competitions (uuid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE onlineRegistrations
  OWNER TO postgres;
-- --------------------------------------
  CREATE TABLE onlineRegistrations_classes
(
  onlineRegistration_uuid character varying(255) NOT NULL,
  classes_uuid character varying(255) NOT NULL,
  CONSTRAINT constr_onlineRegistrations_classes_classes_uuid FOREIGN KEY (classes_uuid)
      REFERENCES classes (uuid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION,
  CONSTRAINT constr_onlineRegistrations_classes_onlineRegistration_uuid FOREIGN KEY (onlineRegistration_uuid)
      REFERENCES onlineRegistrations (uuid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE onlineRegistrations_classes
  OWNER TO postgres;
-- ---------------------------------------
-- Table: heatpilotracebands

CREATE TABLE heatpilotracebands
(
  id bigint NOT NULL,
  uuid character varying(255) NOT NULL,
  deleted boolean NOT NULL,
  saved timestamp without time zone,
  synced timestamp without time zone,
  value character varying(255),
  CONSTRAINT heatpilotracebands_pkey PRIMARY KEY (id, uuid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE heatpilotracebands
  OWNER TO postgres;
-- ------------------------------ 0.3.6.0
ALTER TABLE heatpilots
ADD assignedraceband_id bigint;
-- -------------
CREATE SEQUENCE hibernate_sequence
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 3120
  CACHE 1;
ALTER TABLE hibernate_sequence
  OWNER TO postgres;
-- ------------------------------ 0.3.7.0
ALTER TABLE competitions
ADD onlineResultPossible boolean default false;
ALTER TABLE competitions
ADD onlineResultKey character varying(255);
  
CREATE TABLE competitionpilotclass
(
  id bigint NOT NULL,
  uuid character varying(255) NOT NULL,
  deleted boolean NOT NULL,
  saved timestamp without time zone,
  synced timestamp without time zone,
  name character varying(255),
  CONSTRAINT competitionpilotclass_pkey PRIMARY KEY (id, uuid)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE competitionpilotclass OWNER TO postgres;

ALTER TABLE competitionpilots ADD classs_id bigint NOT NULL;

ALTER TABLE competitionpilots DROP CONSTRAINT competitionpilots_pkey;
ALTER TABLE competitionpilots ADD CONSTRAINT competitionpilots_pkey PRIMARY KEY (classs_id, classs_uuid, competition_uuid, uuid);

ALTER TABLE competitionpilots ADD CONSTRAINT fklkfpydva352vi41qih1xhts5b
 FOREIGN KEY (classs_id, classs_uuid)
      REFERENCES competitionpilotclass (id, uuid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;
      
ALTER TABLE competitionpilots DROP COLUMN assignedraceband_uuid;
ALTER TABLE competitionpilots DROP CONSTRAINT fkgaw7sjwwtlcinjilk7m164avy; --assigned race band


ALTER TABLE competition_competitionpilots DROP CONSTRAINT fkjxsk5ylqlk2v5a765bnn7qayp;
ALTER TABLE competition_competitionpilots ADD CONSTRAINT fkjxsk5ylqlk2v5a765bnn7qayp FOREIGN KEY (pilots_classs_uuid, pilots_competition_uuid, pilots_uuid)
      REFERENCES competitionpilots (classs_uuid, competition_uuid, uuid) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION;
      

ALTER TABLE competition_competitionpilots DROP CONSTRAINT uk_bdq2kg5jjdsees1n4swchrla3;
ALTER TABLE competition_competitionpilots ADD CONSTRAINT uk_bdq2kg5jjdsees1n4swchrla3 UNIQUE (pilots_classs_uuid, pilots_competition_uuid, pilots_uuid);

---------------------- 1.3.8.0 (online events, race calendar)

ALTER TABLE competitions
ADD onlineEventPossible boolean default true;
ALTER TABLE competitions
ADD onlineEventKey character varying(255);

ALTER TABLE competitions
drop onlineEventKey;
ALTER TABLE users
ADD calendarKey character varying(255);