import * as K from '../src/_kit';
import * as FC from 'fast-check';
import { IndexSig } from '../src/_kit';
import { testProp, genInCharset, property, prettyPrint } from './utils';
import { produce } from 'immer';
import * as AST from '../src/_ast';
import * as JSRE from '../src/grammar/_jsre';
import * as _ from 'lodash';

import { assert, expect } from 'chai';

import { JSREGen } from './grammar/JSRESpec';

console.log(JSREGen);
