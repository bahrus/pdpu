const jiife = require('jiife');
const xl = 'node_modules/xtal-latx/';
const define = xl + 'define.js';
const deb = xl + 'debounce.js';
const xlxl = xl + 'xtal-latx.js';
const ND = xl + 'NavDown.js';
const PDND = 'PDNavDown.js';
const cnp = xl + 'createNestedProp.js';
jiife.processFiles([define, xlxl, ND, PDND, 'p.js', 'p-d.js', 'p-u.js'], 'dist/p-d.p-u.iife.js');
jiife.processFiles(['tempTest.js', define, xlxl, ND, 'p.js', 'p-d.js'], 'dist/p-d.iife.js');
jiife.processFiles([define, xlxl, 'p.js', 'p-u.js'], 'dist/p-u.iife.js');
jiife.processFiles([define, xlxl, ND, PDND, cnp, 'p.js', 'p-d.js', 'p-d-r.js', 'p-d-x.js', 'p-u.js', 'p-destal.js', 'p-s.js'], 'dist/p-all.iife.js');
jiife.processFiles([define, deb, xlxl, 'PDQ.js'], 'dist/PDQ.iife.js');