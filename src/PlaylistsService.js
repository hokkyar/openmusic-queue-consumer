const { Pool } = require('pg')

class PlaylistsService {
  constructor() {
    this._pool = new Pool()
  }

  async getSinglePlaylist(playlistId) {
    const query = {
      text: 'SELECT playlists.id, playlists.name, users.username FROM playlists INNER JOIN users ON playlists.owner=users.id WHERE playlists.id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    return result.rows[0]
  }

  async getPlaylistSongsById(playlistId) {
    const { name } = await this.getSinglePlaylist(playlistId)
    const query = {
      text: 'SELECT songs.id, songs.title, songs.performer FROM playlist_songs INNER JOIN songs ON playlist_songs.song_id = songs.id WHERE playlist_songs.playlist_id = $1',
      values: [playlistId]
    }
    const result = await this._pool.query(query)
    const songs = result.rows
    return { playlist: { id: playlistId, name, songs } }
  }
}

module.exports = PlaylistsService
