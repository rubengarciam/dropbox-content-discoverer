/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { increment, doubleAsync } from '../../redux/modules/counter'
import {FooterView} from '../FooterView/FooterView'
import {ResultsView} from '../ResultsView/ResultsView'
import {SidebarView} from '../SidebarView/SidebarView'
var Dropbox = require('dropbox');

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
      files: null
    };
  }
  searchFiles(e){
      var dbx = new Dropbox({ accessToken: "PUT YOUR ACCESS TOKEN HERE" });
      var self = this;
      dbx.filesSearch({query: e.target.value,path: ""})
        .then(function(response) {
          self.setState({
            files: response.matches
          });
        })
        .catch(function(error) {
          console.log(error);
          return "NO files";
        })
  }
  componentDidMount () {
  }
  render () {
    let nlp = require('nlp_compromise')
    var input = nlp_compromise.sentence('Presentations created in the last 3 weeks, sent from Daniel from Sydney')
    var people = input.people()[0].text
    var date = input.dates()[0].text
    var place = input.places()[0].text
    var verb = input.verbs()[0].text
    var all_n = input.nouns()
    var nouns = ""
    for (var i = 0; i < all_n.length; ++i) {
      nouns += "[" + all_n[i].text + "]"
    }

    return (
      <div className='view-container'>
        <SidebarView />
        <div className="pusher">
          <div className='container text-center'>
            <div className="ui icon input">
              <input type="text" placeholder="Presentations shared by @ruben in the last week..." onKeyPress={this.searchFiles}/>
              <i className="search icon"></i>
              <div className="NLP analysis">
                <li>Input: <label id="input" text={input.text()}></li>
                <li>People: <label id="people" text={{people}></li>
                <li>Date: <label id="date" text={{date}></li>
                <li>Place: <label id="place" text={{place}></li>
                <li>Verb: <label id="verb" text={{verb}></li>
                <li>Nouns: <label id="nouns" text={{nouns}></li>
              </div>
            </div>
            <ResultsView files={this.state.files} />
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
