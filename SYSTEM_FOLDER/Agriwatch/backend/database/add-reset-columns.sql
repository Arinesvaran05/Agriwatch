ALTER TABLE users
  ADD COLUMN verification_code VARCHAR(10) NULL AFTER verification_token,
  ADD COLUMN verification_code_expires DATETIME NULL AFTER verification_code,
  ADD COLUMN reset_code VARCHAR(10) NULL AFTER reset_token,
  ADD COLUMN reset_code_expires DATETIME NULL AFTER reset_code;