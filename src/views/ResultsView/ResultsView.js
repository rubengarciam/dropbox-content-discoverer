/* @flow */
import React from 'react'

const DATE_FILTERS = {
  'LAST DAY' : "last 1 day",
  'LAST WEEK' : "last 7 day",
  'LAST MONTH' : "last 31 day",
  'LAST YEAR' : "last 365 day"
};

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
    this.showFolders = this.showFolders.bind(this);
    this.state = {
      folders: false
    };
  }

  getDays(date) {
    var numb = date.match(/\d/g);
    if (!numb) { return 0 }
    numb = numb.join("");
    if (date.includes("day")) { return numb }
    else if (date.includes("month")) { return numb*30 }
    else if (date.includes("year")) { return numb*365 }
    return 0;
  }

  filterFormats(name){
    if (this.props.formats.length > 0) {
      var filtered = false;
      this.props.formats.map(function (format){
        if (name.toUpperCase().includes('.'+format.toUpperCase())) { filtered = true }
      })
      return filtered
    } else { return true }
  }

  filterDate(dated){
    let filters = this.props.filters;
    let date;
    if (filters && filters["Date"]) {
      let value = DATE_FILTERS[filters["Date"].toUpperCase()];
      if (value) { date = value } else { date = filters["Date"] }
      if (dated <= this.getDays(date)) { return true }
        else { return false; }
    }
    return true;
  }

  filterPerson(file) {
    let filters = this.props.filters;
    if (filters && filters["Person"]) {
      if (!file.metadata.sharing_info) { return false };
      if (file.metadata.sharing_info.parent_shared_folder_id.toUpperCase().includes(filters["Person"].toUpperCase())) {
          return true;
      }
      return false;
    }
    return true;
  }

  renderFile(file, key){
    let path = file.metadata.path_display;
    let url = "https://dropbox.com/work"+path;
    let dated = days_between(new Date(file.metadata.client_modified), new Date());
    if (this.filterDate(dated) && this.filterFormats(file.metadata.name) && this.filterPerson(file)) {
    //if (this.filterDate(dated) && this.filterFormats(file.metadata.name)) {
      return (
      <div className="event" key={key}>
        <div className="label">
          <i className="file text outline icon"></i>
        </div>
        <div className="content">
          <div className="summary">
            <span className="file">
              <a href={url}>{file.metadata.name}</a>
            </span>
            in the <a className="path">{path.slice(0,path.lastIndexOf("/"))}</a> folder
            { file.metadata.sharing_info ? (
              <div className="shared">Shared by {file.metadata.sharing_info.parent_shared_folder_id}</div>
            ) : null}
          </div>
        </div>
        <div className="ui right floated date">
            {dated}d ago
        </div>
      </div>
      )
    }
  }

  renderFolder(file, key){
    let path = file.metadata.path_display;
    let url = "https://dropbox.com/work"+path;
    if (this.state.folders) {
      return (
      <div className="event" key={key}>
        <div className="label">
          <i className="folder outline icon"></i>
        </div>
        <div className="content">
          <div className="summary">
            <span className="file">
              <a href={url}>{file.metadata.name}</a>
            </span>
            in <a className="path">{path.slice(0,path.lastIndexOf("/"))}</a>
          </div>
        </div>
      </div>
      )
    }
  }

  showFolders(e){
    this.setState({
      folders: !this.state.folders
    })
  }

  renderFoldersToggle(){
    if (this.props.files) {
      return (
        <div className="ui right floated basic segment folders">
          <div className="ui toggle checkbox">
            <input type="checkbox" value="true" onClick={this.showFolders} name="folders" />
            <label><i className="folder outline large icon"></i></label>
          </div>
        </div>
      )
    }
  }

  renderResults(files){
    if (files) {
      var self = this;
      return files.map(function(item, key) {
        return (item.metadata[".tag"] == "folder") ? self.renderFolder(item, key): self.renderFile(item, key)
      })
    }
  }

  transformSharedNames(){
    let filters = this.props.filters;
    var newFiles = this.props.files;
    var self = this;
    if (this.props.shares.length > 0) {
      newFiles.map(function(file, key) {
        if (file.metadata.sharing_info) {
        self.props.shares.map(function (folder){
          if (folder.folderid == file.metadata.sharing_info.parent_shared_folder_id) {
                file.metadata.sharing_info.parent_shared_folder_id = folder.username;
          }
        })
      }
    }) }
    return newFiles;
  }

  render () {
    var files = this.transformSharedNames();
    return (
      <div className="results">
        {this.renderFoldersToggle()}
        <div className="ui feed">
          {this.renderResults(files)}
        </div>
      </div>
    )
  }
}

// {this.renderResults(this.props.files)}
