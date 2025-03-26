// This is a simplified in-memory rate limiter
// In a production environment, you would use Redis or a similar solution

const rateLimitStore = {}

/**
 * Apply rate limiting to a specific identifier
 * @param {String} identifier - Unique identifier for the rate limit (e.g., userId_endpoint)
 * @param {Number} limit - Maximum number of requests allowed in the time window
 * @param {Number} windowInSeconds - Time window in seconds
 * @returns {Promise<Object>} - Promise resolving to rate limit status
 */
exports.rateLimit = async (identifier, limit, windowInSeconds) => {
  const now = Date.now()

  // Get or create rate limit entry
  const entry = rateLimitStore[identifier] || {
    count: 0,
    resetAt: now + windowInSeconds * 1000,
  }

  // Reset if window has expired
  if (now > entry.resetAt) {
    entry.count = 0
    entry.resetAt = now + windowInSeconds * 1000
  }

  // Increment count
  entry.count++

  // Update store
  rateLimitStore[identifier] = entry

  return {
    success: entry.count <= limit,
    current: entry.count,
    limit,
    remaining: Math.max(0, limit - entry.count),
    resetAt: entry.resetAt,
  }
}

