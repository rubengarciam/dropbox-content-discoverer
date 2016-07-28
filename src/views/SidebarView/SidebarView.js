/* @flow */
import React, {} from 'react'
import DropboxGlyph from './dropbox_glyph_blue.svg'

type Props = {};

export class SidebarView extends React.Component<void, Props, void> {
  constructor(props){
    super(props);
  }

  renderItem(header, value){
    return (
      <div>
        <h3>{header}</h3>
        <a className="item">{value}</a>
      </div>
    )
  }
  renderItems(header, items){
    return (
      <div>
        <h3>{header}</h3>
        {items.map(function(item, key) {
          return <a key={key} className="item">{item}</a>
        })}
      </div>
    )
  }
  renderDate(date) {
      return date ? this.renderItem("Date", date) : null;
  }
  renderPerson(person) {
      return person ? this.renderItem("Who", person) : null;
  }
  renderFormats(formats) {
      return (formats && formats.length > 0) ? this.renderItems("Format", formats) : null;
  }
  render () {
    let input = this.props.input;
    let pre = this.props.preFilters;
    let post = this.props.postFilters;
    return (
      <div className="ui sidebar visible vertical menu">
        <img className="logo" src={DropboxGlyph} alt='Dropbox' />
        { input ? this.renderItem("Search", input) : null }
        { post ? this.renderDate(post["Date"]) : null }
        { post ? this.renderPerson(post["Person"]) : null }
        { pre ? this.renderFormats(pre["fileTypes"]) : null }
      </div>
    )
  }
}
