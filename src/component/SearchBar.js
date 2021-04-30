import React from 'react';

class SearchBar extends React.Component {
    
    constructor(props)
    {
        super(props);
        this.state = { input: '' };
    }

    onFormSubmit = (event) => {
        event.preventDefault();
        this.props.onFormSubmit(this.state.input);
    }
    
    render()
    {
        return (
            <div className="ui segment">
                <form className="ui form" onSubmit={this.onFormSubmit}>
                    <div className="ui fluid action input">
                        <input type="text" 
                            value={this.state.input}
                            onChange={(event) => this.setState({ input: event.target.value })}
                            placeholder="Search..." />
                        <div className="ui button" onClick={ this.onFormSubmit }>Search</div>
                    </div>
                </form>
            </div>
        );
    }
};

export default SearchBar;