/* @flow */

import findWithRegex from 'find-with-regex';
import escapeRegExp from 'lodash.escaperegexp';

export default (trigger: string, regExp: string) => (contentBlock: Object, callback: Function) => {
  findWithRegex(new RegExp(`(\\s|^)${escapeRegExp(trigger)}${regExp}`, 'g'), contentBlock, (start, end) => {
    const isAlreadyEntity = contentBlock.getEntityAt(Math.max(end - 1, 0)) !== null;
    if (!isAlreadyEntity) callback(start, end);
  });
};
