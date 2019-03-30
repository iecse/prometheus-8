CREATE TABLE `users` ( `id` INT(11) NOT NULL PRIMARY key auto_increment, `qr` VARCHAR(255) NOT NULL UNIQUE, `name` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL UNIQUE, `mobile` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `token` VARCHAR(255) DEFAULT NULL, `active` INT(11) DEFAULT 0, `access` INT(11) DEFAULT 1, `admin` INT(11) DEFAULT 1);
CREATE TABLE `events` ( `id` INT(11) NOT NULL PRIMARY key auto_increment, `name` VARCHAR(255) NOT NULL, `description` text NOT NULL, `min_size` INT(11) NOT NULL, `max_size` INT(11) NOT NULL, `online` INT(11) NOT NULL DEFAULT 0, `link` VARCHAR(255), `date` DATETIME, `venue` varchar(255));
CREATE TABLE `teams` ( `id` INT(11) NOT NULL PRIMARY key auto_increment, `event` INT(11) NOT NULL, `name` VARCHAR(255) NOT NULL, UNIQUE(`name`, `event`));
CREATE TABLE `team_members` ( `team` INT(11) NOT NULL, `user` INT(11) NOT NULL );
CREATE TABLE `registrations` ( `event` INT(11) NOT NULL, `user` INT(11) NOT NULL, UNIQUE(`event`, `user`) );
CREATE TABLE `results` (`team` INT(11) NOT NULL, `event` INT(11) NOT NULL, `score` INT(11) NOT NULL, `round` INT(11) NOT NULL, primary key(`team`, `event`, `round`));

ALTER TABLE `teams` ADD CONSTRAINT `teams_ibfk_1` FOREIGN key (`event`) REFERENCES `events` (`id`) ;
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_ibfk_1` FOREIGN key (`team`) REFERENCES `teams` ( `id`), ADD CONSTRAINT `team_members_ibfk_2` FOREIGN key (`user`) REFERENCES `users` ( `id`);
ALTER TABLE `registrations` ADD CONSTRAINT `registrations_ibfk_1` FOREIGN key (`event`) REFERENCES `events` ( `id`), ADD CONSTRAINT `registrations_ibfk_2` FOREIGN key (`user`) REFERENCES `users` ( `id`);
