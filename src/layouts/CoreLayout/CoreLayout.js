import React, { PropTypes } from 'react'
import '../../styles/core.scss'
import DropboxGlyph from './dropbox_glyph_blue.svg'

// Note: Stateless/function components *will not* hot reload!
// react-transform *only* works on component classes.
//
// Since layouts rarely change, they are a good place to
// leverage React's new Stateless Functions:
// https://facebook.github.io/react/docs/reusable-components.html#stateless-functions
//
// CoreLayout is a pure function of its props, so we can
// define it with a plain javascript function...
function CoreLayout ({ children }) {
  return (
    <div className='page-container'>
      <div className='view-container'>
        <div className="ui sidebar visible vertical menu">
          <img className="logo"
            src={DropboxGlyph}
            alt='Dropbox' />
          <h3>Filter by</h3>
          <a className="item">1</a>
          <a className="item">2</a>
          <a className="item">3</a>
          <h3>Order by</h3>
          <a className="item">1</a>
          <a className="item">2</a>
          <a className="item">3</a>
        </div>
        <div className="pusher">
              {children}
        </div>
      </div>
    </div>
  )
}

CoreLayout.propTypes = {
  children: PropTypes.element
}

export default CoreLayout
