import React, { Component } from 'react'
import PropTypes from 'prop-types'
import AutoSuggestList from '../components/AutoSuggestList'
import reactStringReplace from 'react-string-replace'

import './AutoSuggest.scss'

class AutoSuggest extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props)
    this.autoSuggestItemRef = React.createRef()
    this.autosuggestContainerRef = React.createRef()
    this.filteredSuggestions = []

    this.state = {
      activeSuggestion: 0,
      highlightedSuggestions: [],
      showSuggestions: false,
      value: ''
    }
  }

  componentDidMount() {
    window.addEventListener('click', this.handleClickOutside)
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleClickOutside)
  }

  getAutosuggestForm = () => {
    const {
      activeSuggestion,
      value,
      highlightedSuggestions,
      showSuggestions
    } = this.state

    return (
      <form className='autosuggest--form' onSubmit={this.handleSubmit}>
        <div
          className='autosuggest--list-container'
          ref={this.autosuggestContainerRef}
        >
          <input
            aria-autocomplete='list'
            autoComplete={'off'}
            className='autosuggest--input'
            onBlur={this.handleOnBlur}
            onChange={this.handleOnChange}
            onFocus={this.handleOnFocus}
            onKeyDown={this.handleKeyDown}
            placeholder='type some fruit!'
            type='text'
            value={value}
          />
          {showSuggestions &&
            (highlightedSuggestions.length > 0 ? (
              <AutoSuggestList
                activeSuggestion={activeSuggestion}
                handleMouseMove={this.handleMouseMove}
                handleOnClick={this.handleOnClick}
                highlightedSuggestions={highlightedSuggestions}
                myRef={this.autoSuggestItemRef}
              />
            ) : (
              <div className='autosuggest--empty'>
                <span>No Suggestions found :(</span>
              </div>
            ))}
        </div>
        <input
          className='autosuggest--button'
          type='submit'
          value='Submit'
          disabled={!value}
        />
      </form>
    )
  }

  handleClickOutside = e => {
    // close suggestion list if user clicks somewhere else
    if (
      this.state.showSuggestions &&
      !this.autosuggestContainerRef.current.contains(e.target)
    ) {
      this.setState({ showSuggestions: false })
    }
  }

  handleKeyDown = e => {
    const { activeSuggestion, showSuggestions } = this.state
    let newActiveSuggestion

    if (!showSuggestions) {
      return
    }

    switch (e.key) {
      case 'Tab':
        this.setState({
          showSuggestions: false
        })
        break
      case 'Enter':
        // enter pressed
        if (
          activeSuggestion === null ||
          this.filteredSuggestions.length === 0
        ) {
          this.setState({
            showSuggestions: false,
            activeSuggestion: 0
          })
        } else {
          this.setState({
            showSuggestions: false,
            value: this.filteredSuggestions[activeSuggestion],
            activeSuggestion: 0
          })
        }
        // can submit, or go to next field here
        this.handleSubmit(e)
        break
      case 'ArrowUp':
        // up arrow pressed
        if (activeSuggestion === 0) {
          // if they are at the start of the list, go to the input field
          newActiveSuggestion = null
        } else if (activeSuggestion === null) {
          // if they are at the input field, go to the last item
          newActiveSuggestion = this.filteredSuggestions.length - 1
        } else {
          // go to the previous item in the array
          newActiveSuggestion = activeSuggestion - 1
        }
        this.setActiveSuggestion(newActiveSuggestion)
        break
      case 'ArrowDown':
        // if they are at the end of the list, return to the input field
        if (activeSuggestion === this.filteredSuggestions.length - 1) {
          newActiveSuggestion = null
        } else if (activeSuggestion === null) {
          // if they are at the input field, highlight the first item
          newActiveSuggestion = 0
        } else {
          // go to the next item in the array
          newActiveSuggestion = activeSuggestion + 1
        }
        this.setActiveSuggestion(newActiveSuggestion)
        break
      default:
        break
    }
  }

  handleMouseMove = e => {
    // set new active suggestion when the user hovers over an item in the list
    let activeIndex = this.filteredSuggestions.indexOf(
      e.currentTarget.innerText
    )
    this.setState({ activeSuggestion: activeIndex })
  }

  handleOnClick = e => {
    // get value and fill input, then reset the suggestion list
    this.filteredSuggestions = []
    this.setState({
      activeSuggestion: 0,
      showSuggestions: false,
      value: e.currentTarget.innerText
    })
  }

  handleOnChange = e => {
    const { suggestions } = this.props
    const value = e.currentTarget.value
    const trimmedValue = value.trim()
    let highlightedSuggestions = []
    let filteredSuggestions = []

    if (value.length === 0) {
      this.setState({ showSuggestions: false, value })
      return
    }

    // default array to fill input field with, will contain only strings
    filteredSuggestions = suggestions.filter(
      suggestion =>
        suggestion.toLowerCase().indexOf(trimmedValue.toLowerCase()) > -1
    )

    // different array to store highlighted suggestions, because it contains an array of [strings + JSX]
    highlightedSuggestions = this.highlightResults(
      trimmedValue,
      filteredSuggestions
    )

    this.filteredSuggestions = filteredSuggestions
    this.setState({
      activeSuggestion: 0,
      highlightedSuggestions,
      showSuggestions: true,
      value
    })
  }

  handleSubmit = e => {
    // disable button/show loading and submit here
    e.preventDefault()
  }

  highlightResults = (value, filteredSuggestions) => {
    let highlightedSuggestions = []

    // using reactStringReplace instead of regex to parse the string
    // and return an array of [string + jsx] to render
    filteredSuggestions.forEach(suggestion => {
      highlightedSuggestions.push(
        reactStringReplace(suggestion, value, (match, i) => (
          <mark key={i} className='autosuggest--highlight'>
            {match}
          </mark>
        ))
      )
    })

    return highlightedSuggestions
  }

  handleOnFocus = () => {
    const { value } = this.state

    if (value.length > 0) {
      this.setState({
        showSuggestions: true
      })
    }
  }

  setActiveSuggestion = newActiveSuggestion => {
    // use a promise to make sure we scroll AFTER the active suggestion has changed
    this.setState(
      {
        activeSuggestion: newActiveSuggestion
      },
      () => {
        if (this.autoSuggestItemRef.current) {
          this.autoSuggestItemRef.current.scrollIntoView({
            block: 'nearest'
          })
        }
      }
    )
  }

  render() {
    return (
      <div className='autosuggest'>
        <h1 className='autosuggest--header'>AutoSuggest App</h1>
        {this.props.suggestions && this.props.suggestions.length > 0 ? (
          this.getAutosuggestForm()
        ) : (
          <h3 className='autosuggest--error'>
            Error: could not find any suggestions :(
          </h3>
        )}
      </div>
    )
  }
}

export default AutoSuggest
