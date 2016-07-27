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
    return (
      <div className='view-container'>
        <SidebarView />
        <div className="pusher">
          <div className='container text-center'>
            <div className="ui icon input">
              <input type="text" placeholder="Presentations shared by @ruben in the last week..." onKeyPress={this.searchFiles}/>
              <i className="search icon"></i>
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
