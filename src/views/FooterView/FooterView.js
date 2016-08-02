/* @flow */
import React from 'react'

export class FooterView extends React.Component {
  render () {
    return (
      <div className="ui vertical footer text-center segment">
        Dropbox HackWeek July 2016 -&nbsp;
        <a href="https://github.com/rubengarciam/dropbox-content-discoverer">
          Improving content discovery in Dropbox through search and intelligence
        </a>
        &nbsp;- non-official, un-supported project made with <i className="heart icon"></i> by a bunch of Dropboxers
      </div>
    )
  }
}
