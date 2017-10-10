/* @flow */

import findWithRegex from 'find-with-regex';
import escapeRegExp from 'lodash.escaperegexp';

export default (trigger: string, regExp: string) => (contentBlock: Object, callback: Function) => {
  const reg = new RegExp(String.raw({
    raw: `(\\s|^)${escapeRegExp(trigger)}${regExp}` // eslint-disable-line no-useless-escape
  }), 'g');
  findWithRegex(reg, contentBlock, (start, end) => {
    const isAlreadyEntity = contentBlock.getEntityAt(Math.max(end - 1, 0)) !== null;
    if (!isAlreadyEntity) callback(start, end);
  });
};
