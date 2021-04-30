import React from 'react';

class Song extends React.Component
{

    songRedirect = () => {
        window.location.href = this.props.song.download_links[2];
    }
    render()
    {
        return (
            <div className="card" onClick={this.songRedirect}>
                <div className="image">
                <img className="ui small image" style={{ display: 'inline' }} alt={this.props.song.song_name} src={this.props.song.song_image} />
                </div>
                <div className="content">
                    <a className="header">{ this.props.song.song_name }</a>
                    <div className="meta">
                        <span className="date">{ this.props.song.song_artist }</span>
                    </div>
                    <div className="description">
                        {this.props.song.album_name}
                    </div>

                </div>
                <div className="extra content">
                    <a>
                        {this.props.song.year}
                    </a>
                </div>
            </div>
        );
    }
};


export default Song;