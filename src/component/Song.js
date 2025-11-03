import React from 'react';

class Song extends React.Component {

    handleClick = () => {
        this.props.onSongClick(this.props.song);
    }

    handleDownload = async (e) => {
        e.stopPropagation(); // Prevent card click from playing the song

        const { song } = this.props;
        const downloadUrl = song.downloadUrl?.[song.downloadUrl.length - 1]?.url || song.downloadUrl?.[0]?.url;

        if (!downloadUrl) {
            alert('Download URL not available for this song');
            return;
        }

        try {
            // Show downloading indicator
            const button = e.currentTarget;
            const originalHTML = button.innerHTML;
            button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" opacity="0.3"/><path d="M12 2 A10 10 0 0 1 22 12" style="animation: spin 1s linear infinite; transform-origin: center;"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/></path></svg>';
            button.disabled = true;

            // Fetch the file as a blob
            const response = await fetch(downloadUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();

            // Create object URL for the blob
            const blobUrl = window.URL.createObjectURL(blob);

            // Create temporary anchor and trigger download
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${song.name} - ${song.artists?.primary?.map(a => a.name).join(', ') || 'Unknown'}.mp3`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

            // Restore button
            button.innerHTML = originalHTML;
            button.disabled = false;
        } catch (error) {
            console.error('Error downloading song:', error);
            alert('Failed to download song. The file will open in a new tab instead.');
            // Fallback: open in new tab
            window.open(downloadUrl, '_blank');

            // Restore button if it was modified
            const button = e.currentTarget;
            button.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>';
            button.disabled = false;
        }
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
                <button
                    className="song-download-button"
                    onClick={this.handleDownload}
                    aria-label="Download song"
                    title="Download song"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                    </svg>
                </button>
            </div>
        );
    }
}

export default Song;