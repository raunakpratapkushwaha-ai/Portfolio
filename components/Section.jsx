import { Component } from 'react'
import '../src/App.css'
import FrontFirst from './FrontFirst.jsx'
import FrontSecond from './FrontSecond.jsx'

export class Section extends Component {

  render() {
    return (
      <div className='section'>
        <FrontFirst />
        <FrontSecond />
      </div>
    )
  }
}
export default Section