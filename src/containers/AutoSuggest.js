import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AutoSuggestList from '../components/AutoSuggestList'

import './AutoSuggest.scss'

class AutoSuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.autosuggestRef = React.createRef()

    this.state = {
      filteredSuggestions: [],
      showSuggestions: false,
      activeSuggestion: 0,
      value: ''
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClickOutside)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickOutside)
  }

  handleKeyDown = e => {
    const {
      activeSuggestion,
      filteredSuggestions,
      showSuggestions
    } = this.state

    if (!showSuggestions) {
      return
    }

    switch (e.key) {
      case 'Enter':
        // enter pressed
        this.setState({
          showSuggestions: false,
          value: filteredSuggestions[activeSuggestion],
          activeSuggestion: 0
        })
        break
      case 'ArrowUp':
        // up arrow pressed
        if (activeSuggestion === 0) {
          this.setState(state => ({
            activeSuggestion: filteredSuggestions.length - 1
          }))
        } else {
          this.setState(state => ({
            activeSuggestion: activeSuggestion - 1
          }))
        }
        break
      case 'ArrowDown':
        // down arrow pressed
        if (activeSuggestion === filteredSuggestions.length - 1) {
          this.setState({ activeSuggestion: 0 })
        } else {
          this.setState(state => ({
            activeSuggestion: activeSuggestion + 1
          }))
        }

        break
      default:
    }
  }

  handleOnChange = e => {
    const { suggestions } = this.props
    const value = e.currentTarget.value

    if (value.length === 0) {
      this.setState({ showSuggestions: false, value: value })
      return
    }

    const filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(value.trim().toLowerCase()) > -1
    )

    this.setState({
      filteredSuggestions,
      showSuggestions: true,
      value
    })
  }

  handleOnClick = e => {
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      value: e.currentTarget.innerText
    })
  }

  handleClickOutside = e => {
    if (
      this.state.showSuggestions &&
      !this.autosuggestRef.current.contains(e.target)
    ) {
      this.setState({ showSuggestions: false })
    }
  }

  // highlightResults = () => {
  //   return <mark>item</mark>
  // }

  render() {
    const {
      activeSuggestion,
      value,
      filteredSuggestions,
      showSuggestions
    } = this.state

    return (
      <div className='autosuggest' ref={this.autosuggestRef}>
        <h1>AutoSuggest App</h1>
        <form className='autosuggest--form'>
          <input
            autoComplete={'off'}
            className='autosuggest--input'
            onChange={this.handleOnChange}
            onKeyDown={this.handleKeyDown}
            placeholder='Fruit'
            type='text'
            value={value}
          />
          {showSuggestions &&
            (filteredSuggestions.length > 0 ? (
              <AutoSuggestList
                activeSuggestion={activeSuggestion}
                handleOnClick={this.handleOnClick}
                filteredSuggestions={filteredSuggestions}
              />
            ) : (
              <div className='autosuggest--empty'>
                <span>No Suggestions found :(</span>
              </div>
            ))}
        </form>
      </div>
    )
  }
}

export default AutoSuggest
