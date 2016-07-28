/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { increment, doubleAsync } from '../../redux/modules/counter'
import {FooterView} from '../FooterView/FooterView'
import {ResultsView} from '../ResultsView/ResultsView'
import {SidebarView} from '../SidebarView/SidebarView'
var NLP = require('../../components/NLP')
var Dropbox = require('dropbox')

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
      //console.log(e.target.value);
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
          console.log(self.state);
        })
        .catch(function(error) {
          console.log(error);
          return "NO files";
        })
  }

  componentDidMount () {
  }

  render () {
    return (
      <div className='view-container'>
        <SidebarView input={this.state.input} preFilters={this.state.preFilters} postFilters={this.state.postFilters} />
        <div className="pusher">
          <div className='container text-center'>
            <div className="ui icon input">
              <input type="text" placeholder="Presentations shared by @ruben in the last week..." onKeyPress={this.searchFiles}/>
              <i className="search icon"></i>
            </div>
            <ResultsView files={this.state.files} filters={this.state.postFilters} />
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
