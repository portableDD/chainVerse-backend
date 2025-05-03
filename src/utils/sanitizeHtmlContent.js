const sanitizeHtml = require("sanitize-html");

const sanitizeHtmlContent = (content) => {
  const allowedTags = sanitizeHtml.defaults.allowedTags.concat([
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "blockquote",
    "p",
    "a",
    "ul",
    "ol",
    "li",
    "b",
    "i",
    "strong",
    "em",
    "strike",
    "code",
    "hr",
    "br",
    "div",
    "table",
    "thead",
    "caption",
    "tbody",
    "tr",
    "th",
    "td",
    "pre",
    "img",
  ]);

  const allowedAttributes = {
    ...sanitizeHtml.defaults.allowedAttributes,
    a: ["href", "name", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    div: ["class", "id", "style"],
    span: ["class", "id", "style"],
    p: ["class", "id", "style"],
    table: ["class", "id", "style", "border"],
  };

  return sanitizeHtml(content, {
    allowedTags,
    allowedAttributes,
  });
};

module.exports = { sanitizeHtmlContent };