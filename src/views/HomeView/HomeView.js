/* @flow */
import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { increment, doubleAsync } from '../../redux/modules/counter'
import DuckImage from './Duck.jpg'
import HackWeekImage from './hackweek.png'
import classes from './HomeView.scss'

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
        <h1>Dropbox Content Discoverer</h1>

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
                <i className="user icon"></i>
                7 Dropboxers working
              </a>
            </div>
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
