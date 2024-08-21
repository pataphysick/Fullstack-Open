const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        name: 'James Joyce',
        username: 'jjoyce',
        password: 'riverrun'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Login to application')).toBeVisible()
  })

  describe('Login', () => {
    test('Succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'jjoyce', 'riverrun')
      await expect(page.getByText('James Joyce logged in.')).toBeVisible()
    })

    test('Fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'jjoyce', 'wrong')
      const errorDiv = await page.locator('.error')
      await expect(page.getByText('Wrong username or password')).toBeVisible()
      await expect(errorDiv).toHaveCSS('border-style', 'solid')
      await expect(errorDiv).toHaveCSS('color', 'rgb(255, 0, 0)')
      await expect(page.getByText('James Joyce logged in')).not.toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'jjoyce', 'riverrun')
      })

      test('A new blog can be created', async ({ page }) => {
        await createBlog(page, 'Finnegans Wake', 'James Joyce', 'fw.xxx')
        await expect(page.getByText('Finnegans Wake James Joyce')).toBeVisible()
      })

      test('A blog can be liked', async ({ page }) => {
        await createBlog(page, 'Finnegans Wake', 'James Joyce', 'fw.xxx')
        await expect(page.getByText('Finnegans Wake James Joyce')).toBeVisible()
        await page.getByRole('button', { name: 'view' }).click()
        await page.getByRole('button', { name: 'Like' }).click()
        await expect(page.getByText('Likes: 1')).toBeVisible()
      })
    })
  })
})
