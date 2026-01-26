-- Clear existing data
DELETE FROM calendar_events;
DELETE FROM app_config;
DELETE FROM periods;

-- Insert Holidays
INSERT INTO calendar_events (date, name, event_type) VALUES
(strftime('%s', '2026-01-01'), "New Year's Day", 'holiday'),
(strftime('%s', '2026-01-19'), 'Martin Luther King Jr Day', 'holiday'),
(strftime('%s', '2026-02-16'), "Presidents' Day", 'holiday'),
(strftime('%s', '2026-03-23'), 'Spring Break', 'holiday'),
(strftime('%s', '2026-03-24'), 'Spring Break', 'holiday'),
(strftime('%s', '2026-03-25'), 'Spring Break', 'holiday'),
(strftime('%s', '2026-03-26'), 'Spring Break', 'holiday'),
(strftime('%s', '2026-03-27'), 'Spring Break', 'holiday'),
(strftime('%s', '2026-04-16'), 'Crucible (No Classes)', 'holiday'),
(strftime('%s', '2026-04-17'), 'Crucible (No Classes)', 'holiday'),
(strftime('%s', '2026-05-25'), 'Memorial Day', 'holiday');

-- Insert Modified SoC Events
INSERT INTO calendar_events (date, name, event_type) VALUES
(strftime('%s', '2026-01-23'), 'Modified SoC (Jan 23)', 'modified_soc'),
(strftime('%s', '2026-02-06'), 'Modified SoC (Feb 6)', 'modified_soc'),
(strftime('%s', '2026-02-27'), 'Modified SoC (Feb 27)', 'modified_soc'),
(strftime('%s', '2026-03-13'), 'Modified SoC (Mar 13)', 'modified_soc'),
(strftime('%s', '2026-04-03'), 'Modified SoC (Apr 3)', 'modified_soc'),
(strftime('%s', '2026-04-15'), 'Modified SoC (Apr 15 - Crucible Begins)', 'modified_soc'),
(strftime('%s', '2026-05-01'), 'Modified SoC (May 1)', 'modified_soc');

-- Insert Periods
INSERT INTO periods (id, label, start_time, end_time, modified_start_time, modified_end_time) VALUES
(1, '1', '07:30', '08:23', NULL, NULL),
(2, '2', '08:30', '09:23', NULL, NULL),
(3, '3', '09:30', '10:23', NULL, NULL),
(4, '4', '10:30', '11:23', NULL, NULL),
(5, '5', '13:30', '14:23', '12:30', '13:23'),
(6, '6', '14:30', '15:23', '13:30', '14:23');

-- Insert App Configuration
INSERT INTO app_config (key, value) VALUES
('first_day', '2026-01-06T00:00:00.000Z');