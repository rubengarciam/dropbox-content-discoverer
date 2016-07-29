/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { increment, doubleAsync } from '../../redux/modules/counter'
import {FooterView} from '../FooterView/FooterView'
import {ResultsView} from '../ResultsView/ResultsView'
import {SidebarView} from '../SidebarView/SidebarView'
var NLP = require('../../components/NLP')
var Dropbox = require('dropbox')
var DL =  require('../../components/DropboxLib.js');

const TOKEN = "PUT YOUR TOKEN HERE";

var dbx = new Dropbox({ accessToken: TOKEN });

type Props = {
  counter: number,
  doubleAsync: Function,
  increment: Function
};

export class HomeView extends React.Component<void, Props, void> {
  static propTypes = {
    counter: PropTypes.number.isRequired,
    doubleAsync: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired
  };
  constructor(props){
    super(props);
    this.searchFiles = this.searchFiles.bind(this);
    this.state =  {
      files: null,
      input: null,
      preFilters: null,
      postFilters: null
    };
  }

  searchFiles(e){
      var self = this;
      let result = NLP.nlpInspect(e.target.value);
      dbx.filesSearch({query: result.input, path: ""})
        .then(function(response) {
          self.setState({
            files: response.matches,
            input: result.input,
            preFilters: result.pre,
            postFilters:result.post
          });
        })
        .catch(function(error) {
          console.log(error);
          return "NO files";
        })
  }

  componentDidMount () {
    DL.populateSharingDetails(TOKEN);
  }

  render () {
    //console.log(DL.sharedFolderDetails);
    var formats = (this.state.preFilters && this.state.preFilters.fileTypes) ? this.state.preFilters.fileTypes : null;
    return (
      <div className='view-container'>
        <SidebarView input={this.state.input} preFilters={this.state.preFilters} postFilters={this.state.postFilters} />
        <div className="pusher">
          <div className='container text-center'>
            <div className="ui icon input">
              <input type="text" placeholder="Presentations shared by @ruben in the last week..." onKeyPress={this.searchFiles}/>
              <i className="search icon"></i>
            </div>
            <ResultsView files={this.state.files} formats={formats} filters={this.state.postFilters} shares={DL.sharedFolderDetails} />
          </div>
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
