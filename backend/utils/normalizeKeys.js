// utils/normalizeKeys.js
function toCamelCase(obj) {
  const newObj = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
    newObj[camelKey] = obj[key] === null ? 'N/A' : obj[key];
  }
  return newObj;
}

module.exports = { toCamelCase };
