// src/utils/auditLogger.js

const fs = require('fs');
const path = require('path');

const auditDir = path.join(__dirname, '../../logs');
const auditLogPath = path.join(auditDir, 'audit.log');

// Ensure logs directory exists
if (!fs.existsSync(auditDir)) {
    fs.mkdirSync(auditDir, { recursive: true });
}

// Append audit entry to a file
exports.logAudit = async (userId, action, meta = {}) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp,
        userId,
        action,
        ...meta,
    };

    // Log as a JSON string
    fs.appendFile(
        auditLogPath,
        JSON.stringify(logEntry) + '\n',
        (err) => {
            if (err) console.error('Failed to write audit log:', err);
        }
    );
};
