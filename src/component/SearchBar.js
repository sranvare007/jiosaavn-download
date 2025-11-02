import React from 'react';

class SearchBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = { input: '' };
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        this.props.onFormSubmit(this.state.input);
    }

    render() {
        const { loading } = this.props;

        return (
            <div className="search-container">
                <div className="search-box">
                    <form className="search-form" onSubmit={this.onFormSubmit}>
                        <input
                            type="text"
                            className="search-input"
                            value={this.state.input}
                            onChange={(event) => this.setState({ input: event.target.value })}
                            placeholder="Search for songs, artists, or albums..."
                            disabled={loading}
                        />
                        <button
                            type="submit"
                            className="search-button"
                            disabled={loading}
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
}

export default SearchBar;