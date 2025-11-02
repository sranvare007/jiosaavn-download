import React from 'react';

class Song extends React.Component {

    handleClick = () => {
        this.props.onSongClick(this.props.song);
    }

    render() {
        const { song } = this.props;

        // Safely get image URL
        const imageUrl = song.image?.[2]?.url || song.image?.[1]?.url || song.image?.[0]?.url || '';

        // Safely get artist names
        const artists = song.artists?.primary?.map(artist => artist.name).join(', ') || 'Unknown Artist';

        // Safely get album name
        const albumName = song.album?.name || 'Unknown Album';

        // Safely get year
        const year = song.year || 'N/A';

        return (
            <div className="song-card" onClick={this.handleClick}>
                <div className="song-image-container">
                    <img
                        className="song-image"
                        alt={song.name}
                        src={imageUrl}
                        loading="lazy"
                    />
                    <div className="song-play-overlay">
                        <div className="play-icon">▶</div>
                    </div>
                </div>
                <div className="song-content">
                    <h3 className="song-title">{song.name}</h3>
                    <p className="song-artist">{artists}</p>
                    <div className="song-details">
                        <span className="song-album">{albumName}</span>
                        <span className="song-year">{year}</span>
                    </div>
                </div>
            </div>
        );
    }
}

export default Song;