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
            currentSong: null,
            savedPlaybackTime: 0
        };
    }


    componentDidMount() {
        // Load last played song from localStorage
        this.loadLastPlayedSong();
    }

    loadLastPlayedSong = () => {
        try {
            const savedData = localStorage.getItem('jiosaavn_last_played');
            if (savedData) {
                const { song, playbackTime, wasClosedByUser } = JSON.parse(savedData);
                // Only restore if user didn't explicitly close the player
                if (song && !wasClosedByUser) {
                    this.setState({
                        currentSong: song,
                        savedPlaybackTime: playbackTime || 0
                    });
                }
            }
        } catch (error) {
            console.error('Error loading saved song:', error);
        }
    }

    saveCurrentSong = (song, playbackTime = 0, wasClosedByUser = false) => {
        try {
            const dataToSave = {
                song,
                playbackTime,
                wasClosedByUser,
                timestamp: Date.now()
            };
            localStorage.setItem('jiosaavn_last_played', JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error saving song:', error);
        }
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
        this.setState({ currentSong: song, savedPlaybackTime: 0 });
        // Mark as not closed by user when clicking a new song
        this.saveCurrentSong(song, 0, false);
    }

    handleClosePlayer = () => {
        // Mark as closed by user so it won't auto-restore on next app open
        if (this.state.currentSong) {
            this.saveCurrentSong(this.state.currentSong, this.state.savedPlaybackTime, true);
        }
        this.setState({ currentSong: null });
    }

    handlePlaybackUpdate = (currentTime) => {
        // Save playback position every few seconds (not closed by user)
        if (this.state.currentSong && currentTime > 0) {
            this.setState({ savedPlaybackTime: currentTime });
            this.saveCurrentSong(this.state.currentSong, currentTime, false);
        }
    }

    render() {
        const { songslist, loading, error, hasSearched, currentSong, savedPlaybackTime } = this.state;

        return (
            <div className={`app-container ${currentSong ? 'player-active' : ''}`}>
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
                        savedPlaybackTime={savedPlaybackTime}
                        onClose={this.handleClosePlayer}
                        onPlaybackUpdate={this.handlePlaybackUpdate}
                    />
                )}
            </div>
        );
    }
}

export default App;