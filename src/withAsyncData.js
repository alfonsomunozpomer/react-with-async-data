import React from 'react'
import PropTypes from 'prop-types'

const fetchResponseJson = async (url) => {
  const response = await fetch(url)
  const responseJson = await response.json()
  return responseJson
}

// This function takes a component...
const withAsyncData = (WrappedComponent, url) => {
  // ...and returns another component...
  return class extends React.Component {
    constructor(props) {
      super(props)

      this.state = {
        data: null,
        loading: false,
        errorMessage: null
      }

      this._fetchAndSetState = this._fetchAndSetState.bind(this)
    }

    _fetchAndSetState(url) {
      return fetchResponseJson(url)
        .then((responseJson) => {
          this.setState({
            data: responseJson,
            errorMessage: null,
            loading: false
          })
        })
        .catch((reason) => {
          this.setState({
            errorMessage: `${reason.name}: ${reason.message}`,
            loading: false
          })
        })
    }

    componentDidMount() {
      return this._fetchAndSetState(url)
    }

    render() {
      return <WrappedComponent data={this.state.data}
                               loading={this.state.loading}
                               errorMessage={this.state.errorMessage}
                               {...this.props} />
    }
  }
}

export default withAsyncData
