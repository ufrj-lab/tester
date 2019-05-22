import { arraysEqualIds, testPath, statusStepResult } from './Test'

const { success, partial, fail } = statusStepResult
describe('Test user path', () => {
  test('array', () => {
    expect(arraysEqualIds(['a'], ['a'])).toBe(false)
  })
  test('array', () => {
    expect(arraysEqualIds(['a'], ['b'])).toBe(false)
  })
  test('array', () => {
    expect(arraysEqualIds([{ id: 'a' }], [{ id: 'a' }])).toBe(true)
  })
  test('array', () => {
    expect(arraysEqualIds([{ id: 'a' }, { id: 'b' }], ['b'])).toBe(false)
  })
  test('array', () => {
    expect(
      arraysEqualIds([{ id: 'a' }, { id: 'b' }], [{ id: 'b' }, { id: 'a' }]),
    ).toBe(false)
  })
  test('array', () => {
    expect(arraysEqualIds([{ id: 'a' }, { id: 'b' }], [{ id: 'a' }])).toBe(
      false,
    )
  })
  test('path', () => {
    expect(
      testPath(
        [
          {
            id: 'cjvz9asgg00650944ml9nd0s2',
          },
          {
            id: 'cjvz9asgl00670944m403eqfj',
          },
        ],
        [
          {
            items: [
              {
                id: 'cjvz9asgg00650944ml9nd0s2',
              },
              {
                id: 'cjvz9asgl00670944m403eqfj',
              },
            ],
          },
        ],
        [
          {
            id: 'cjvz9asgl00670944m403eqfj',
          },
        ],
      ),
    ).toBe(success)
  })
  test('path', () => {
    expect(
      testPath(
        [
          {
            id: 'cjvz9arof00370944u0n8syum',
          },
          {
            id: 'cjvz9asgx006d0944rjvnsbmq',
          },
          {
            id: 'cjvz9ash4006h0944fvz9uztt',
          },
        ],
        [
          {
            items: [
              {
                id: 'cjvz9asgx006d0944rjvnsbmq',
              },
              {
                id: 'cjvz9ash4006h0944fvz9uztt',
              },
            ],
          },
          {
            items: [
              {
                id: 'cjvz9arq5003v0944ew3bf43b',
              },
              {
                id: 'cjvz9arqc003x0944au10ag4h',
              },
              {
                id: 'cjvz9ash4006h0944fvz9uztt',
              },
            ],
          },
        ],
        [
          {
            id: 'cjvz9ash4006h0944fvz9uztt',
          },
        ],
      ),
    ).toBe(partial)
  })
  test('path', () => {
    expect(
      testPath(
        [
          {
            id: 'cjvz9arof00370944u0n8syum',
          },
          {
            id: 'cjvz9arq5003v0944ew3bf43b',
          },
          {
            id: 'cjvz9arqc003x0944au10ag4h',
          },
          {
            id: 'cjvz9ash4006h0944fvz9uztt',
          },
        ],
        [
          {
            items: [
              {
                id: 'cjvz9asgx006d0944rjvnsbmq',
              },
              {
                id: 'cjvz9ash4006h0944fvz9uztt',
              },
            ],
          },
          {
            items: [
              {
                id: 'cjvz9arq5003v0944ew3bf43b',
              },
              {
                id: 'cjvz9arqc003x0944au10ag4h',
              },
              {
                id: 'cjvz9ash4006h0944fvz9uztt',
              },
            ],
          },
        ],
        [
          {
            id: 'cjvz9ash4006h0944fvz9uztt',
          },
        ],
      ),
    ).toBe(partial)
  })
  test('path', () => {
    expect(
      testPath(
        [
          { id: 'cjvzebwys006t0999so0rquvr' },
          { id: 'cjvzebwy4006h0999vszf7cfy' },
        ],
        [
          {
            items: [
              { id: 'cjvzebwxt006b0999mgiwb5ps' },
              { id: 'cjvzebwy4006h0999vszf7cfy' },
            ],
          },
          {
            items: [
              { id: 'cjvzebwy4006h0999vszf7cfy' },
              { id: 'cjvzebwys006t0999so0rquvr' },
            ],
          },
          {
            items: [
              { id: 'cjvzebwgi002z0999nt9844e1' },
              { id: 'cjvzebwo700310999jujz84w4' },
              { id: 'cjvzebwy4006h0999vszf7cfy' },
            ],
          },
          {
            items: [
              { id: 'cjvzebwrr003t09991djepku8' },
              { id: 'cjvzebwy4006h0999vszf7cfy' },
              { id: 'cjvzebwys006t0999so0rquvr' },
            ],
          },
        ],
        [{ id: 'cjvzebwy4006h0999vszf7cfy' }],
      ),
    ).toBe(success)
  })
})
