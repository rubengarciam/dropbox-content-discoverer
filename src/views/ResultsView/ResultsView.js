/* @flow */
import React from 'react'

export class ResultsView extends React.Component {
  render () {
    return (
      <div className="ui feed">
        <div className="event">
          <div className="label">
            <i className="file powerpoint outline icon"></i>
          </div>
          <div className="content">
              <div className="summary">
              <span className="file">File 1.ppt</span> Created by <a>Jenny Hess</a> in the <a>marketing</a> shared folder
                <div className="date">
                  3 days ago
                </div>
            </div>
          </div>
          <div className="ui right floated primary button">Open</div>
        </div>
        <div className="event">
          <div className="label">
            <i className="file text outline icon"></i>
          </div>
          <div className="content">
              <div className="summary">
              <span className="file">File 1.txt</span> Created by <a>you</a> in the <a>hackweek 2016</a> shared folder
                <div className="date">
                  2 weeks ago
                </div>
            </div>
          </div>
          <div className="ui right floated primary button">Open</div>
        </div>
        <div className="event">
          <div className="label">
            <i className="file pdf outline icon"></i>
          </div>
          <div className="content">
              <div className="summary">
              <span className="file">File 1.pdf</span> Created by <a>Jenny Hess</a> in the <a>marketing</a> shared folder
                <div className="date">
                  3 days ago
                </div>
            </div>
          </div>
          <div className="ui right floated primary button">Open</div>
        </div>
      </div>
    )
  }
}
