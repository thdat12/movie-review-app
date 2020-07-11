const experess = require('express')

const { ensureAuth, ensureGuest } = require('../middleware/auth')
const Review = require('../models/Review')

const router = experess.Router()

// show add review
router.get('/add', ensureAuth, (req, res) => {
  res.render('reviews/add')
})

// Post review
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.writer = req.user.id
    await Review.create(req.body)
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error)
    res.render('error/500')
  }
})

// Get all reviews
router.get('/', ensureAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'public' }).populate('writer').sort({ createdAt: 'desc' }).lean()
    res.render('reviews/index', {
      reviews
    })
  } catch (error) {
    console.log(error)
    res.render('error/500')
  }
})

// Show edit review detail
router.get('/edit/:id', async (req, res) => {
  const review = await Review.findById(req.params.id).lean()
  if (!review) {
    return res.render('error/404')
  }
  if (review.writer != req.user.id) {
    res.redirect('/reviews')
  } else {
    res.render('reviews/edit', {
      review
    })
  }
})

// Update review
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let review = await Review.findById(req.params.id).lean()
    if (!review) {
      return res.render('error/404')
    }
    if (review.writer != req.user.id) {
      res.redirect('/reviews')
    } else {
      await Review.findByIdAndUpdate(
        { _id: req.params.id },
        {$set: req.body},
        {
          new: true,
          runValidators: true
        }
      )
      res.redirect('/dashboard')
    }
  } catch (error) {
    console.log(error)
    return res.render('error/500')
  }
})

// Delete review
router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    await Review.remove({ _id: req.params.id })
    res.redirect('/dashboard')
  } catch (error) {
    console.log(error)
    return res.render('error/500')
  }
})

// Get review by id
router.get('/:id', async (req, res) => {
  const review = await Review.findById(req.params.id).populate('writer').lean()
  if (!review) {
    return res.render('error/404')
  }
  if (review.writer._id != req.user.id) {
    res.redirect('/reviews')
  } else {
    res.render('reviews/detail', {
      review
    })
  }
})

// Get all review from user
router.get('/user/:id', async (req, res) => {
  try {
    const reviews = await Review.find({
      writer: req.params.id,
      status: 'public'
    }).populate('writer').lean()
    res.render('reviews/index', {
      reviews
    })
  } catch (error) {
    console.log(error)
    return res.render('error/500')
  }
})

module.exports = router