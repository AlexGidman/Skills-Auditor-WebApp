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
  `user_id` int(11) NOT NULL,
  `report_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `direct_report`
--

INSERT INTO `direct_report` (`id`, `user_id`, `report_id`) VALUES
(2, 2, 1),
(3, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `skill`
--

CREATE TABLE `skill` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `skill`
--

INSERT INTO `skill` (`id`, `name`, `category_id`) VALUES
(1, 'AWS CCP', 1),
(2, 'Power Point', 2),
(3, 'Git Skill', 3);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `forename` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `system_role` varchar(255) NOT NULL,
  `job_role` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `forename`, `surname`, `email`, `password`, `system_role`, `job_role`) VALUES
(1, 'Alex', 'Gidman', 'Alex@Gidman', '$argon2id$v=19$m=15360,t=3,p=1$P8dAhB8e1Y9vMvtMfJ5gyQ$tSHA+y3mghxDHxKJ35bvu6fqf3oq7ki5QholzsUbfJE', 'Admin', 'Manager'),
(2, 'Seb', 'Roffey', 'Seb@Roffey', '$argon2id$v=19$m=15360,t=3,p=1$IAryVPbmPSWk/UJAV9LGeQ$6cNPIRsS+JnPCXmduirRKh2WN67OrmIth860hi8IC4Y', 'Manager', 'Senior Developer'),
(3, 'Billy', 'Mc', 'Billy@Mc', '$argon2id$v=19$m=15360,t=3,p=1$svbG44iQxGd0hsChOBo5/w$Ec0vZ0lN4UXHQnYWU/TtVIT3q5OapVrEldMFL+rsFAk', 'StaffUser', 'Mid-Level Developer');

-- --------------------------------------------------------

--
-- Table structure for table `user_to_skill`
--

CREATE TABLE `user_to_skill` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `skill_id` int(11) NOT NULL,
  `skill_level` int(11) NOT NULL,
  `notes` varchar(255) NOT NULL,
  `expiry_date` date NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_to_skill`
--

INSERT INTO `user_to_skill` (`id`, `user_id`, `skill_id`, `skill_level`, `notes`, `expiry_date`) VALUES
(1, 1, 1, 1, 'Only recently passed exam.', '2024-06-16'),
(2, 2, 2, 3, 'Really good with Power Point', '0000-00-00'),
(3, 3, 3, 2, 'Qualified in Git', '2023-06-16');

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
  ADD KEY `user_id` (`user_id`,`report_id`),
  ADD KEY `report_id` (`report_id`);

--
-- Indexes for table `skill`
--
ALTER TABLE `skill`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

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
  ADD KEY `user_id` (`user_id`),
  ADD KEY `skill_id` (`skill_id`);

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
  ADD CONSTRAINT `direct_report_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `direct_report_ibfk_2` FOREIGN KEY (`report_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `skill`
--
ALTER TABLE `skill`
  ADD CONSTRAINT `skill_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `user_to_skill`
--
ALTER TABLE `user_to_skill`
  ADD CONSTRAINT `user_to_skill_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `user_to_skill_ibfk_2` FOREIGN KEY (`skill_id`) REFERENCES `skill` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;