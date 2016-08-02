/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { increment, doubleAsync } from '../../redux/modules/counter'
import {FooterView} from '../FooterView/FooterView'
import {ResultsView} from '../ResultsView/ResultsView'
import {SidebarView} from '../SidebarView/SidebarView'
var NLP = require('../../components/NLP')
var Auth = require('../../components/Auth')
var Dropbox = require('dropbox')
var DL = require('../../components/DropboxLib.js')

var CLIENT_ID = 'hdhsgxuttd41q5b'
var TOKEN = null
var dbx = new Dropbox({ clientId: CLIENT_ID })

export class HomeView extends React.Component {
  static propTypes = {
    counter: PropTypes.number.isRequired,
    doubleAsync: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired
  }
  constructor (props) {
    super(props)
    this.searchFiles = this.searchFiles.bind(this)
    var newToken = Auth.parseQueryString(window.location.hash).access_token
    if (newToken) {
      TOKEN = newToken
      location.href = '/#/'
    }
    this.state = {
      files: null,
      input: null,
      preFilters: null,
      postFilters: null,
      banner: true
    }
  }
  searchFiles (e) {
    var self = this
    let result = NLP.nlpInspect(e.target.value)
    dbx.filesSearch({query: result.input, path: ''})
      .then(function (response) {
        self.setState({
          files: response.matches,
          input: result.input,
          preFilters: result.pre,
          postFilters: result.post
        })
      })
      .catch(function (error) {
        console.log(error)
        return null
      })
  }
  checkNames () {
    var self = this
    setTimeout(function () {
      if ((DL.sharedFolderDetails.length > 0) && (DL.sharedFolderDetails[0].username !== 'realusername')) {
        self.setState({
          banner: false
        })
      } else {
        self.checkNames()
      }
    }, 1000)
  }
  componentDidMount () {
  }
  renderBanner () {
    if (this.state.banner) {
      DL.populateSharingDetails(TOKEN)
      this.checkNames()
      return (
        <div className="ui icon green tiny message">
          <i className="asterisk loading icon"></i>
          <div className="content">
            <div className="header">
              Just one second
            </div>
            <p>We're fetching people's names, shouldn't take long! :)</p>
          </div>
        </div>
      ) } else { null }
  }
  renderAuth () {
    if (TOKEN) {
      dbx.setAccessToken(TOKEN)
      var formats = (this.state.preFilters && this.state.preFilters.fileTypes) ? this.state.preFilters.fileTypes : null
      let inputClass = this.state.banner ? 'ui icon disabled input' : 'ui icon input'
      return (
        <div className='container text-center'>
          {this.renderBanner()}
          <div className={inputClass}>
            <input type="text"
              placeholder="Presentations shared by Ruben in the last week..."
              onChange={this.searchFiles} />
            <i className="search icon"></i>
          </div>
          <ResultsView files={this.state.files}
            formats={formats}
            filters={this.state.postFilters}
            shares={DL.sharedFolderDetails} />
        </div>
      )
    } else {
      // var url = dbx.getAuthenticationUrl('http://localhost:3000/')
      var url = dbx.getAuthenticationUrl('https://dropbox-content-discoverer.herokuapp.com/')
      return (
        <div className='container text-center'>
          <a className="ui blue login button" href={url}>
            <i className="dropbox icon"></i>
            <span className="text">Authenticate your Dropbox (we don't store anything!)</span>
          </a>
        </div>
      )
    }
  }
  render () {
    return (
      <div className='view-container'>
        <SidebarView input={this.state.input} preFilters={this.state.preFilters} postFilters={this.state.postFilters} />
        <div className="pusher">
            {this.renderAuth()}
        </div>
        <FooterView />
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  counter: state.counter
})
export default connect((mapStateToProps), {
  increment: () => increment(1),
  doubleAsync
})(HomeView)
