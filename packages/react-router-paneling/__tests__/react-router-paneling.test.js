'use strict';

import { createPaneling } from '../lib/index.es.js'
import { strictEqual } from 'assert'

const route = createPaneling({
    panels: {},
    path: '/'
});

strictEqual(route.path, '/*');
console.info('reactRouterPaneling tests passed');
