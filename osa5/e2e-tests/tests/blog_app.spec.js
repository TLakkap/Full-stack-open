const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                "username": "akuankka",
                "name": "Mikki Hiiri",
                "password": "salasana"
            }
        })
        
        await page.goto('/')
    })

    test('login form is shown', async ({ page }) => {
        const locator = page.getByText('Login').first()
        await expect(locator).toBeVisible()
    })

    describe('Login', () => {

        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'akuankka', 'salasana')
            await expect(page.getByText('Mikki Hiiri logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'akuankka', 'wrong')
            await expect(page.getByText('wrong username or password')).toBeVisible()
            await expect(page.getByText('Mikki Hiiri logged in')).not.toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await loginWith(page, 'akuankka', 'salasana')
        })
      
        test('a new blog can be created', async ({ page }) => {
            await createBlog(page, 'a blog created by playwright', 'playwright', 'playwright')
            await expect(page.getByText('new blog a blog created by playwright')).toBeVisible()
        })

        describe('and a blog exists', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, 'a blog created by playwright', 'playwright', 'playwright')
            })

            test('a blog can be liked', async ({ page }) => {
                await page.getByRole('button', { name: 'view' }).click()
                await page.getByRole('button', { name: 'Like' }).click()
                await expect(page.getByText('Likes 1')).toBeVisible()
            })
        })
    })
})
