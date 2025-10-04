import React from 'react';

class Song extends React.Component
{

    songRedirect = () => {
        window.location.href = this.props.song.downloadUrl[2].url;
    }
    render()
    {
        return (
            <div className="card" onClick={this.songRedirect}>
                <div className="image">
                <img className="ui small image" style={{ display: 'inline' }} alt={this.props.song.name} src={this.props.song.image[1].url} />
                </div>
                <div className="content">
                    <a className="header">{ this.props.song.name }</a>
                    <div className="meta">
                        <span className="date">{ this.props.song.artists.primary.map(artist => artist.name).join(', ') }</span>
                    </div>
                    <div className="description">
                        {this.props.song.album.name}
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