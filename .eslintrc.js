module.exports = {
    "plugins": [
        "html"
    ],
    "settings": {
        "html/xml-extensions": [".html"],  // consider .html files as XML
    },
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
    }
};