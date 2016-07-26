/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { increment, doubleAsync } from '../../redux/modules/counter'
import HackWeekImage from './hackweek.png'

/* import DuckImage from './Duck.jpg'
import classes from './HomeView.scss' */

// We can use Flow (http://flowtype.org/) to type our component's props
// and state. For convenience we've included both regular propTypes and
// Flow types, but if you want to try just using Flow you'll want to
// disable the eslint rule `react/prop-types`.
// NOTE: You can run `npm run flow:check` to check for any errors in your
// code, or `npm i -g flow-bin` to have access to the binary globally.
// Sorry Windows users :(.
type Props = {
  counter: number,
  doubleAsync: Function,
  increment: Function
};

// We avoid using the `@connect` decorator on the class definition so
// that we can export the undecorated component for testing.
// See: http://rackt.github.io/redux/docs/recipes/WritingTests.html
export class HomeView extends React.Component<void, Props, void> {
  static propTypes = {
    counter: PropTypes.number.isRequired,
    doubleAsync: PropTypes.func.isRequired,
    increment: PropTypes.func.isRequired
  };

  componentDidMount () {
    $('select.dropdown').dropdown('set selected', ['meteor', 'ember'])
  }

  render () {
    return (
      <div className='container text-center'>
          <div className="ui icon input">
            <input type="text" placeholder="Presentations shared by @ruben in the last week..." />
            <i className="search icon"></i>
          </div>
          <div className="ui feed">
            <div className="event">
              <div className="label">
                <i className="file powerpoint outline icon"></i>
              </div>
              <div className="content">
                  <div className="summary">
                  <span className="file">File 1.ppt</span> Created by <a>Jenny Hess</a> in the <a>marketing</a> shared folder.
                </div>
                <div className="date">
                  3 days ago
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
                  <span className="file">File 1.txt</span> Created by <a>Jenny Hess</a> in the <a>marketing</a> shared folder.
                </div>
                <div className="date">
                  3 days ago
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
                  <span className="file">File 1.pdf</span> Created by <a>Jenny Hess</a> in the <a>marketing</a> shared folder.
                </div>
                <div className="date">
                  3 days ago
                </div>
              </div>
              <div className="ui right floated primary button">Open</div>
            </div>
          </div>
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

/*
<h2>
  Sample Counter:
  {' '}
  <span className={classes['counter--green']}>{this.props.counter}</span>
</h2>
<button className='ui primary button' onClick={this.props.increment}>
  Increment
</button>
{' '}
<button className='btn btn-default' onClick={this.props.doubleAsync}>
  Double (Async)
</button>

<div className='row'>
  <div className='col-xs-2 col-xs-offset-5'>
    <img className={classes.duck}
      src={DuckImage}
      alt='This is a duck, because Redux.' />
  </div>
</div>

*/

/*
<div className="ui centered cards">
  <div className="ui card">
    <div className="image">
      <img src={HackWeekImage} />
    </div>
    <div className="content">
      <a className="header">Dropbox HackWeek</a>
      <div className="meta">
        <span className="date">July 2016</span>
      </div>
      <div className="description">
        Improving content discovery in Dropbox through search and intelligence
      </div>
    </div>
    <div className="extra content">
      <a>
        Made with <i className="heart icon"></i> by 5 Dropboxers
      </a>
    </div>
  </div>
</div>
*/
