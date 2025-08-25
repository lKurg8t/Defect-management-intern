-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 25, 2025 at 02:51 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `defect_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED DEFAULT NULL,
  `actor_user_id` bigint(20) UNSIGNED NOT NULL,
  `entity_type` enum('PROJECT','TEST_CASE','TEST_CYCLE','EXECUTION','DEFECT','REPORT','PARAMETER') NOT NULL,
  `entity_id` bigint(20) UNSIGNED NOT NULL,
  `action` varchar(120) NOT NULL,
  `meta_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta_json`)),
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `project_id`, `actor_user_id`, `entity_type`, `entity_id`, `action`, `meta_json`, `created_at`) VALUES
(1, 1, 2, 'PROJECT', 1, 'UPDATED', '{\"progress\": 75}', '2024-03-01 09:00:00'),
(2, 1, 2, 'TEST_CASE', 1, 'CREATED', NULL, '2024-01-20 10:00:00'),
(3, 2, 2, 'EXECUTION', 4, 'CREATED', NULL, '2024-03-04 11:50:00');

-- --------------------------------------------------------

--
-- Table structure for table `attachments`
--

CREATE TABLE `attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `entity_type` enum('PROJECT','TEST_CASE','TEST_CYCLE','EXECUTION','DEFECT','REPORT') NOT NULL,
  `entity_id` bigint(20) UNSIGNED NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(1024) NOT NULL,
  `mime_type` varchar(150) DEFAULT NULL,
  `size_bytes` bigint(20) UNSIGNED DEFAULT NULL,
  `uploaded_by` bigint(20) UNSIGNED NOT NULL,
  `uploaded_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attachments`
--

