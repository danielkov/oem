const c = str => str[0].toUpperCase() + str.substr(1);
const u = str => str.toUpperCase();

const indexTSX = ({ name }) => `import * as React from 'react'
import { FC } from 'react'

import './index.scss'

export type ${c(name)}Props = {}

const ${c(name)} = (): FC<${c(name)}Props> => {
    return null
}

${c(name)}.propTypes = {}

${c(name)}.defaultProps = {}

export default ${c(name)}
`;

const indexSCSS = () => ``;

const specTSX = ({ name }) => `import * as React from 'react'
import { render } from '@testing-library/react'
import ${c(name)} from '../'

describe(<${c(name)} />, () => {
    it('Renders without crashing', () => {
        render(<${c(name)} />)
    })
})`;

const storeTS = ({ name, actions = "" }) => {
  const a = actions.split(",").filter(Boolean);
  const constants = a

    .map(
      action =>
        `export const ${u(name)}_${u(action)} = '${u(name)}_${u(action)}'`
    )
    .join("\n");

  const actionCreators = a
    .map(
      action =>
        `export const ${action} = createAction(${u(name)}_${u(action)});`
    )
    .join("\n");

  const reducers = a
    .map(action => `[${u(name)}_${u(action)}.toString()]: () => {},`)
    .join("\n");
  return `import { createReducer, createAction } from '@reduxjs/toolkit'

${constants}

${actionCreators}

const initialState = {}

const reducer = createReducer(initialState, {
    ${reducers}
})

export default reducer
`;
};

const component = ({ name }) => ({
  [name]: {
    "index.tsx": indexTSX,
    "index.scss": indexSCSS,
    __test__: {
      [`${name}.spec.tsx`]: specTSX
    }
  }
});

const feature = ({ name }) => ({
  features: {
    [name]: {
      components: component({ name }),
      store: {
        "index.ts": storeTS
      }
    }
  }
});

component.description = "Scaffolding for a React Component";

component.args = {
  name: "Name of the component"
};

/**
 * @example
 * ```sh
 * oem component --name Example
 * ```
 * generates:
 * ```sh
 * - Example
 * - - index.tsx
 * ```
 */
module.exports = {
  component,
  c: component,
  feature,
  f: feature
};
