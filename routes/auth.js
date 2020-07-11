const experess = require('express')
const passport = require('passport')
const router = experess.Router()

// Auth with google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))

// Google auth callback
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/'
}), (req, res) => {
  res.redirect('/dashboard')
})

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router