import React from 'react';
import Song from './Song';

const SongList = (props) => {

    const songlist = props.songlist.map(song => {
        return <Song key={song.song_id} song={song} />
    });

    return (
        <div className="ui cards" style={{ padding: '20px' }}>
            {songlist}
        </div>
    );
};

export default SongList;