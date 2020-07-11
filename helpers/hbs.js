const moment = require('moment')

module.exports = {
  formatDate: (date, format) => {
    return moment(date).format(format)
  },
  truncate: (str, len) => {
    if (str.length > len && str.length > 0) {
      let new_str = str + ''
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stringTags: (input) => {
    return input.replace(/<(?:.|n)*?>/gm, '')
  },
  editIcon: (reviewUser, loggedUser, reviewId, floating = true) => {
    if (reviewUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/reviews/edit/${reviewId}" class="btn-floating halfway-fab waves-effect waves-light blue">
          <i class="fas fa-edit fa-small"></i>
        </a>`
      } else {
        return `<a href="/reviews/edit/${reviewId}">
          <i class="fas fa-edit"></i>
        </a>`
      }
    } else {
      return ''
    }
  },
  select: (selected, options) => {
    return options.fn(this).replace(new RegExp(' value="' + selected + '"'), '$& selected="selected"')
      .replace(new RegExp('>' + selected + '</option>'), ' selected="selected"$&')
  }
}