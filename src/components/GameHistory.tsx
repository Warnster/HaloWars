import { format, formatDistance, subDays } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/context";
import { leaderData } from "../data/leaders";
import { mapData } from "../data/maps";
import { useGameHistory } from "../hooks/player/GameHistory";
import { findPlaylist, getDateFormat, isLast24Hours, teamPlayerColourMaps } from "../utils/helpers";
import { Page } from "./layout/Page";

export const GameHistory = () => {
  const { gamerTag } = useContext(GlobalContext);

  const perPage = 10;
  const [page, setPage] = useState(0);

  const startIndex = page * perPage;
  const { gameHistory } = useGameHistory(gamerTag, startIndex, perPage);

  if (!gameHistory) {
    return <></>;
  }

  const Pagination = () => {
    return (
      <div className="region pagination">
        <div className="content">
          {page > 0 && (
            <a
              data-analytics="{pageName}:Pagination/PreviousPage"
              className="text--large previous"
              href="#"
              onClick={(e) => {
                setPage(page - 1);
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <span className="icon icon--left"></span>Previous
            </a>
          )}
          {gameHistory.ResultCount >= perPage && (
            <a
              data-analytics="{pageName}:Pagination/NextPage"
              className="text--large next"
              href="#"
              onClick={(e) => {
                setPage(page + 1);
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              Next<span className="icon icon--right"></span>
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <Page title="Recent Games">
      <Pagination/>
      <ol className="hw2--game-history">
        {gameHistory.Results.map((game, index) => {
          const dateFormat = getDateFormat(game.MatchStartDate.ISO8601Date)
          const playlist = findPlaylist(game.PlaylistId);
          const playlistName = playlist?.View.HW2Playlist.DisplayInfo.View
            .HW2PlaylistDisplayInfo.Name
            ? playlist?.View.HW2Playlist.DisplayInfo.View.HW2PlaylistDisplayInfo
                .Name
            : "Custom";
          return (
            <li>
              <Link to={`/game?matchId=${game.MatchId}`} onClick={ (event) => game.GameMode === 6 ? event.preventDefault() : '' }>
                <div className="info--map">
                  <div
                    className="image"
                    style={{
                      color: `${game.TeamId === 2 ? "#3F5C7E" : "#73353C"}`,
                    }}
                  >
                    <img
                      src={mapData[game.MapId].Image.View.Media.MediaUrl}
                      alt="ASHES"
                    />
                  </div>
                  <div className="text">
                    <p className="text--large">
                      {game.PlayerMatchOutcome === 1 ? "Victory" : "Defeat"}
                    </p>
                    <p className="text--smallest">
                      {
                        mapData[game.MapId].DisplayInfo.View.HW2MapDisplayInfo
                          .Name
                      }
                    </p>
                  </div>
                </div>
                <div className="info--type">
                  <p className="text--medium">{playlistName}</p>
                  <p className="text--smallest">Deathmatch - {game.Teams[1].TeamSize}v{game.Teams[2].TeamSize}</p>
                </div>
                <div className="info--leader">
                  <div
                    className="image"
                    style={{
                      color:
                        teamPlayerColourMaps[game.TeamId][game.TeamPlayerIndex],
                    }}
                  >
                    <img
                      src={
                        leaderData[game.LeaderId].Image.View.Media.MediaHeadUrl
                      }
                      alt={
                        leaderData[game.LeaderId].DisplayInfo.View
                          .HW2LeaderDisplayInfo?.Name
                      }
                    />
                  </div>
                  <div className="text">
                    <p className="text--medium">
                      {
                        leaderData[game.LeaderId].DisplayInfo.View
                          .HW2LeaderDisplayInfo?.Name
                      }
                    </p>
                    <p className="text--smallest">Leader</p>
                  </div>
                </div>
                <div className="info--date">
                  <p className="text--medium">
                    <time>{dateFormat}</time>
                  </p>
                  {!isLast24Hours(game.MatchStartDate.ISO8601Date) && (
                    <p className="text--smallest">
                      <time>
                        {format(
                          new Date(game.MatchStartDate.ISO8601Date),
                          "HH:mm"
                        )}
                      </time>
                    </p>
                  )}
                </div>
              </Link>
            </li>
          );
        })}
      </ol>
      <Pagination/>
    </Page>
  );
};
