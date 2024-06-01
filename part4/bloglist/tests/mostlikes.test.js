const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')


describe('most likes', () => {

  test('when list has only one blog, returns that', () => {
    const result = listHelper.mostLikes(helper.listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 5
    })
  })

  test('returns empty object when empty list', () => {
    const result = listHelper.mostLikes([])
    assert.deepStrictEqual(result, {})
  })

  test('of a bigger list', () => {
    const result = listHelper.mostLikes(helper.listWithMultipleBlogs)
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17
    })
  })
})
