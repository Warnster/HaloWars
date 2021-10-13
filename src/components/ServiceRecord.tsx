import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { playlists } from "../data/playlists";
import { usePlayerStatSummary } from "../hooks/player/PlayerStatSummary";
import { PieChartData } from "../interfaces/Chart";
import {
  AllLeaderStats,
  LeaderStats,
  RankedModeStatsEntity,
} from "../interfaces/PlayerStatSummary";
import { entries } from "../utils/entries";
import { HaloBarChart } from "./charts/BarChart";
import { HaloPlayerPercentage } from "./charts/legacy/PlayerPercentage";
import { HaloRankPieChart } from "./charts/legacy/RankPieChart";
import { WinLossBars } from "./charts/legacy/WinLossBars";
import { HaloWinPercentage } from "./charts/legacy/WinPercentage";
import { HaloPieChart } from "./charts/PieChart";

const formatLeaderStatData = (stat: AllLeaderStats) => {
  let leaderStatsTmp: PieChartData[] = [];
  for (const [key, value] of entries(stat as LeaderStats)) {
    leaderStatsTmp.push({ name: key, value: value.TotalMatchesStarted });
  }
  leaderStatsTmp.sort((a, b) => (a.value > b.value ? -1 : 1));
  return leaderStatsTmp;
};

