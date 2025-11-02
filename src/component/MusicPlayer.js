import React from 'react';

class MusicPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            currentTime: 0,
            duration: 0,
            volume: 1,
            isMuted: false,
            previousVolume: 1,
            hasAutoPlayed: false,
            hasRestoredPosition: false
        };
        this.audioRef = React.createRef();
        this.animationFrameId = null;
        this.lastSaveTime = 0;
    }

    componentDidMount() {
        // When component first mounts with a song, prepare to autoplay
        if (this.props.song) {
            const audio = this.audioRef.current;
            if (audio) {
                audio.load();
            }
        }
    }

    componentWillUnmount() {
        // Save current position before unmounting
        if (this.props.onPlaybackUpdate && this.state.currentTime > 0) {
            this.props.onPlaybackUpdate(this.state.currentTime);
        }

        // Clean up animation frame when component unmounts
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
    }

    componentDidUpdate(prevProps) {
        // Auto-play when a new song is selected
        const prevSongId = prevProps.song?.id || prevProps.song?.song_id;
        const currentSongId = this.props.song?.id || this.props.song?.song_id;

        if (prevSongId !== currentSongId && currentSongId) {
            // Cancel any ongoing animation frame
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }

            // Reset audio and prepare for new song
            const audio = this.audioRef.current;
            if (audio) {
                audio.load(); // Load the new source
                this.setState({
                    currentTime: 0,
                    duration: 0,
                    hasAutoPlayed: false,
                    isPlaying: false,
                    hasRestoredPosition: false
                });
            }
        }
    }

    handleCanPlay = () => {
        const audio = this.audioRef.current;

        // Restore saved playback position if available
        if (!this.state.hasRestoredPosition && this.props.savedPlaybackTime > 0 && audio) {
            audio.currentTime = this.props.savedPlaybackTime;
            this.setState({
                currentTime: this.props.savedPlaybackTime,
                hasRestoredPosition: true
            });
        }

        // Auto-play when audio is ready (only once per song)
        if (!this.state.hasAutoPlayed) {
            this.setState({ hasAutoPlayed: true });
            this.playAudio();
        }
    }

    updateProgress = () => {
        const audio = this.audioRef.current;
        if (audio && this.state.isPlaying) {
            const currentTime = audio.currentTime;
            this.setState({
                currentTime,
                duration: audio.duration || 0
            });

            // Save playback position every 2 seconds
            const now = Date.now();
            if (this.props.onPlaybackUpdate && (now - this.lastSaveTime > 2000)) {
                this.props.onPlaybackUpdate(currentTime);
                this.lastSaveTime = now;
            }

            this.animationFrameId = requestAnimationFrame(this.updateProgress);
        }
    }

    playAudio = () => {
        const audio = this.audioRef.current;
        if (audio) {
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.setState({ isPlaying: true });
                        this.animationFrameId = requestAnimationFrame(this.updateProgress);
                    })
                    .catch(error => {
                        console.error('Error playing audio:', error);
                        this.setState({ isPlaying: false });
                    });
            }
        }
    }

    pauseAudio = () => {
        const audio = this.audioRef.current;
        if (audio) {
            audio.pause();
            this.setState({ isPlaying: false });
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }

            // Save position when pausing
            if (this.props.onPlaybackUpdate && audio.currentTime > 0) {
                this.props.onPlaybackUpdate(audio.currentTime);
            }
        }
    }

    togglePlayPause = () => {
        if (this.state.isPlaying) {
            this.pauseAudio();
        } else {
            this.playAudio();
        }
    }

    handleTimeUpdate = () => {
        const audio = this.audioRef.current;
        if (audio) {
            this.setState({
                currentTime: audio.currentTime,
                duration: audio.duration || 0
            });
        }
    }

    handleSeek = (e) => {
        const audio = this.audioRef.current;
        const seekTime = parseFloat(e.target.value);
        if (audio) {
            audio.currentTime = seekTime;
            this.setState({ currentTime: seekTime });
        }
    }

    handleVolumeChange = (e) => {
        const audio = this.audioRef.current;
        const volume = parseFloat(e.target.value);
        if (audio) {
            audio.volume = volume;
            this.setState({
                volume,
                isMuted: volume === 0,
                previousVolume: volume > 0 ? volume : this.state.previousVolume
            });
        }
    }

    toggleMute = () => {
        const audio = this.audioRef.current;
        if (audio) {
            if (this.state.isMuted) {
                // Unmute: restore previous volume
                const volumeToRestore = this.state.previousVolume || 1;
                audio.volume = volumeToRestore;
                this.setState({
                    volume: volumeToRestore,
                    isMuted: false
                });
            } else {
                // Mute: save current volume and set to 0
                this.setState({
                    previousVolume: this.state.volume,
                    volume: 0,
                    isMuted: true
                });
                audio.volume = 0;
            }
        }
    }

    handleClose = () => {
        // Save position before closing
        if (this.props.onPlaybackUpdate && this.state.currentTime > 0) {
            this.props.onPlaybackUpdate(this.state.currentTime);
        }

        this.pauseAudio();
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.props.onClose();
    }

    formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    render() {
        const { song } = this.props;
        const { isPlaying, currentTime, duration, volume, isMuted } = this.state;

        if (!song) return null;

        // Get the audio URL
        const audioUrl = song.downloadUrl?.[song.downloadUrl.length - 1]?.url ||
                        song.downloadUrl?.[0]?.url || '';

        // Get image URL
        const imageUrl = song.image?.[1]?.url || song.image?.[0]?.url || '';

        // Get artist names
        const artists = song.artists?.primary?.map(artist => artist.name).join(', ') || 'Unknown Artist';

        return (
            <div className="music-player">
                <audio
                    ref={this.audioRef}
                    src={audioUrl}
                    onTimeUpdate={this.handleTimeUpdate}
                    onEnded={() => {
                        if (this.animationFrameId) {
                            cancelAnimationFrame(this.animationFrameId);
                        }
                        // Reset to beginning when song ends
                        if (this.props.onPlaybackUpdate) {
                            this.props.onPlaybackUpdate(0);
                        }
                        this.setState({ isPlaying: false, currentTime: 0 });
                    }}
                    onLoadedMetadata={this.handleTimeUpdate}
                    onCanPlay={this.handleCanPlay}
                />

                <div className="player-content">
                    {/* Song Info */}
                    <div className="player-song-info">
                        <img
                            src={imageUrl}
                            alt={song.name}
                            className="player-album-art"
                        />
                        <div className="player-song-details">
                            <div className="player-song-name">{song.name}</div>
                            <div className="player-artist-name">{artists}</div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="player-controls">
                        <button
                            className="control-button play-pause-button"
                            onClick={this.togglePlayPause}
                        >
                            {isPlaying ? (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                </svg>
                            ) : (
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            )}
                        </button>

                        <div className="progress-container">
                            <span className="time-display">{this.formatTime(currentTime)}</span>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                step="0.1"
                                value={currentTime}
                                onChange={this.handleSeek}
                                className="progress-bar"
                            />
                            <span className="time-display">{this.formatTime(duration)}</span>
                        </div>
                    </div>

                    {/* Volume Control */}
                    <div className="player-volume">
                        <button
                            className="volume-icon-button"
                            onClick={this.toggleMute}
                            aria-label={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted || volume === 0 ? (
                                // Muted icon
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                                </svg>
                            ) : volume < 0.3 ? (
                                // Low volume icon
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M7 9v6h4l5 5V4l-5 5H7z"/>
                                </svg>
                            ) : volume < 0.7 ? (
                                // Medium volume icon
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                                </svg>
                            ) : (
                                // High volume icon
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                                </svg>
                            )}
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={this.handleVolumeChange}
                            className="volume-slider"
                        />
                    </div>

                    {/* Close Button */}
                    <button className="player-close-button" onClick={this.handleClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
            </div>
        );
    }
}

export default MusicPlayer;
