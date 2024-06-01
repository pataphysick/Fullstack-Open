const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const helper = require('./test_helper')


describe('most blogs', () => {

  test('when list has only one blog, returns that', () => {
    const result = listHelper.mostBlogs(helper.listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    })
  })

  test('returns empty object when empty list', () => {
    const result = listHelper.mostBlogs([])
    assert.deepStrictEqual(result, {})
  })

  test('of a bigger list', () => {
    const result = listHelper.mostBlogs(helper.listWithManyBlogs)
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3
    })
  })
})
