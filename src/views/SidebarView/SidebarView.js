/* @flow */
import React, {} from 'react'
import DropboxGlyph from './dropbox_glyph_blue.svg'

type Props = {};

export class SidebarView extends React.Component<void, Props, void> {
  render () {
    return (
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
    )
  }
}
