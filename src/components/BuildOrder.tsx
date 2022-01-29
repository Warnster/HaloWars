import { useEffect, useState } from "react";
import { gameObjectData } from "../data/game-objects";
import { useGameObject } from "../hooks/metadata/GameObjects";
import { TmpImage } from "../interfaces/GameObject";
import { Match, Player } from "../interfaces/Match";
import { entries } from "../utils/entries";
import { getPlayersByTeam, millisToMinutesAndSeconds, team1Image, team2Image } from "../utils/helpers";
import './BuildOrder.css'
import { HaloButton } from "./button/HaloButton";

export type PlayerIndex = Player & { playerIndex: number }

export const BuildOrder = ({ match }: { match: Match }) => {
  const ignoreEvents = [
    "PlayerLeftMatch",
    "MatchEnd",
    "PointCaptured",
    "UnitPromoted",
    "BuildingConstructionQueued",
    "Death",
    "LeaderPowerCast",
    "LeaderPowerUnlocked",
    "MatchStart",
    "PointCreated",
    "PlayerJoinedMatch",
    "ResourceHeartbeat",
    "TechResearched",
  ];

  const ignoreSquadIds = [
    "pow_gp_scatterbombDummy_01"
  ]

  const buildingTracker: {
    [key: number]: {
      BuildingId: string;
      completed: boolean;
      NewBuildingId: null | string;
    };
  } = {};

  const [selectedTeam1PlayerIndex, setSelectedTeam1PlayerIndex] = useState(0);
  const [selectedTeam2PlayerIndex, setSelectedTeam2PlayerIndex] = useState(0);

  
  const {team1Players, team2Players} = getPlayersByTeam(match.Players)

  useEffect(() => {
    setSelectedTeam1PlayerIndex(team1Players[0].playerIndex)
    setSelectedTeam2PlayerIndex(team2Players[0].playerIndex)
  }, [])

  return (
    <div>
      <h1>Build Order</h1>
      <div className="extend-table build-order--comparison initialized">
        <div className="table-surface" style={{overflow: "auto"}}>
          <table>
            <thead>
              <tr className="group-id">
                <th className="id--image-text overflowable no-bold">
                  {" "}
                  <div className="persona-image">
                    <span>
                      <img
                        src={team1Image}
                        alt="Team 1"
                      />
                    </span>
                  </div>
                  <HaloButton players={team1Players} onSelected={(pi) => setSelectedTeam1PlayerIndex(pi)}/>
                </th>
                <th>Time</th>
                <th className="id--image-text overflowable no-bold">
                  {" "}
                  <div className="persona-image">
                    <span>
                      <img
                        src={team2Image}
                        alt="Team 2"
                      />
                    </span>
                  </div>
                  
                  <HaloButton players={team2Players} onSelected={(pi) => setSelectedTeam2PlayerIndex(pi)}/>
                </th>
              </tr>
            </thead>
            <tbody>
              {match.events.filter(e => [selectedTeam1PlayerIndex,selectedTeam2PlayerIndex].includes(e.PlayerIndex)).map((event, index) => {
                if (event.EventName === "BuildingConstructionQueued") {
                  buildingTracker[event.InstanceId] = {
                    BuildingId: event.BuildingId.toLowerCase(),
                    completed: false,
                    NewBuildingId: null,
                  };
                }
                if (event.EventName === "BuildingUpgraded") {
                  buildingTracker[event.InstanceId].NewBuildingId =
                    event.NewBuildingId.toLowerCase();
                }
                if (ignoreEvents.includes(event.EventName)) return;
                if(ignoreSquadIds.includes(event.SquadId)) return;
                if (event.TimeSinceStartMilliseconds == 0) return;
                let image = "";
                let name = "";
                if (
                  event.EventName === "UnitTrained" &&
                  gameObjectData[event?.SquadId]
                ) {
                    try {
                        name = gameObjectData[event?.SquadId].DisplayInfo.View.HW2ObjectDisplayInfo.Name
                  image = (gameObjectData[event?.SquadId].Image as TmpImage).View.Media.MediaUrl;
                    } catch (e) {
                      image =
                        "https://content.halocdn.com/media/Default/games/halo-wars-2/unit-icons/questionmark-3a21a267a9f4480688ed473882fc92eb.png";
                        console.error('missing squad image', gameObjectData[event?.SquadId], event)
                    }
                }
                if (
                  (event.EventName === "BuildingConstructionCompleted" ||
                    event.EventName === "BuildingUpgraded" ||
                    event.EventName === "BuildingRecycled") &&
                  gameObjectData[buildingTracker[event.InstanceId].BuildingId]
                ) {
                  const buildingId = (
                    buildingTracker[event.InstanceId].NewBuildingId
                      ? buildingTracker[event.InstanceId].NewBuildingId
                      : buildingTracker[event.InstanceId].BuildingId
                  ) as string;
                  try {
                    name = gameObjectData[buildingId].DisplayInfo.View.HW2ObjectDisplayInfo.Name;
                    image = (gameObjectData[buildingId].Image as TmpImage).View
                      .Media.MediaUrl;
                  } catch (e) {
                    image =
                      "https://content.halocdn.com/media/Default/games/halo-wars-2/unit-icons/questionmark-3a21a267a9f4480688ed473882fc92eb.png";
                  
                  }
                }
                  return (
                    <tr>
                      {event.PlayerIndex === selectedTeam2PlayerIndex && (
                        <>
                        <td></td>
                          <th>
                            {millisToMinutesAndSeconds(
                              event.TimeSinceStartMilliseconds
                            )}
                          </th>
                        </>
                      )}
                      <td className="id--image-text no-bold">
                        <div className="persona">
                          <span className="image avatar avatar--hw2-unit">
                            <span>
                              <img src={image} alt="" width={45} height={45} />
                            </span>
                          </span>
                          <span className="text">{name}</span>
                        </div>
                      </td>
                      {event.PlayerIndex === selectedTeam1PlayerIndex && (
                        <>
                          <th>
                            {millisToMinutesAndSeconds(
                              event.TimeSinceStartMilliseconds
                            )}
                          </th>
                          <td></td>
                        </>
                      )}
                    </tr>
                    
                    // <div>
                    //     {index} - {millisToMinutesAndSeconds(event.TimeSinceStartMilliseconds)}
                    // <span style={{marginLeft: event?.PlayerIndex && event?.PlayerIndex === 2 ? 200 : 30}}>{event.EventName} | {event?.PlayerIndex}</span>
                    // <img src={image} alt="" width={45} height={45}/>
                    // </div>
                  );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
