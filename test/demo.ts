import * as K from '../src/kit';
import * as FC from 'fast-check';
import { IndexSig } from '../src/kit';
import { testProp, genInCharset, property, prettyPrint } from './utils';
import { produce } from 'immer';
import * as AST from '../src/ast';
import * as JSRE from '../src/grammar/jsre';
import * as _ from 'lodash';

import { assert, expect } from 'chai';

import { JSREGen } from './grammar/JSRESpec';

console.log(JSREGen);
