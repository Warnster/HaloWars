import { PlayerInfo } from "./PlyaerInfo";
import './Leaderboard.css'
import { PlaylistDropdown } from "./sidebar/PlaylistDropdown";
import { useContext } from "react";
import { Playlist } from "../../interfaces/Playlist";
import { GlobalContext } from "../../context/context";
import { PlaylistsEntity, Season } from "../../interfaces/Season";
import { SeasonDropdown } from "./sidebar/SeasonDropdown";

interface SidebarProps {
  onPlaylist: (playlist: Playlist) => void,
  onSeason: (season: Season) => void
  season: Season,
  playlist: Playlist
}

export const Sidebar = ({onPlaylist, onSeason, season, playlist}: SidebarProps) => {

  const {gamerTag} = useContext(GlobalContext)

  const playlists = season.View.HW2Season.Playlists

  return (
    <header className="sidebar build-order">
      <SeasonDropdown season={season} onChange={onSeason}></SeasonDropdown>
      {playlists && (
       <PlaylistDropdown playlist={playlist} playlists={playlists as PlaylistsEntity[]} onChange={onPlaylist}/>
      )}
      <PlayerInfo gamerTag={gamerTag}/>
    </header>
  );
};
