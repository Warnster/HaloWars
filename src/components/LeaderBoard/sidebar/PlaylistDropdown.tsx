import { useEffect, useState } from "react";
import { Playlist } from "../../../interfaces/Playlist";
import { PlaylistsEntity } from "../../../interfaces/Season";
import { addHyphens } from "../../../utils/entries";
import { findPlaylist } from "../../../utils/helpers";

interface PlaylistDropdownProps {
  playlists: PlaylistsEntity[], 
  onChange: (playlist: Playlist) => void,
  playlist: Playlist
}

export const PlaylistDropdown = ({playlists, onChange, playlist}: PlaylistDropdownProps) => {
  const playlistId = playlist.View.Identity
  const [dropdown, setDropdown] = useState(false);
  return (
        
      <nav className="nav dropdown" data-dropdown="">
      <a
        data-analytics="{pageName}:ExpandFilterDropdown"
        href="#"
        role="button"
        aria-expanded="false"
        onClick={(e) => {
          setDropdown(!dropdown);
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {playlist.View.HW2Playlist.DisplayInfo.View.HW2PlaylistDisplayInfo.Name}
      </a>
      <ul className={`dropdown-content ${dropdown ? "show" : ""}`}>
        {playlists.map((p) => {
          const playlist = findPlaylist(addHyphens(p.Identity))
          if(!playlist) return;
          return (
            <li>
              <a
                href="#"
                onClick={(e) => {
                  setDropdown(!dropdown);
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(playlist)
                }}
                className={`${p.Identity === playlistId ? 'selected' : ''}`}
              >
                {playlist.View.HW2Playlist.DisplayInfo.View.HW2PlaylistDisplayInfo.Name}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
    )
}