const experess = require('express')

const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Review = require('../models/Review')

const router = experess.Router()


// Landing page
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login'
  })
})

// Dash Board
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const reviews = await Review.find({writer: req.user.id}).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      reviews
    })
  } catch (error) {
    console.log(error)
    res.render('error/500')
  }
})


module.exports = router