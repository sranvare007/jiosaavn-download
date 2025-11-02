import React from 'react';
import Song from './Song';

const SongList = (props) => {
    const { songlist, onSongClick } = props;

    if (!songlist || songlist.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-state-icon">🎵</div>
                <p className="empty-state-text">No songs found. Try searching for something else!</p>
            </div>
        );
    }

    const songs = songlist.map(song => (
        <Song
            key={song.id || song.song_id}
            song={song}
            onSongClick={onSongClick}
        />
    ));

    return (
        <div className="songs-container">
            <div className="songs-grid">
                {songs}
            </div>
        </div>
    );
};

export default SongList;