export const ServiceRecord = () => {
  const { playerStatSummary } = usePlayerStatSummary("warnster");

  const [selectedPlaylistId, setSelectedPlaylistId] =
    useState<string>("all_ranked");
  const [leaderStats, setLeaderStats] = useState<PieChartData[]>([]);

  const ref = useRef<any>();
  const [leaderPieChartHeight, setLeaderPieChartHeight] = useState(ref.current ? ref.current.offsetWidth : 0);

  useEffect(() => {
    setLeaderPieChartHeight(ref.current ? ref.current.offsetWidth : 0)
  },[ref.current])

  useEffect(() => {
    function handleResize() {
      setLeaderPieChartHeight(ref.current ? ref.current.offsetWidth : 0)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    
}
  }, [])

  useEffect(() => {
    if (!playerStatSummary) return;
    if (selectedPlaylistId === "all_ranked") {
      const rankedModeStats = playerStatSummary.MatchmakingSummary
        .RankedModeStats as RankedModeStatsEntity[];
      setLeaderStats(formatLeaderStatData(rankedModeStats[0].LeaderStats));
    } else {
      const selected =
        playerStatSummary.MatchmakingSummary.RankedPlaylistStats?.find(
          (playlistStat) => playlistStat.PlaylistId === selectedPlaylistId
        );
      if (selected) {
        setLeaderStats(formatLeaderStatData(selected.LeaderStats));
      }
    }
  }, [selectedPlaylistId, playerStatSummary]);

  if (!playerStatSummary) return <></>;

  const rankedModeStats = playerStatSummary.MatchmakingSummary
    .RankedModeStats as RankedModeStatsEntity[];

  const selectOptions = [
    {
      name: "All Ranked",
      value: "all_ranked",
    },
  ];

  if (playerStatSummary.MatchmakingSummary.RankedPlaylistStats) {
    playerStatSummary.MatchmakingSummary.RankedPlaylistStats.forEach((stat) => {
      const playlist = playlists.find((playlist) => {
        return playlist.View.Identity === stat.PlaylistId.replaceAll("-", "");
      });
      selectOptions.push({
        name: playlist?.View.HW2Playlist.DisplayInfo.View.HW2PlaylistDisplayInfo
          .WebDisplayName as string,
        value: stat.PlaylistId,
      });
    });
  }
  
  return (
    <main id="main">
      <div className="region">
        <div className="content">
          <h2 className="text--larger">Summary</h2>
          <hr />
          <div className="grid">
            <div className="row row-4 valign-bottom">

            <div className="col">
                <a
                  className="text--large case-sensitive"
                  href="https://www.halowaypoint.com/en-gb/players/warnster"
                >
                  Warnster
                </a>
                <p className="text--smallest">6th Star</p>
                <div ref={ref} className="stat halo-circle">
                  <div
                    className="circle-chart loaded"
                    data-circle="proportion"
                    data-values="17.0387779083431,15.3349001175088,12.1621621621622,55.4641598119859"
                  >
                    <div className="metrics">
                      <div>
                        <p className="numeric--medium">
                          <span className="value">
                            17<span className="slash">%</span>
                          </span>
                        </p>
                        <p className="text--smallest">Decimus</p>
                      </div>
                    </div>
                    <HaloPieChart data={leaderStats} label="games" height={leaderPieChartHeight}/>
                  </div>
                </div>
              </div>
              <div className="col">
                {" "}
                <div className="stat">
                  <div className="chart-title">
                    <p className="text--large">&nbsp;</p>
                    <p className="text--smallest">&nbsp;</p>
                  </div>
                  <div className="hw2-leader-landscape">
                    <img
                      src="https://image.halocdn.com/?path=https:%2f%2fcontent.halocdn.com%2fmedia%2fDefault%2fgames%2fhalo-wars-2%2fleaders%2fdecimus-f0858672e88a4750b817164402a03d0d.png&amp;leftCrop=80&amp;rightCrop=80&amp;bottomCrop=1080&amp;topCrop=180&amp;width=400&amp;hash=x%2fvIZiX2TKaFAWaoEyqm0T%2fp7DeqW07BHwDCeS9ddVc%3d"
                      alt="Decimus"
                    />
                  </div>

                  <ol className="color-legend">
                    <li className="color-1">
                      <div className="desc">
                        Decimus
                        <br />
                      </div>
                      <div className="value">17%</div>
                    </li>
                    <li className="color-2">
                      <div className="desc">
                        Atriox
                        <br />
                      </div>
                      <div className="value">15%</div>
                    </li>
                    <li className="color-3">
                      <div className="desc">
                        Captain Cutter
                        <br />
                      </div>
                      <div className="value">12%</div>
                    </li>
                    <li className="color-4">
                      <div className="desc">
                        Others
                        <br />
                      </div>
                      <div className="value">55%</div>
                    </li>
                  </ol>
                </div>
              </div>
              <div className="col">
                {" "}
                <div className="stat">
                  <div className="chart-title">
                    <p className="text--large">RANKED 3v3 X WAR</p>
                    <p className="text--smallest">Top All-Time CSR</p>
                  </div>
                  <div className="csr">
                    <div
                      className="rank-onyx circle-chart loaded"
                      data-circle="progress"
                      data-value="40"
                    >
                      <div className="metrics">
                        <div>
                          <img src="https://content.halocdn.com/media/Default/games/halo-wars-2/csr/csr_top_array00-783f32318c8c49eda0365c5daa50f5b6-a473b61a79ce429d92094f361ec3d357.png" />
                          <p className="text--small">Onyx</p>
                          <p className="text--smallest">CSR: 1642</p>
                        </div>
                      </div>
                      <HaloRankPieChart />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col">
                {" "}
                <div className="stat">
                  <div
                    className="circle-chart loaded"
                    data-half-circle=""
                    data-value="53.1582238899312"
                  >
                    <div className="metrics">
                      <div>
                        <p className="numeric--medium">
                          <span className="value">
                            53<span className="slash">%</span>
                          </span>
                        </p>
                        <p className="text--smallest">
                          All-Time Win Percentage
                        </p>
                      </div>
                    </div>
                    <HaloWinPercentage />
                  </div>
                </div>
                <div className="stat">
                  <h4 className="text--smallest">Last 20 games</h4>
                  <div
                    className="bar-chart loaded"
                    data-values="1,1,-1,-1,1,1,1,1,-1,1,-1,-1,1,1,1,1,1,1,1,-1"
                  >
                    <WinLossBars />
                  </div>
                  <ol className="color-legend">
                    <li className="color-1">
                      <div className="desc">
                        Total Wins
                        <br />
                      </div>
                      <div className="value">850</div>
                    </li>
                    <li className="color-5">
                      <div className="desc">
                        Total Losses
                        <br />
                      </div>
                      <div className="value">749</div>
                    </li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <Form.Control
            as="select"
            onChange={(e) => setSelectedPlaylistId(e.target.value)}>
                {selectOptions.map((option) => {
                    return <option value={option.value}>{option.name}</option>
                })}
            </Form.Control>
        <div style={{width: "100%", height: 400}}>
            <HaloBarChart data={leaderStats}></HaloBarChart>
        </div>
        <div style={{width: "100%", height: 400}}>
            <HaloPieChart data={leaderStats} label="balh"></HaloPieChart>
        </div> */}
    </main>
  );
};