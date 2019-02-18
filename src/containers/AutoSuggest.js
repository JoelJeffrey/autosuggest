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
    this.autosuggestRef = React.createRef()
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
        <div className='autosuggest--list-container'>
          <input
            aria-autocomplete='list'
            autoComplete={'off'}
            className='autosuggest--input'
            onChange={this.handleOnChange}
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
        <input className='autosuggest--button' type='submit' value='Submit' />
      </form>
    )
  }

  handleClickOutside = e => {
    // close suggestion list if user clicks away
    if (
      this.state.showSuggestions &&
      !this.autosuggestRef.current.contains(e.target)
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
          break
        }
        this.setState({
          showSuggestions: false,
          value: this.filteredSuggestions[activeSuggestion],
          activeSuggestion: 0
        })
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
          // go to the preivous item in the array
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

    // different array to store highlighted suggestions, because it contains strings + JSX
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
    // Submit to wherever you want to here
    e.preventDefault()
  }

  highlightResults = (value, filteredSuggestions) => {
    let highlightedSuggestions = []

    // using reactStringReplace instead of regex
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

  setActiveSuggestion = newActiveSuggestion => {
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
      <div className='autosuggest' ref={this.autosuggestRef}>
        <h1 className='autosuggest--header'>AutoSuggest App</h1>
        {this.props.suggestions && this.props.suggestions.length > 0 ? (
          this.getAutosuggestForm()
        ) : (
          <h3 className='autosuggest--error'>
            Error: cannot find suggestions :(
          </h3>
        )}
      </div>
    )
  }
}

export default AutoSuggest
