CREATE TABLE `users` ( `id` INT(11) NOT NULL PRIMARY key auto_increment, `name` VARCHAR(255) NOT NULL, `email` VARCHAR(255) NOT NULL UNIQUE, `mobile` VARCHAR(255) NOT NULL, `password` VARCHAR(255) NOT NULL, `token` VARCHAR(255) DEFAULT NULL );
CREATE TABLE `events` ( `id` INT(11) NOT NULL PRIMARY key auto_increment, `name` VARCHAR(255) NOT NULL, `description` text NOT NULL, `min_size` INT(11) NOT NULL, `max_size` INT(11) NOT NULL );
CREATE TABLE `teams` ( `id` INT(11) NOT NULL PRIMARY key auto_increment, `event` INT(11) NOT NULL );
CREATE TABLE `team_members` ( `team` INT(11) NOT NULL, `USER` INT(11) NOT NULL );
ALTER TABLE `teams` ADD CONSTRAINT `teams_ibfk_1` FOREIGN key (`event`) REFERENCES `events` (`id`) ;
ALTER TABLE `team_members` ADD CONSTRAINT `team_members_ibfk_1` FOREIGN key (`team`) REFERENCES `teams` ( `id`), ADD CONSTRAINT `team_members_ibfk_2` FOREIGN key (`USER`) REFERENCES `users` ( `id`);
