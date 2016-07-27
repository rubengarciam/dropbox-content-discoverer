/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { increment, doubleAsync } from '../../redux/modules/counter'
import {FooterView} from '../FooterView/FooterView'
import {ResultsView} from '../ResultsView/ResultsView'
import {SidebarView} from '../SidebarView/SidebarView'
var Dropbox = require('dropbox');

const TOKEN = "PUT YOUR TOKEN HERE";

var dbx = new Dropbox({ accessToken: TOKEN });
//var dbx = new Dropbox({ clientId: CLIENT_ID });

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

    this.postFilters = {};
  }

  stripInfo(terms, filterOut) {
    return terms.filter(function(t) {
      return !t.pos[filterOut];
    });
  }

  extractDate(terms) {
    var dates = terms.filter(function(t) {
      return t.pos['Date'];
    });
    if (dates.length > 0) {
      this.postFilters['Date'] = dates[0].root();
    }

    return terms.filter(function(t) {
      return !t.pos['Date'];
    });
  }

  combineTerms(terms) {
    return terms.reduce(function(s, t) {
      s += ' ' + t.root();
      return s;
    }, '').trim();
  }

  nlpInspect(input) {
    let nlp = require('nlp_compromise');
    var terms = nlp.sentence(input).terms
    var essentialTerms = this.stripInfo(this.stripInfo(terms, 'Preposition'), 'Determiner');
    essentialTerms = this.extractDate(essentialTerms);

    var result = this.combineTerms(essentialTerms);
    this.nlp_root = result;
    return result
  }

  searchFiles(e){
      var self = this;
      let input = this.nlpInspect(e.target.value);
      dbx.filesSearch({query: input, path: ""})
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
    return (
      <div className='view-container'>
        <SidebarView />
        <div className="pusher">
          <div className='container text-center'>
            <div className="ui icon input">
              <input type="text" placeholder="Presentations shared by @ruben in the last week..." onKeyPress={this.searchFiles}/>
              <i className="search icon"></i>
            </div>
            <div>
              <pre>{this.nlp_root}</pre>
              <pre>{JSON.stringify(this.postFilters, null, 2)}</pre>
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
