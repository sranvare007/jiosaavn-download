import React from 'react';
import SearchBar from './component/SearchBar';
import SongList from './component/SongList';
import MusicPlayer from './component/MusicPlayer';
import axios from './api/jiosaavn';
import './App.css';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            songslist: [],
            loading: false,
            error: null,
            hasSearched: false,
            currentSong: null
        };
    }

    onFormSubmit = async text => {
        if (!text.trim()) {
            return;
        }

        this.setState({ loading: true, error: null, hasSearched: true });

        try {
            const response = await axios.get('/api/search/songs', {
                params: { query: text }
            });

            if (response?.data?.data?.results?.length > 0) {
                this.setState({
                    songslist: response.data.data.results,
                    loading: false
                });
            } else {
                this.setState({
                    songslist: [],
                    loading: false
                });
            }
        } catch (error) {
            console.error('Error fetching songs:', error);
            this.setState({
                error: 'Failed to fetch songs. Please try again.',
                loading: false,
                songslist: []
            });
        }
    }

    handleSongClick = (song) => {
        this.setState({ currentSong: song });
    }

    handleClosePlayer = () => {
        this.setState({ currentSong: null });
    }

    render() {
        const { songslist, loading, error, hasSearched, currentSong } = this.state;

        return (
            <div className="app-container">
                <header className="app-header">
                    <h1 className="app-title">JioSaavn</h1>
                    <p className="app-subtitle">Discover and download your favorite music</p>
                </header>

                <SearchBar
                    onFormSubmit={this.onFormSubmit}
                    loading={loading}
                />

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="loading-container">
                        <div className="spinner"></div>
                        <p className="loading-text">Searching for songs...</p>
                    </div>
                )}

                {!loading && hasSearched && (
                    <SongList
                        songlist={songslist}
                        onSongClick={this.handleSongClick}
                    />
                )}

                {currentSong && (
                    <MusicPlayer
                        song={currentSong}
                        onClose={this.handleClosePlayer}
                    />
                )}
            </div>
        );
    }
}

export default App;