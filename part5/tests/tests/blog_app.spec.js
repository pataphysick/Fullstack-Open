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

      describe('With blog added', async () => {
        beforeEach(async ({ page }) => {
          await createBlog(page, 'Finnegans Wake', 'James Joyce', 'fw.xxx')
        })

        test('A blog can be liked', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          await page.getByRole('button', { name: 'Like' }).click()
          await expect(page.getByText('Likes: 1')).toBeVisible()
        })

        test('A blog can be deleted', async ({ page }) => {
          await page.getByRole('button', { name: 'view' }).click()
          //page.on('dialog', dialog => dialog.accept())
          await expect(page.getByRole('button', { name: 'Delete blog' })).toBeVisible()
          await page.getByRole('button', { name: 'Delete blog' }).click()
          await expect(page.getByText('Deleted blog Finnegans Wake')).toBeVisible()
        })

        test("Can't delete blog with different user", async({ page, request }) => {
          // Add new user
          await request.post('/api/users', {
            data: {
              name: 'Virginia Woolf',
              username: 'vwoolf',
              password: 'waves'
            }
          })
          await page.goto('/')

          // Check for delete button with old user
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'Delete blog' })).toBeVisible()

          // Log out and back in as new user
          await page.getByRole('button', { name: 'Logout' }).click()
          await loginWith(page, 'vwoolf', 'waves')

          // Check for delete button with new user
          await page.getByRole('button', { name: 'view' }).click()
          await expect(page.getByRole('button', { name: 'Delete blog' })).not.toBeVisible()
        })

      })
    })
  })
})
