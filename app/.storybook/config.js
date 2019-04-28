import { gaId } from '../package.json'

window.STORYBOOK_GA_ID = gaId

import { configure, addDecorator, addParameters } from '@storybook/react'
import { withA11y } from '@storybook/addon-a11y'
import { withInfo } from '@storybook/addon-info'
import centered from '@storybook/addon-centered/react'
import { withTests } from '@storybook/addon-jest'
import { withKnobs } from '@storybook/addon-knobs'
import { INITIAL_VIEWPORTS } from '@storybook/addon-viewport'

import results from '../.jest/results.json'

addDecorator(withKnobs)
addDecorator(withA11y)
addDecorator(centered)
addDecorator(withInfo)
addDecorator(
   withTests({
      results,
   }),
)

addParameters({
   viewport: {
      viewports: {
         ...INITIAL_VIEWPORTS,
      },
   },
})

function loadStories() {
   require('../src/stories')
}

configure(loadStories, module)