INSERT INTO `attachments` (`id`, `entity_type`, `entity_id`, `file_name`, `file_url`, `mime_type`, `size_bytes`, `uploaded_by`, `uploaded_at`) VALUES
(1, 'DEFECT', 2, 'network-trace.har', '/files/defects/network-trace.har', 'application/json', 20480, 2, '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `entity_type` enum('PROJECT','TEST_CASE','TEST_CYCLE','EXECUTION','DEFECT','REPORT') NOT NULL,
  `entity_id` bigint(20) UNSIGNED NOT NULL,
  `body` text NOT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`id`, `entity_type`, `entity_id`, `body`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'PROJECT', 1, 'Kickoff complete. SIT started.', 2, NULL, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(2, 'DEFECT', 2, 'Can we reproduce with sandbox gateway?', 2, NULL, '2025-08-25 13:27:43', '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `cycle_test_cases`
--

CREATE TABLE `cycle_test_cases` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `cycle_id` bigint(20) UNSIGNED NOT NULL,
  `test_case_id` bigint(20) UNSIGNED NOT NULL,
  `assigned_to_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `planned_date` date DEFAULT NULL,
  `actual_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cycle_test_cases`
--

INSERT INTO `cycle_test_cases` (`id`, `cycle_id`, `test_case_id`, `assigned_to_user_id`, `priority`, `planned_date`, `actual_date`) VALUES
(1, 1, 1, NULL, 'HIGH', '2024-03-02', '2024-03-05'),
(2, 1, 2, NULL, 'HIGH', '2024-03-02', '2024-03-05'),
(4, 2, 3, NULL, 'MEDIUM', '2024-03-16', NULL),
(5, 3, 4, NULL, 'CRITICAL', '2024-03-02', NULL),
(6, 3, 5, NULL, 'CRITICAL', '2024-03-02', NULL),
(7, 3, 6, NULL, 'CRITICAL', '2024-03-02', NULL),
(8, 5, 7, NULL, 'MEDIUM', '2024-01-06', '2024-01-10'),
(9, 5, 8, NULL, 'MEDIUM', '2024-01-06', '2024-01-10');

-- --------------------------------------------------------

--
-- Table structure for table `defects`
--

CREATE TABLE `defects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL DEFAULT uuid(),
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `test_case_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `severity` enum('CRITICAL','HIGH','MEDIUM','LOW') NOT NULL DEFAULT 'MEDIUM',
  `priority` enum('P0','P1','P2','P3') NOT NULL DEFAULT 'P2',
  `status` enum('OPEN','ASSIGNED','ESCALATED','RETEST','TO_DEPLOY','REOPEN','CLOSED') NOT NULL DEFAULT 'OPEN',
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `assigned_to` bigint(20) UNSIGNED DEFAULT NULL,
  `reopened_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `closed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `defects`
--

INSERT INTO `defects` (`id`, `uuid`, `project_id`, `test_case_id`, `title`, `description`, `severity`, `priority`, `status`, `created_by`, `assigned_to`, `reopened_count`, `created_at`, `updated_at`, `closed_at`) VALUES
(1, '229eb939-819e-11f0-8944-b00cd1682485', 1, 2, 'Cart count mismatch', 'Cart not updating when quickly adding items.', 'HIGH', 'P2', 'ASSIGNED', 2, NULL, 0, '2024-03-05 11:30:00', '2025-08-25 13:27:43', NULL),
(2, '229f1b48-819e-11f0-8944-b00cd1682485', 1, 1, 'Payment declined incorrectly', 'Valid card gets declined during gateway timeout.', 'CRITICAL', 'P1', 'OPEN', 2, NULL, 0, '2024-03-05 12:10:00', '2025-08-25 13:27:43', NULL),
(3, '229f1d6a-819e-11f0-8944-b00cd1682485', 1, 3, 'Guest email not saved', 'Email missing in order confirmation for guest checkout.', 'MEDIUM', 'P3', 'RETEST', 2, 2, 0, '2024-03-18 15:10:00', '2025-08-25 13:27:43', NULL),
(4, '22a151d7-819e-11f0-8944-b00cd1682485', 2, 5, 'Fee rounding error', 'Rounding differs on iOS vs Android.', 'HIGH', 'P1', 'OPEN', 2, NULL, 0, '2024-03-04 10:45:00', '2025-08-25 13:27:43', NULL),
(5, '22a15f10-819e-11f0-8944-b00cd1682485', 2, 6, 'Offline balance stale', 'Cached balance not refreshed after reconnect.', 'MEDIUM', 'P2', 'ASSIGNED', 2, NULL, 0, '2024-03-05 09:15:00', '2025-08-25 13:27:43', NULL),
(7, '22a42272-819e-11f0-8944-b00cd1682485', 3, 7, 'Avatar not saved', 'Profile avatar lost after refresh.', 'LOW', 'P3', 'CLOSED', 2, NULL, 0, '2024-01-08 13:00:00', '2025-08-25 13:27:43', '2024-01-10 18:00:00'),
(8, '22a43663-819e-11f0-8944-b00cd1682485', 3, 8, 'Invoice timezone mismatch', 'PDF shows UTC instead of local time.', 'MEDIUM', 'P2', 'TO_DEPLOY', 2, NULL, 0, '2024-01-09 11:00:00', '2025-08-25 13:27:43', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `defect_status_history`
--

CREATE TABLE `defect_status_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `defect_id` bigint(20) UNSIGNED NOT NULL,
  `from_status` enum('OPEN','ASSIGNED','ESCALATED','RETEST','TO_DEPLOY','REOPEN','CLOSED') DEFAULT NULL,
  `to_status` enum('OPEN','ASSIGNED','ESCALATED','RETEST','TO_DEPLOY','REOPEN','CLOSED') NOT NULL,
  `changed_by` bigint(20) UNSIGNED NOT NULL,
  `note` text DEFAULT NULL,
  `changed_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `defect_status_history`
--

INSERT INTO `defect_status_history` (`id`, `defect_id`, `from_status`, `to_status`, `changed_by`, `note`, `changed_at`) VALUES
(1, 1, NULL, 'OPEN', 2, 'New defect', '2024-03-05 11:30:00'),
(2, 1, 'OPEN', 'ASSIGNED', 2, 'Assigned to tester', '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `entity_tags`
--

CREATE TABLE `entity_tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `entity_type` enum('PROJECT','TEST_CASE','TEST_CYCLE','EXECUTION','DEFECT') NOT NULL,
  `entity_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `entity_tags`
--

INSERT INTO `entity_tags` (`id`, `entity_type`, `entity_id`, `tag_id`) VALUES
(1, 'PROJECT', 1, 1),
(2, 'PROJECT', 2, 2),
(3, 'PROJECT', 2, 3),
(4, 'PROJECT', 3, 1);

-- --------------------------------------------------------

--
-- Table structure for table `executions`
--

CREATE TABLE `executions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL DEFAULT uuid(),
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `cycle_id` bigint(20) UNSIGNED DEFAULT NULL,
  `test_case_id` bigint(20) UNSIGNED NOT NULL,
  `executed_by` bigint(20) UNSIGNED NOT NULL,
  `executed_at` datetime NOT NULL DEFAULT current_timestamp(),
  `result` enum('PASSED','FAILED','BLOCKED','SKIPPED','NOT_EXECUTED') NOT NULL DEFAULT 'NOT_EXECUTED',
  `notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `executions`
--

INSERT INTO `executions` (`id`, `uuid`, `project_id`, `cycle_id`, `test_case_id`, `executed_by`, `executed_at`, `result`, `notes`) VALUES
(1, '2298e19f-819e-11f0-8944-b00cd1682485', 1, 1, 1, 2, '2024-03-05 10:00:00', 'PASSED', 'Flow OK'),
(2, '22993a4c-819e-11f0-8944-b00cd1682485', 1, 1, 2, 2, '2024-03-05 11:15:00', 'FAILED', 'Edge case when cart empty'),
(3, '22993b91-819e-11f0-8944-b00cd1682485', 1, 2, 3, 2, '2024-03-18 14:20:00', 'PASSED', 'Guest checkout fine'),
(4, '229ae5f2-819e-11f0-8944-b00cd1682485', 2, 3, 4, 2, '2024-03-04 09:00:00', 'PASSED', 'OTP received'),
(5, '229afc6e-819e-11f0-8944-b00cd1682485', 2, 3, 5, 2, '2024-03-04 10:30:00', 'FAILED', 'Fee rounding issue'),
(6, '229afd28-819e-11f0-8944-b00cd1682485', 2, 3, 6, 2, '2024-03-04 11:45:00', 'BLOCKED', 'Device offline test pending'),
(7, '229cc5e3-819e-11f0-8944-b00cd1682485', 3, 5, 7, 2, '2024-01-10 15:00:00', 'PASSED', 'All good'),
(8, '229cd745-819e-11f0-8944-b00cd1682485', 3, 5, 8, 2, '2024-01-10 15:30:00', 'PASSED', 'PDF valid');

-- --------------------------------------------------------

--
-- Table structure for table `execution_defects`
--

CREATE TABLE `execution_defects` (
  `execution_id` bigint(20) UNSIGNED NOT NULL,
  `defect_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `execution_defects`
--

INSERT INTO `execution_defects` (`execution_id`, `defect_id`) VALUES
(2, 1),
(5, 4);

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL DEFAULT uuid(),
  `code` varchar(32) NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('ACTIVE','IN_DEVELOPMENT','COMPLETED','ON_HOLD','ARCHIVED') NOT NULL DEFAULT 'ACTIVE',
  `progress_pct` tinyint(3) UNSIGNED NOT NULL DEFAULT 0 CHECK (`progress_pct` <= 100),
  `owner_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `uuid`, `code`, `name`, `description`, `status`, `progress_pct`, `owner_user_id`, `start_date`, `end_date`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, '226692fe-819e-11f0-8944-b00cd1682485', 'ECOM', 'E-Commerce Platform', 'Complete testing suite for the new e-commerce platform including payments, catalog and checkout.', 'ACTIVE', 75, 2, '2024-01-15', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(2, '2266ed7e-819e-11f0-8944-b00cd1682485', 'MBANK', 'Mobile Banking App', 'Security and performance testing for the mobile banking application.', 'IN_DEVELOPMENT', 45, 2, '2024-02-01', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(3, '2266eeb9-819e-11f0-8944-b00cd1682485', 'CPORT', 'Customer Portal', 'User experience and functionality testing for the customer self-service portal.', 'COMPLETED', 100, 2, '2024-01-01', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `project_members`
--

CREATE TABLE `project_members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role` enum('OWNER','PROJECT_MANAGER','TEST_LEAD','TESTER','VIEWER') NOT NULL DEFAULT 'TESTER',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `joined_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_members`
--

INSERT INTO `project_members` (`id`, `project_id`, `user_id`, `role`, `is_active`, `joined_at`) VALUES
(1, 1, 2, 'OWNER', 1, '2025-08-25 13:27:43'),
(2, 2, 2, 'OWNER', 1, '2025-08-25 13:27:43'),
(3, 3, 2, 'OWNER', 1, '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `project_parameters`
--

CREATE TABLE `project_parameters` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `param_key` varchar(100) NOT NULL,
  `param_type` enum('STRING','NUMBER','BOOLEAN','DATE','JSON') NOT NULL DEFAULT 'STRING',
  `param_value` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `project_parameters`
--

INSERT INTO `project_parameters` (`id`, `project_id`, `param_key`, `param_type`, `param_value`, `created_at`, `updated_at`) VALUES
(1, 1, 'test_type', 'STRING', 'SIT', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(2, 1, 'test_mode', 'STRING', 'Manual', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(3, 1, 'tools', 'STRING', 'Selenium; JMeter', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(4, 1, 'cycles', 'JSON', '{\"ISB\": 1, \"Unit\": 20, \"Prototype\": 2, \"SIT\": 3, \"UAT\": 1}', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(5, 2, 'test_type', 'STRING', 'UAT', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(6, 2, 'test_mode', 'STRING', 'Manual', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(7, 2, 'tools', 'STRING', 'Appium; Postman', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(8, 2, 'cycles', 'JSON', '{\"ISB\": 0, \"Unit\": 12, \"Prototype\": 1, \"SIT\": 2, \"UAT\": 2}', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(9, 3, 'test_type', 'STRING', 'SIT', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(10, 3, 'test_mode', 'STRING', 'Automation', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(11, 3, 'tools', 'STRING', 'Cypress', '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(12, 3, 'cycles', 'JSON', '{\"ISB\": 0, \"Unit\": 8, \"Prototype\": 1, \"SIT\": 2, \"UAT\": 1}', '2025-08-25 13:27:43', '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `reports`
--

CREATE TABLE `reports` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL DEFAULT uuid(),
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` enum('EXECUTION_PER_SPRINT','OVERALL_TEST_EXECUTION','CUSTOM') NOT NULL DEFAULT 'CUSTOM',
  `params_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`params_json`)),
  `generated_url` varchar(1024) DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reports`
--

INSERT INTO `reports` (`id`, `uuid`, `project_id`, `title`, `type`, `params_json`, `generated_url`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, '22b4c8f9-819e-11f0-8944-b00cd1682485', 1, 'Execution Report Per Sprint', 'EXECUTION_PER_SPRINT', '{\"range\": \"last_30_days\"}', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(2, '22b4e1c6-819e-11f0-8944-b00cd1682485', 1, 'Overall Test Execution', 'OVERALL_TEST_EXECUTION', '{\"groupBy\": \"result\"}', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(3, '22b4e2aa-819e-11f0-8944-b00cd1682485', 2, 'Execution Report Per Sprint', 'EXECUTION_PER_SPRINT', '{\"range\": \"last_30_days\"}', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `report_runs`
--

CREATE TABLE `report_runs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `report_id` bigint(20) UNSIGNED NOT NULL,
  `run_by` bigint(20) UNSIGNED NOT NULL,
  `run_at` datetime NOT NULL DEFAULT current_timestamp(),
  `status` enum('QUEUED','RUNNING','SUCCESS','FAILED') NOT NULL DEFAULT 'SUCCESS',
  `output_url` varchar(1024) DEFAULT NULL,
  `error_message` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `report_runs`
--

INSERT INTO `report_runs` (`id`, `report_id`, `run_by`, `run_at`, `status`, `output_url`, `error_message`) VALUES
(1, 1, 2, '2025-08-25 13:27:43', 'SUCCESS', '1', NULL),
(2, 2, 2, '2025-08-25 13:27:43', 'SUCCESS', '1', NULL),
(3, 3, 2, '2025-08-25 13:27:43', 'SUCCESS', '1', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `color_hex` char(7) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tags`
--

INSERT INTO `tags` (`id`, `name`, `color_hex`, `created_at`) VALUES
(1, 'web', '#14b8a6', '2025-08-25 13:27:43'),
(2, 'mobile', '#10b981', '2025-08-25 13:27:43'),
(3, 'priority-P1', '#f59e0b', '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `test_cases`
--

CREATE TABLE `test_cases` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL DEFAULT uuid(),
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `ref` varchar(40) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `workstream` varchar(120) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `priority` enum('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  `planned_date` date DEFAULT NULL,
  `actual_date` date DEFAULT NULL,
  `status` enum('DRAFT','READY','DEPRECATED') NOT NULL DEFAULT 'READY',
  `tester_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test_cases`
--

INSERT INTO `test_cases` (`id`, `uuid`, `project_id`, `ref`, `title`, `description`, `workstream`, `type`, `priority`, `planned_date`, `actual_date`, `status`, `tester_user_id`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, '2280c8ce-819e-11f0-8944-b00cd1682485', 1, 'TC-ECOM-001', 'Checkout with valid card', 'Verify user can checkout using a valid Visa card.', 'Payments', 'Functional', 'HIGH', '2024-01-20', NULL, 'READY', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(2, '22812e21-819e-11f0-8944-b00cd1682485', 1, 'TC-ECOM-002', 'Add to cart from product list', 'Ensure adding items from list increments cart.', 'Catalog', 'Regression', 'MEDIUM', '2024-01-22', NULL, 'READY', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(3, '22812f88-819e-11f0-8944-b00cd1682485', 1, 'TC-ECOM-003', 'Guest checkout', 'Confirm guest checkout flow without signup.', 'Checkout', 'Functional', 'MEDIUM', '2024-01-25', NULL, 'READY', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(4, '228130b2-819e-11f0-8944-b00cd1682485', 2, 'TC-MBANK-001', 'Login with OTP', 'User logs in with phone + OTP.', 'Auth', 'Functional', 'HIGH', '2024-02-05', NULL, 'READY', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(5, '22813162-819e-11f0-8944-b00cd1682485', 2, 'TC-MBANK-002', 'Transfer between accounts', 'Verify intra-bank transfer and fee calc.', 'Transfers', 'Functional', 'CRITICAL', '2024-02-08', NULL, 'READY', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(6, '228131f1-819e-11f0-8944-b00cd1682485', 2, 'TC-MBANK-003', 'Balance inquiry offline', 'Show cached balance when offline.', 'Resilience', 'Regression', 'MEDIUM', '2024-02-10', NULL, 'READY', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(7, '22813278-819e-11f0-8944-b00cd1682485', 3, 'TC-CPORT-001', 'Profile update', 'Update profile details successfully.', 'Profile', 'Functional', 'LOW', '2024-01-03', NULL, 'READY', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(8, '228132f7-819e-11f0-8944-b00cd1682485', 3, 'TC-CPORT-002', 'Download invoice', 'Invoice PDF is generated & downloadable.', 'Billing', 'Functional', 'MEDIUM', '2024-01-04', NULL, 'READY', NULL, 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `test_case_steps`
--

CREATE TABLE `test_case_steps` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `test_case_id` bigint(20) UNSIGNED NOT NULL,
  `step_no` int(10) UNSIGNED NOT NULL,
  `action_text` text NOT NULL,
  `expected_result` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test_case_steps`
--

INSERT INTO `test_case_steps` (`id`, `test_case_id`, `step_no`, `action_text`, `expected_result`) VALUES
(1, 2, 1, 'Open product page', 'Product page loads with details'),
(2, 2, 2, 'Click \"Add to Cart\"', 'Cart count increases by 1'),
(4, 1, 1, 'Enter card details', 'Card passes Luhn check'),
(5, 1, 2, 'Click Pay', 'Payment authorized and order placed'),
(11, 3, 1, 'Proceed to checkout as guest', 'Guest form visible'),
(12, 3, 2, 'Place order', 'Order created and confirmation email sent'),
(13, 4, 1, 'Enter phone number', 'OTP sent to device'),
(14, 4, 2, 'Enter OTP', 'User authenticated'),
(15, 5, 1, 'Open transfer screen', 'Transfer form opens'),
(16, 5, 2, 'Submit transfer', 'Funds moved and fee calculated correctly'),
(17, 6, 1, 'Turn on airplane mode', 'Device offline'),
(18, 6, 2, 'Open balance screen', 'Cached balance shown with stale indicator'),
(19, 7, 1, 'Open profile', 'Profile loads'),
(20, 7, 2, 'Save changes', 'Profile updated'),
(21, 8, 1, 'Open invoice list', 'Invoices render'),
(22, 8, 2, 'Download invoice', 'PDF saved locally');

-- --------------------------------------------------------

--
-- Table structure for table `test_cycles`
--

CREATE TABLE `test_cycles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL DEFAULT uuid(),
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('PLANNED','ACTIVE','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLANNED',
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `test_cycles`
--

INSERT INTO `test_cycles` (`id`, `uuid`, `project_id`, `name`, `description`, `start_date`, `end_date`, `status`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, '22868428-819e-11f0-8944-b00cd1682485', 1, 'SIT Cycle 1', 'SIT for core commerce', '2024-03-01', '2024-03-10', 'COMPLETED', 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(2, '2286d351-819e-11f0-8944-b00cd1682485', 1, 'UAT Cycle 1', 'Business UAT', '2024-03-15', '2024-03-25', 'ACTIVE', 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(3, '2286d45f-819e-11f0-8944-b00cd1682485', 2, 'SIT Cycle 1', 'SIT for auth & transfers', '2024-03-01', '2024-03-12', 'ACTIVE', 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(4, '2286d576-819e-11f0-8944-b00cd1682485', 2, 'UAT Cycle 1', 'UAT with pilot users', '2024-03-20', '2024-03-30', 'PLANNED', 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43'),
(5, '2286d696-819e-11f0-8944-b00cd1682485', 3, 'SIT Cycle 1', 'SIT closeout', '2024-01-05', '2024-01-12', 'COMPLETED', 2, 2, '2025-08-25 13:27:43', '2025-08-25 13:27:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` char(36) NOT NULL DEFAULT uuid(),
  `username` varchar(50) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(120) NOT NULL,
  `role` enum('ADMIN','PROJECT_MANAGER','TEST_LEAD','TESTER','VIEWER') NOT NULL DEFAULT 'TESTER',
  `status` enum('ACTIVE','INVITED','SUSPENDED','DEACTIVATED') NOT NULL DEFAULT 'ACTIVE',
  `avatar_url` varchar(512) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `last_login_at` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `username`, `email`, `password_hash`, `full_name`, `role`, `status`, `avatar_url`, `phone`, `last_login_at`, `created_at`, `updated_at`) VALUES
(2, '4c50a0b7-819a-11f0-ba32-b00cd1682485', 'admin', 'admin@example.com', '$2a$10$B6Fh79MioUuSdkoUPpDuGuEH5fclNTWHXfp4pr43VRBb5po7Y7LJS', 'System Administrator', 'ADMIN', 'ACTIVE', NULL, NULL, '2025-08-25 14:37:35', '2025-08-25 13:00:15', '2025-08-25 14:37:35');

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_dashboard_kpis`
-- (See below for the actual view)
--
CREATE TABLE `v_dashboard_kpis` (
`total_projects` bigint(21)
,`active_projects` bigint(21)
,`tests_completed` bigint(21)
,`pending_bugs` bigint(21)
,`team_members` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_project_summary`
-- (See below for the actual view)
--
CREATE TABLE `v_project_summary` (
`project_id` bigint(20) unsigned
,`code` varchar(32)
,`name` varchar(200)
,`status` enum('ACTIVE','IN_DEVELOPMENT','COMPLETED','ON_HOLD','ARCHIVED')
,`progress_pct` tinyint(3) unsigned
,`start_date` date
,`end_date` date
,`team_size` bigint(21)
,`bug_count` bigint(21)
,`test_case_count` bigint(21)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `v_project_summary_ui`
-- (See below for the actual view)
--
CREATE TABLE `v_project_summary_ui` (
`id` bigint(20) unsigned
,`code` varchar(32)
,`name` varchar(200)
,`description` text
,`status` enum('ACTIVE','IN_DEVELOPMENT','COMPLETED','ON_HOLD','ARCHIVED')
,`progress` tinyint(3) unsigned
,`teamSize` bigint(21)
,`bugs` bigint(21)
,`testCases` bigint(21)
,`start_date` date
,`end_date` date
,`created_at` datetime
,`updated_at` datetime
);

-- --------------------------------------------------------

--
-- Structure for view `v_dashboard_kpis`
--
DROP TABLE IF EXISTS `v_dashboard_kpis`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_dashboard_kpis`  AS SELECT (select count(0) from `projects`) AS `total_projects`, (select count(0) from `projects` where `projects`.`status` = 'ACTIVE') AS `active_projects`, (select count(0) from `executions` where `executions`.`result` = 'PASSED') AS `tests_completed`, (select count(0) from `defects` where `defects`.`status` not in ('TO_DEPLOY','CLOSED')) AS `pending_bugs`, (select count(distinct `project_members`.`user_id`) from `project_members` where `project_members`.`is_active` = 1) AS `team_members` ;

-- --------------------------------------------------------

--
-- Structure for view `v_project_summary`
--
DROP TABLE IF EXISTS `v_project_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_project_summary`  AS SELECT `p`.`id` AS `project_id`, `p`.`code` AS `code`, `p`.`name` AS `name`, `p`.`status` AS `status`, `p`.`progress_pct` AS `progress_pct`, `p`.`start_date` AS `start_date`, `p`.`end_date` AS `end_date`, (select count(0) from `project_members` `pm` where `pm`.`project_id` = `p`.`id` and `pm`.`is_active` = 1) AS `team_size`, (select count(0) from `defects` `d` where `d`.`project_id` = `p`.`id`) AS `bug_count`, (select count(0) from `test_cases` `tc` where `tc`.`project_id` = `p`.`id`) AS `test_case_count` FROM `projects` AS `p` ;

-- --------------------------------------------------------

--
-- Structure for view `v_project_summary_ui`
--
DROP TABLE IF EXISTS `v_project_summary_ui`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_project_summary_ui`  AS SELECT `p`.`id` AS `id`, `p`.`code` AS `code`, `p`.`name` AS `name`, `p`.`description` AS `description`, `p`.`status` AS `status`, `p`.`progress_pct` AS `progress`, (select count(0) from `project_members` `pm` where `pm`.`project_id` = `p`.`id` and `pm`.`is_active` = 1) AS `teamSize`, (select count(0) from `defects` `d` where `d`.`project_id` = `p`.`id`) AS `bugs`, (select count(0) from `test_cases` `tc` where `tc`.`project_id` = `p`.`id`) AS `testCases`, `p`.`start_date` AS `start_date`, `p`.`end_date` AS `end_date`, `p`.`created_at` AS `created_at`, `p`.`updated_at` AS `updated_at` FROM `projects` AS `p` ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_activity_project` (`project_id`),
  ADD KEY `idx_activity_entity` (`entity_type`,`entity_id`),
  ADD KEY `fk_activity_actor` (`actor_user_id`);

--
-- Indexes for table `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_attachments_entity` (`entity_type`,`entity_id`),
  ADD KEY `fk_attachments_user` (`uploaded_by`);

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_comments_entity` (`entity_type`,`entity_id`),
  ADD KEY `fk_comments_creator` (`created_by`),
  ADD KEY `fk_comments_updater` (`updated_by`);

--
-- Indexes for table `cycle_test_cases`
--
ALTER TABLE `cycle_test_cases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_cycle_case` (`cycle_id`,`test_case_id`),
  ADD KEY `fk_ctc_test_case` (`test_case_id`),
  ADD KEY `fk_ctc_assignee` (`assigned_to_user_id`);

--
-- Indexes for table `defects`
--
ALTER TABLE `defects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_defects_uuid` (`uuid`),
  ADD KEY `idx_defect_project` (`project_id`),
  ADD KEY `idx_defect_status` (`status`),
  ADD KEY `idx_defect_severity` (`severity`),
  ADD KEY `fk_defect_test_case` (`test_case_id`),
  ADD KEY `fk_defect_created_by` (`created_by`),
  ADD KEY `fk_defect_assigned_to` (`assigned_to`);

--
-- Indexes for table `defect_status_history`
--
ALTER TABLE `defect_status_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_defect_history_defect` (`defect_id`),
  ADD KEY `idx_defect_history_status` (`to_status`),
  ADD KEY `fk_dsh_user` (`changed_by`);

--
-- Indexes for table `entity_tags`
--
ALTER TABLE `entity_tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_entity_tag` (`entity_type`,`entity_id`,`tag_id`),
  ADD KEY `idx_entity_tags_type_id` (`entity_type`,`entity_id`),
  ADD KEY `fk_entity_tags_tag` (`tag_id`);

--
-- Indexes for table `executions`
--
ALTER TABLE `executions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_executions_uuid` (`uuid`),
  ADD KEY `idx_exec_project` (`project_id`),
  ADD KEY `idx_exec_cycle` (`cycle_id`),
  ADD KEY `idx_exec_result` (`result`),
  ADD KEY `fk_exec_test_case` (`test_case_id`),
  ADD KEY `fk_exec_user` (`executed_by`);

--
-- Indexes for table `execution_defects`
--
ALTER TABLE `execution_defects`
  ADD PRIMARY KEY (`execution_id`,`defect_id`),
  ADD KEY `fk_ed_defect` (`defect_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_projects_uuid` (`uuid`),
  ADD UNIQUE KEY `uq_projects_code` (`code`),
  ADD KEY `idx_projects_status` (`status`),
  ADD KEY `idx_projects_progress` (`progress_pct`),
  ADD KEY `idx_projects_start` (`start_date`),
  ADD KEY `fk_projects_owner_user` (`owner_user_id`),
  ADD KEY `fk_projects_created_by` (`created_by`),
  ADD KEY `fk_projects_updated_by` (`updated_by`);

--
-- Indexes for table `project_members`
--
ALTER TABLE `project_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_project_member` (`project_id`,`user_id`),
  ADD KEY `idx_members_role` (`role`),
  ADD KEY `fk_pm_user` (`user_id`);

--
-- Indexes for table `project_parameters`
--
ALTER TABLE `project_parameters`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_project_param` (`project_id`,`param_key`);

--
-- Indexes for table `reports`
--
ALTER TABLE `reports`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_reports_uuid` (`uuid`),
  ADD KEY `idx_reports_project` (`project_id`),
  ADD KEY `fk_reports_creator` (`created_by`),
  ADD KEY `fk_reports_updater` (`updated_by`);

--
-- Indexes for table `report_runs`
--
ALTER TABLE `report_runs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_report_runs_report` (`report_id`),
  ADD KEY `fk_report_runs_user` (`run_by`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tags_name` (`name`);

--
-- Indexes for table `test_cases`
--
ALTER TABLE `test_cases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_test_cases_uuid` (`uuid`),
  ADD KEY `idx_tc_project` (`project_id`),
  ADD KEY `idx_tc_title` (`title`),
  ADD KEY `idx_tc_status` (`status`),
  ADD KEY `fk_tc_tester` (`tester_user_id`),
  ADD KEY `fk_tc_created_by` (`created_by`),
  ADD KEY `fk_tc_updated_by` (`updated_by`);

--
-- Indexes for table `test_case_steps`
--
ALTER TABLE `test_case_steps`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tc_step` (`test_case_id`,`step_no`);

--
-- Indexes for table `test_cycles`
--
ALTER TABLE `test_cycles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_test_cycles_uuid` (`uuid`),
  ADD KEY `idx_cycle_project` (`project_id`),
  ADD KEY `idx_cycle_status` (`status`),
  ADD KEY `fk_cycle_created_by` (`created_by`),
  ADD KEY `fk_cycle_updated_by` (`updated_by`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_users_uuid` (`uuid`),
  ADD UNIQUE KEY `uq_users_username` (`username`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_status` (`status`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `attachments`
--
ALTER TABLE `attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `cycle_test_cases`
--
ALTER TABLE `cycle_test_cases`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `defects`
--
ALTER TABLE `defects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `defect_status_history`
--
ALTER TABLE `defect_status_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `entity_tags`
--
ALTER TABLE `entity_tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `executions`
--
ALTER TABLE `executions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `project_members`
--
ALTER TABLE `project_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `project_parameters`
--
ALTER TABLE `project_parameters`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `reports`
--
ALTER TABLE `reports`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `report_runs`
--
ALTER TABLE `report_runs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `test_cases`
--
ALTER TABLE `test_cases`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `test_case_steps`
--
ALTER TABLE `test_case_steps`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `test_cycles`
--
ALTER TABLE `test_cycles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `fk_activity_actor` FOREIGN KEY (`actor_user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_activity_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `fk_attachments_user` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_comments_updater` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `cycle_test_cases`
--
ALTER TABLE `cycle_test_cases`
  ADD CONSTRAINT `fk_ctc_assignee` FOREIGN KEY (`assigned_to_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctc_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `test_cycles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ctc_test_case` FOREIGN KEY (`test_case_id`) REFERENCES `test_cases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `defects`
--
ALTER TABLE `defects`
  ADD CONSTRAINT `fk_defect_assigned_to` FOREIGN KEY (`assigned_to`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_defect_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_defect_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_defect_test_case` FOREIGN KEY (`test_case_id`) REFERENCES `test_cases` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `defect_status_history`
--
ALTER TABLE `defect_status_history`
  ADD CONSTRAINT `fk_dsh_defect` FOREIGN KEY (`defect_id`) REFERENCES `defects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_dsh_user` FOREIGN KEY (`changed_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `entity_tags`
--
ALTER TABLE `entity_tags`
  ADD CONSTRAINT `fk_entity_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `executions`
--
ALTER TABLE `executions`
  ADD CONSTRAINT `fk_exec_cycle` FOREIGN KEY (`cycle_id`) REFERENCES `test_cycles` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_exec_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_exec_test_case` FOREIGN KEY (`test_case_id`) REFERENCES `test_cases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_exec_user` FOREIGN KEY (`executed_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `execution_defects`
--
ALTER TABLE `execution_defects`
  ADD CONSTRAINT `fk_ed_defect` FOREIGN KEY (`defect_id`) REFERENCES `defects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ed_execution` FOREIGN KEY (`execution_id`) REFERENCES `executions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `fk_projects_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_projects_owner_user` FOREIGN KEY (`owner_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_projects_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `project_members`
--
ALTER TABLE `project_members`
  ADD CONSTRAINT `fk_pm_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_pm_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `project_parameters`
--
ALTER TABLE `project_parameters`
  ADD CONSTRAINT `fk_pp_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `reports`
--
ALTER TABLE `reports`
  ADD CONSTRAINT `fk_reports_creator` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reports_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_reports_updater` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `report_runs`
--
ALTER TABLE `report_runs`
  ADD CONSTRAINT `fk_report_runs_report` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_report_runs_user` FOREIGN KEY (`run_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `test_cases`
--
ALTER TABLE `test_cases`
  ADD CONSTRAINT `fk_tc_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tc_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tc_tester` FOREIGN KEY (`tester_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_tc_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `test_case_steps`
--
ALTER TABLE `test_case_steps`
  ADD CONSTRAINT `fk_tcs_test_case` FOREIGN KEY (`test_case_id`) REFERENCES `test_cases` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `test_cycles`
--
ALTER TABLE `test_cycles`
  ADD CONSTRAINT `fk_cycle_created_by` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cycle_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_cycle_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
