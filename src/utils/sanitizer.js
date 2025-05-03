// Sanitizer to strip dangerous html attributes and links from content
const sanitizeHtml = require('sanitize-html');

const sanitizeContent = (html) => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h1', 'h2']),
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt'],
      '*': ['style']
    }
  });
};

module.exports = { sanitizeContent };