/* @flow */
import React from 'react'

function days_between(date1, date2) {
    var ONE_DAY = 1000 * 60 * 60 * 24
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()
    var difference_ms = Math.abs(date1_ms - date2_ms)
    return Math.round(difference_ms/ONE_DAY)
}

export class ResultsView extends React.Component {
  constructor(props){
    super(props);
  }

  renderFile(file, key){
    //console.log(file);
    let path = file.metadata.path_display;
    return (
    <div className="event" key={key}>
      <div className="label">
        <i className="file text outline icon"></i>
      </div>
      <div className="content">
        <div className="summary">
          <span className="file">{file.metadata.name}</span>
          in the <a>{path.slice(0,path.lastIndexOf("/"))}</a> folder
        </div>
      </div>
      <div className="ui right floated date">
          {days_between(new Date(file.metadata.client_modified), new Date())}d ago
      </div>
    </div>
    )
  }

  renderFolder(file, key){
    //console.log(file);
    let path = file.metadata.path_display;
    return (
    <div className="event" key={key}>
      <div className="label">
        <i className="folder outline icon"></i>
      </div>
      <div className="content">
        <div className="summary">
          <span className="file">{file.metadata.name}</span>
          in <a>{path.slice(0,path.lastIndexOf("/"))}</a>
        </div>
      </div>
      <div className="ui right floated date">
          3d ago
      </div>
    </div>
    )
  }

  renderResults(files){
    if (files) {
      var self = this;
      return files.map(function(item, key) {
        return (item.metadata[".tag"] == "folder") ? self.renderFolder(item, key): self.renderFile(item, key)
      })
    }
  }

  render () {
    return (
      <div className="ui feed">
        {this.renderResults(this.props.files)}
      </div>
    )
  }
}
