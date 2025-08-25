-- Defect Management System (DMS) - Full Database Schema (no views)
-- MySQL 8+ | InnoDB | utf8mb4

CREATE DATABASE IF NOT EXISTS defect_db
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE defect_db;

-- =============================================================================
-- PROJECTS & MEMBERS
-- =============================================================================

CREATE TABLE IF NOT EXISTS projects (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid             CHAR(36) NOT NULL DEFAULT (UUID()),
  code             VARCHAR(32) NOT NULL,
  name             VARCHAR(200) NOT NULL,
  description      TEXT NULL,
  status           ENUM('ACTIVE','IN_DEVELOPMENT','COMPLETED','ON_HOLD','ARCHIVED')
                      NOT NULL DEFAULT 'ACTIVE',
  progress_pct     TINYINT UNSIGNED NOT NULL DEFAULT 0 CHECK (progress_pct <= 100),
  owner_user_id    BIGINT UNSIGNED NULL,
  start_date       DATE NULL,
  end_date         DATE NULL,
  created_by       BIGINT UNSIGNED NOT NULL,
  updated_by       BIGINT UNSIGNED NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_projects_uuid (uuid),
  UNIQUE KEY uq_projects_code (code),
  KEY idx_projects_status (status),
  KEY idx_projects_progress (progress_pct),
  KEY idx_projects_start (start_date),
  CONSTRAINT fk_projects_owner_user
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_projects_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_projects_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_members (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id       BIGINT UNSIGNED NOT NULL,
  user_id          BIGINT UNSIGNED NOT NULL,
  role             ENUM('OWNER','PROJECT_MANAGER','TEST_LEAD','TESTER','VIEWER')
                      NOT NULL DEFAULT 'TESTER',
  is_active        TINYINT(1) NOT NULL DEFAULT 1,
  joined_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_project_member (project_id, user_id),
  KEY idx_members_role (role),
  CONSTRAINT fk_pm_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_pm_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS project_parameters (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id       BIGINT UNSIGNED NOT NULL,
  param_key        VARCHAR(100) NOT NULL,
  param_type       ENUM('STRING','NUMBER','BOOLEAN','DATE','JSON') NOT NULL DEFAULT 'STRING',
  param_value      TEXT NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_project_param (project_id, param_key),
  CONSTRAINT fk_pp_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- TAGS
-- =============================================================================

CREATE TABLE IF NOT EXISTS tags (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name             VARCHAR(100) NOT NULL,
  color_hex        CHAR(7) NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tags_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS entity_tags (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type      ENUM('PROJECT','TEST_CASE','TEST_CYCLE','EXECUTION','DEFECT') NOT NULL,
  entity_id        BIGINT UNSIGNED NOT NULL,
  tag_id           BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_entity_tag (entity_type, entity_id, tag_id),
  KEY idx_entity_tags_type_id (entity_type, entity_id),
  CONSTRAINT fk_entity_tags_tag
    FOREIGN KEY (tag_id) REFERENCES tags(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- TEST CASES & STEPS
-- =============================================================================

CREATE TABLE IF NOT EXISTS test_cases (
  id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid                 CHAR(36) NOT NULL DEFAULT (UUID()),
  project_id           BIGINT UNSIGNED NOT NULL,
  ref                  VARCHAR(40) NULL,
  title                VARCHAR(255) NOT NULL,
  description          TEXT NULL,
  workstream           VARCHAR(120) NULL,
  type                 VARCHAR(100) NULL,
  priority             ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  planned_date         DATE NULL,
  actual_date          DATE NULL,
  status               ENUM('DRAFT','READY','DEPRECATED') NOT NULL DEFAULT 'READY',
  tester_user_id       BIGINT UNSIGNED NULL,
  created_by           BIGINT UNSIGNED NOT NULL,
  updated_by           BIGINT UNSIGNED NULL,
  created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_test_cases_uuid (uuid),
  KEY idx_tc_project (project_id),
  KEY idx_tc_title (title),
  KEY idx_tc_status (status),
  CONSTRAINT fk_tc_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_tc_tester
    FOREIGN KEY (tester_user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_tc_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_tc_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS test_case_steps (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  test_case_id     BIGINT UNSIGNED NOT NULL,
  step_no          INT UNSIGNED NOT NULL,
  action_text      TEXT NOT NULL,
  expected_result  TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_tc_step (test_case_id, step_no),
  CONSTRAINT fk_tcs_test_case
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- TEST CYCLES & ASSIGNMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS test_cycles (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid             CHAR(36) NOT NULL DEFAULT (UUID()),
  project_id       BIGINT UNSIGNED NOT NULL,
  name             VARCHAR(200) NOT NULL,
  description      TEXT NULL,
  start_date       DATE NULL,
  end_date         DATE NULL,
  status           ENUM('PLANNED','ACTIVE','COMPLETED','CANCELLED') NOT NULL DEFAULT 'PLANNED',
  created_by       BIGINT UNSIGNED NOT NULL,
  updated_by       BIGINT UNSIGNED NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_test_cycles_uuid (uuid),
  KEY idx_cycle_project (project_id),
  KEY idx_cycle_status (status),
  CONSTRAINT fk_cycle_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_cycle_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_cycle_updated_by
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS cycle_test_cases (
  id                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  cycle_id            BIGINT UNSIGNED NOT NULL,
  test_case_id        BIGINT UNSIGNED NOT NULL,
  assigned_to_user_id BIGINT UNSIGNED NULL,
  priority            ENUM('LOW','MEDIUM','HIGH','CRITICAL') DEFAULT 'MEDIUM',
  planned_date        DATE NULL,
  actual_date         DATE NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_cycle_case (cycle_id, test_case_id),
  CONSTRAINT fk_ctc_cycle
    FOREIGN KEY (cycle_id) REFERENCES test_cycles(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ctc_test_case
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ctc_assignee
    FOREIGN KEY (assigned_to_user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- EXECUTIONS
-- =============================================================================

CREATE TABLE IF NOT EXISTS executions (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid             CHAR(36) NOT NULL DEFAULT (UUID()),
  project_id       BIGINT UNSIGNED NOT NULL,
  cycle_id         BIGINT UNSIGNED NULL,
  test_case_id     BIGINT UNSIGNED NOT NULL,
  executed_by      BIGINT UNSIGNED NOT NULL,
  executed_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  result           ENUM('PASSED','FAILED','BLOCKED','SKIPPED','NOT_EXECUTED')
                      NOT NULL DEFAULT 'NOT_EXECUTED',
  notes            TEXT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_executions_uuid (uuid),
  KEY idx_exec_project (project_id),
  KEY idx_exec_cycle (cycle_id),
  KEY idx_exec_result (result),
  CONSTRAINT fk_exec_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_exec_cycle
    FOREIGN KEY (cycle_id) REFERENCES test_cycles(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_exec_test_case
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_exec_user
    FOREIGN KEY (executed_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- DEFECTS & HISTORY
-- =============================================================================

CREATE TABLE IF NOT EXISTS defects (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid             CHAR(36) NOT NULL DEFAULT (UUID()),
  project_id       BIGINT UNSIGNED NOT NULL,
  test_case_id     BIGINT UNSIGNED NULL,
  title            VARCHAR(255) NOT NULL,
  description      TEXT NULL,
  severity         ENUM('CRITICAL','HIGH','MEDIUM','LOW') NOT NULL DEFAULT 'MEDIUM',
  priority         ENUM('P0','P1','P2','P3') NOT NULL DEFAULT 'P2',
  status           ENUM('OPEN','ASSIGNED','ESCALATED','RETEST','TO_DEPLOY','REOPEN','CLOSED')
                      NOT NULL DEFAULT 'OPEN',
  created_by       BIGINT UNSIGNED NOT NULL,
  assigned_to      BIGINT UNSIGNED NULL,
  reopened_count   INT UNSIGNED NOT NULL DEFAULT 0,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  closed_at        DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_defects_uuid (uuid),
  KEY idx_defect_project (project_id),
  KEY idx_defect_status (status),
  KEY idx_defect_severity (severity),
  CONSTRAINT fk_defect_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_defect_test_case
    FOREIGN KEY (test_case_id) REFERENCES test_cases(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_defect_created_by
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_defect_assigned_to
    FOREIGN KEY (assigned_to) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS defect_status_history (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  defect_id        BIGINT UNSIGNED NOT NULL,
  from_status      ENUM('OPEN','ASSIGNED','ESCALATED','RETEST','TO_DEPLOY','REOPEN','CLOSED') NULL,
  to_status        ENUM('OPEN','ASSIGNED','ESCALATED','RETEST','TO_DEPLOY','REOPEN','CLOSED') NOT NULL,
  changed_by       BIGINT UNSIGNED NOT NULL,
  note             TEXT NULL,
  changed_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_defect_history_defect (defect_id),
  KEY idx_defect_history_status (to_status),
  CONSTRAINT fk_dsh_defect
    FOREIGN KEY (defect_id) REFERENCES defects(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_dsh_user
    FOREIGN KEY (changed_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS execution_defects (
  execution_id     BIGINT UNSIGNED NOT NULL,
  defect_id        BIGINT UNSIGNED NOT NULL,
  PRIMARY KEY (execution_id, defect_id),
  CONSTRAINT fk_ed_execution
    FOREIGN KEY (execution_id) REFERENCES executions(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_ed_defect
    FOREIGN KEY (defect_id) REFERENCES defects(id)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- COMMENTS & ATTACHMENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS comments (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type      ENUM('PROJECT','TEST_CASE','TEST_CYCLE','EXECUTION','DEFECT','REPORT') NOT NULL,
  entity_id        BIGINT UNSIGNED NOT NULL,
  body             TEXT NOT NULL,
  created_by       BIGINT UNSIGNED NOT NULL,
  updated_by       BIGINT UNSIGNED NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_comments_entity (entity_type, entity_id),
  CONSTRAINT fk_comments_creator
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_comments_updater
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS attachments (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  entity_type      ENUM('PROJECT','TEST_CASE','TEST_CYCLE','EXECUTION','DEFECT','REPORT') NOT NULL,
  entity_id        BIGINT UNSIGNED NOT NULL,
  file_name        VARCHAR(255) NOT NULL,
  file_url         VARCHAR(1024) NOT NULL,
  mime_type        VARCHAR(150) NULL,
  size_bytes       BIGINT UNSIGNED NULL,
  uploaded_by      BIGINT UNSIGNED NOT NULL,
  uploaded_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_attachments_entity (entity_type, entity_id),
  CONSTRAINT fk_attachments_user
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- REPORTS & RUNS
-- =============================================================================

CREATE TABLE IF NOT EXISTS reports (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  uuid             CHAR(36) NOT NULL DEFAULT (UUID()),
  project_id       BIGINT UNSIGNED NOT NULL,
  title            VARCHAR(255) NOT NULL,
  type             ENUM('EXECUTION_PER_SPRINT','OVERALL_TEST_EXECUTION','CUSTOM') NOT NULL DEFAULT 'CUSTOM',
  params_json      JSON NULL,
  generated_url    VARCHAR(1024) NULL,
  created_by       BIGINT UNSIGNED NOT NULL,
  updated_by       BIGINT UNSIGNED NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reports_uuid (uuid),
  KEY idx_reports_project (project_id),
  CONSTRAINT fk_reports_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_reports_creator
    FOREIGN KEY (created_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT fk_reports_updater
    FOREIGN KEY (updated_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS report_runs (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  report_id        BIGINT UNSIGNED NOT NULL,
  run_by           BIGINT UNSIGNED NOT NULL,
  run_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status           ENUM('QUEUED','RUNNING','SUCCESS','FAILED') NOT NULL DEFAULT 'SUCCESS',
  output_url       VARCHAR(1024) NULL,
  error_message    TEXT NULL,
  PRIMARY KEY (id),
  KEY idx_report_runs_report (report_id),
  CONSTRAINT fk_report_runs_report
    FOREIGN KEY (report_id) REFERENCES reports(id)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_report_runs_user
    FOREIGN KEY (run_by) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- ACTIVITY LOG
-- =============================================================================

CREATE TABLE IF NOT EXISTS activity_logs (
  id               BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  project_id       BIGINT UNSIGNED NULL,
  actor_user_id    BIGINT UNSIGNED NOT NULL,
  entity_type      ENUM('PROJECT','TEST_CASE','TEST_CYCLE','EXECUTION','DEFECT','REPORT','PARAMETER') NOT NULL,
  entity_id        BIGINT UNSIGNED NOT NULL,
  action           VARCHAR(120) NOT NULL,
  meta_json        JSON NULL,
  created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_activity_project (project_id),
  KEY idx_activity_entity (entity_type, entity_id),
  CONSTRAINT fk_activity_project
    FOREIGN KEY (project_id) REFERENCES projects(id)
    ON UPDATE CASCADE ON DELETE SET NULL,
  CONSTRAINT fk_activity_actor
    FOREIGN KEY (actor_user_id) REFERENCES users(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
