import { useContext, useEffect, useState } from "react"
import { GlobalContext } from "../../context/context"
import { seasonData } from "../../data/seasons"
import { useLeaderboard } from "../../hooks/metadata/Leaderboard"
import { Playlist } from "../../interfaces/Playlist"
import { PlaylistsEntity, Season } from "../../interfaces/Season"
import { addHyphens } from "../../utils/entries"
import { findPlaylist, leaderBoardPerPage } from "../../utils/helpers"
import { Page } from "../layout/Page"
import { LeaderTable } from "./leader-table/LeaderTable"
import { Pagination } from "./Pagination"
import { PlayerInfo } from "./PlyaerInfo"
import { Sidebar } from "./Sidebar"

export const Leaderboard = () => {

    const [season, setSeason] = useState<Season>(seasonData[0])
    const seasonId = season?.View.Identity
    const defaultPlaylist = findPlaylist(addHyphens((season.View.HW2Season.Playlists as PlaylistsEntity[])[0]?.Identity as string));
    const [playlist, setPlaylist] = useState<Playlist>(defaultPlaylist as Playlist)

    useEffect(() => {
        const defaultPlaylist = findPlaylist(addHyphens((season.View.HW2Season.Playlists as PlaylistsEntity[])[0]?.Identity as string));
        setPlaylist(defaultPlaylist as Playlist)
    }, [season])

    const {leaderboardData} = useLeaderboard(addHyphens(seasonId), addHyphens(playlist.View.Identity))

    const {gamerTag} = useContext(GlobalContext)

    const [page, setPage] = useState(0)

    const leaderPlayers = leaderboardData.slice(page * leaderBoardPerPage, page * leaderBoardPerPage + leaderBoardPerPage);
    return (
        <Page title="Leaderboard">
            <div className="region">
                <div className="content">
                    <div className="hw2--leaderboards">
                        <Sidebar season={season} playlist={playlist} onSeason={(s) => {setSeason(s)}} onPlaylist={(playlist) => setPlaylist(playlist)}/>
                        <div className="leaderboard">
                            <Pagination page={page} total={leaderboardData.length} onChange={(page) => setPage(page)}/>
                            <PlayerInfo gamerTag={gamerTag}/>
                            <LeaderTable leaderPlayers={leaderPlayers}/>
                        </div>
                    </div>
                </div>
            </div>
        </Page>
    )
}