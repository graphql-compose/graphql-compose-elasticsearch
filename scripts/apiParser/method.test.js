/* @flow */

import fs from 'fs';
import path from 'path';
import dox from 'dox';

const t = fs.readFileSync(path.resolve(__dirname, 'search.txt'), 'utf8');
// console.log(t);

function parseDescription(str: string): string {
  const strCleaned = str.replace(/{<<.+`(.*)`.+}/gi, '{$1}');
  const parsed = dox.parseComments(strCleaned, { raw: true });
  console.dir(parsed, { depth: 5, colors: 1});
  // console.log(str.match(/[ \t]*\/\*\*\s*\n([^*]*(\*[^/])?)*\*\//g));
}

describe('API Parser: method', () => {
  it('should', () => {
    parseDescription(t);
  });
});
