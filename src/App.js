import React from 'react';
import SearchBar from './component/SearchBar';
import SongList from './component/SongList';
import axios from './api/jiosaavn';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = { songslist: [] };
    }

    onFormSubmit = async text => {
        console.log('Button clicked');
        const songs = await axios.get('/songs', {
            params: { query: text }
        });

        console.log(songs);

        if(songs?.data?.data?.results?.length > 0) {
            this.setState({ songslist: songs.data.data.results });
        } else {
            this.setState({ songslist: [] });
            alert('No songs found');
        }
    }

    render() {
        return (
            <div>
                <SearchBar onFormSubmit = { this.onFormSubmit }/>
                <SongList songlist={ this.state.songslist } />
            </div>
        );
    }
}

export default App;