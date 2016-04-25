// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See ibuyit-parser-tests.js for an example of importing.
// export const name = 'ibuyit-parser';

if (!IbuyitParse) IbuyitParse = {};

IbuyitParse.parse = (scv, options) => {
  let res = Baby.parse(scv, options);
  return res.data;
};

IbuyitParse.parseFiles = (files, options) => {
  let res = Baby.parseFiles(files, options);
  return res.data;
};
