// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See ibuyit-parser-tests.js for an example of importing.
// export const name = 'ibuyit-parser';

if (!IbuyitParse) IbuyitParse = {};

IbuyitParse.parse = (scv, options) => {
  return Baby.parse(scv, options);
};
