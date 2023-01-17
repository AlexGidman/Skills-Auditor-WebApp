-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2022 at 01:35 PM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `skills_auditor`
--

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Programming'),
(2, 'Office365'),
(3, 'Version Control');

-- --------------------------------------------------------

--
-- Table structure for table `direct_report`
--

CREATE TABLE `direct_report` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `reportId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



-- --------------------------------------------------------

--
-- Table structure for table `skill`
--

CREATE TABLE `skill` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `categoryId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `skill`
--

INSERT INTO `skill` (`id`, `name`, `categoryId`) VALUES
(1, 'AWS CCP', 1),
(2, 'Power Point', 2),
(3, 'Git', 3);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `systemRole` varchar(255) NOT NULL,
  `jobRole` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `firstName`, `lastName`, `email`, `password`, `systemRole`, `jobRole`) VALUES
(1, 'Test', 'User', 'admin@email.com', '$argon2id$v=19$m=15360,t=3,p=1$P8dAhB8e1Y9vMvtMfJ5gyQ$tSHA+y3mghxDHxKJ35bvu6fqf3oq7ki5QholzsUbfJE', 'Admin', 'Manager');


-- --------------------------------------------------------

--
-- Table structure for table `user_to_skill`
--

CREATE TABLE `user_to_skill` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `skillId` int(11) NOT NULL,
  `skillLevel` int(11) NOT NULL,
  `notes` varchar(255) NOT NULL,
  `expiryDate` date NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_to_skill`
--

INSERT INTO `user_to_skill` (`id`, `userId`, `skillId`, `skillLevel`, `notes`, `expiryDate`) VALUES
(1, 1, 1, 1, 'Passed exam with 80%', '2029-01-01'),
(2, 1, 2, 3, 'Power Point skills proficienct', '0000-00-00'),
(3, 1, 3, 2, 'Git version control skills proficient', '0000-00-00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `direct_report`
--
ALTER TABLE `direct_report`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`,`reportId`),
  ADD KEY `reportId` (`reportId`);

--
-- Indexes for table `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categoryId` (`categoryId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_to_skill`
--
ALTER TABLE `user_to_skill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `skillId` (`skillId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `category`
--
ALTER TABLE `category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `direct_report`
--
ALTER TABLE `direct_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `skill`
--
ALTER TABLE `skill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_to_skill`
--
ALTER TABLE `user_to_skill`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `direct_report`
--
ALTER TABLE `direct_report`
  ADD CONSTRAINT `direct_report_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `direct_report_ibfk_2` FOREIGN KEY (`reportId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `skill`
--
ALTER TABLE `skill`
  ADD CONSTRAINT `skill_ibfk_1` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user_to_skill`
--
ALTER TABLE `user_to_skill`
  ADD CONSTRAINT `user_to_skill_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_to_skill_ibfk_2` FOREIGN KEY (`skillId`) REFERENCES `skill` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;