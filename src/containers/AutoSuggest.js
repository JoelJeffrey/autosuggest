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
    this.autoSuggestListRef = React.createRef()
    this.autosuggestRef = React.createRef()

    this.state = {
      activeSuggestion: 0,
      filteredSuggestions: [],
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
        if (activeSuggestion === null) {
          this.setState({
            showSuggestions: false,
            activeSuggestion: 0
          })
          break
        }
        this.setState({
          showSuggestions: false,
          value: filteredSuggestions[activeSuggestion],
          activeSuggestion: 0
        })
        break
      case 'ArrowUp':
        // up arrow pressed
        if (activeSuggestion === 0) {
          // if they are at the start of the list, highlight the last item
          this.setState(state => ({
            activeSuggestion: null
          }))
        } else if (activeSuggestion === null) {
          // Things get tricky here, need to scroll into view when they use arrow keys, using setState promise to ensure it scrolls at the proper time
          this.setState(
            state => ({
              activeSuggestion: filteredSuggestions.length - 1
            }),
            () => {
              this.autoSuggestListRef.current.scrollIntoView()
            }
          )
        } else {
          this.setState(
            state => ({
              activeSuggestion: activeSuggestion - 1
            }),
            () => {
              if (this.autoSuggestListRef.current) {
                this.autoSuggestListRef.current.scrollIntoView()
              }
            }
          )
        }
        break
      case 'ArrowDown':
        // down arrow pressed
        // if they are at the end of the list, highlight the first item
        if (activeSuggestion === filteredSuggestions.length - 1) {
          this.setState({ activeSuggestion: null })
        } else if (activeSuggestion === null) {
          // Things get tricky here, need to scroll into view when they use arrow keys, using setState promise to ensure it scrolls at the proper time
          this.setState(
            state => ({
              activeSuggestion: 0
            }),
            () => {
              this.autoSuggestListRef.current.scrollIntoView(false)
            }
          )
        } else {
          this.setState(
            state => ({
              activeSuggestion: activeSuggestion + 1
            }),
            () => {
              if (this.autoSuggestListRef.current) {
                this.autoSuggestListRef.current.scrollIntoView(false)
              }
            }
          )
        }
        break
      default:
        break
    }
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

    this.setState({
      filteredSuggestions,
      highlightedSuggestions,
      showSuggestions: true,
      value
    })
  }

  handleOnClick = e => {
    // get value and fill input, then reset the suggestion list
    this.setState({
      activeSuggestion: 0,
      filteredSuggestions: [],
      showSuggestions: false,
      value: e.currentTarget.innerText
    })
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

  handleMouseMove = e => {
    const { filteredSuggestions } = this.state
    let activeIndex = filteredSuggestions.indexOf(e.currentTarget.innerText)
    this.setState({ activeSuggestion: activeIndex })
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

  handleSubmit = e => {
    // Submit to wherever you want to here
    e.preventDefault()
  }

  render() {
    const {
      activeSuggestion,
      value,
      highlightedSuggestions,
      showSuggestions
    } = this.state

    return (
      <div className='autosuggest' ref={this.autosuggestRef}>
        <h1 className='autosuggest--header'>AutoSuggest App</h1>
        <form className='autosuggest--form' onSubmit={this.handleSubmit}>
          <div className='autosuggest--list-container'>
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
              (highlightedSuggestions.length > 0 ? (
                <AutoSuggestList
                  activeSuggestion={activeSuggestion}
                  handleOnClick={this.handleOnClick}
                  handleMouseMove={this.handleMouseMove}
                  highlightedSuggestions={highlightedSuggestions}
                  myRef={this.autoSuggestListRef}
                />
              ) : (
                <div className='autosuggest--empty'>
                  <span>No Suggestions found :(</span>
                </div>
              ))}
          </div>
          <input className='autosuggest--button' type='submit' value='Submit' />
        </form>
      </div>
    )
  }
}

export default AutoSuggest
