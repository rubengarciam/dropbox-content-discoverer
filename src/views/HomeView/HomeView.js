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

    this.preFilters = {};
    this.postFilters = {};
  }

  stripInfo(terms, infoType) {
    return terms.filter(function(t) {
      return !t.pos[infoType];
    });
  }

  stripMeaninglessTerms(terms) {
    let meaninglessTerms = ['create'];
    return terms.filter(function(t) {
      return meaninglessTerms.indexOf(t.root()) < 0;
    });
  }

  extractInfo(terms, infoType) {
    var dates = terms.filter(function(t) {
      return t.pos[infoType];
    });
    if (dates.length > 0) {
      this.postFilters[infoType] = dates[0].root();
    }
    return terms.filter(function(t) {
      return !t.pos[infoType];
    });
  }

  extractDate(terms) {
    return this.extractInfo(terms, 'Date');
  }

  extractPerson(terms) {
    return this.extractInfo(terms, 'Person');
  }

  extractFileTypes(terms) {
    let fileTypesMapping = {
      'pdf': 'pdf',
      'pptx': 'pptx',
      'docx': 'docx',
      'xlsx': 'xlsx',
      'presentation': 'pptx',
      'powerpoint': 'pptx',
      'word document': 'docx',
      'pdf document': 'pdf',
      'spreadsheet': 'xlsx'
    }

    this.preFilters['fileTypes'] = terms.filter(function(t) {
      return fileTypesMapping[t.root()]
    }).map(function(t) {
      return fileTypesMapping[t.root()];
    });

    return terms.filter(function(t) {
      return !fileTypesMapping[t.root()]
    });
  }

  combineTerms(terms) {
    return terms.reduce(function(s, t) {
      s += ' ' + t.normal;
      return s;
    }, '').trim();
  }

  nlpInspect(input) {
    this.preFilters = {};
    this.postFilters = {};
    
    let nlp = require('nlp_compromise');
    var terms = nlp.sentence(input).terms
    var essentialTerms = this.stripInfo(this.stripInfo(this.stripInfo(terms, 'Preposition'), 'Determiner'), 'Conjunction');
    essentialTerms = this.stripMeaninglessTerms(essentialTerms);
    essentialTerms = this.extractFileTypes(essentialTerms);
    essentialTerms = this.extractPerson(this.extractDate(essentialTerms));

    var result = this.combineTerms(essentialTerms);
    this.resultQuery = result;
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
              <pre>{this.resultQuery}</pre>
              <pre>{JSON.stringify(this.preFilters, null, 2)}</pre>
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
