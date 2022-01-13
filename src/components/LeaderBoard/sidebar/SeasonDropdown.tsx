import { useState } from "react";
import { seasonData } from "../../../data/seasons";
import { Season } from "../../../interfaces/Season";

export const SeasonDropdown = ({season, onChange}: {season: Season, onChange: (season: Season) => void}) => {
    const [dropdown, setDropdown] = useState(false);
    const seasonId = season.View.Identity

    return (
        <nav className="nav" data-dropdown="">
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
          {season.View.HW2Season.DisplayInfo.View.HW2SeasonDisplayInfo.Name}
        </a>
        <ul className={`dropdown-content ${dropdown ? "show" : ""}`}>
            {seasonData.map((s) => {
                return (
<li>
<a
                href="#"
                onClick={(e) => {
                  setDropdown(!dropdown);
                  e.preventDefault();
                  e.stopPropagation();
                  onChange(s)
                }}
                className={`${seasonId === s.View.Identity ? 'selected' : ''}`}
              >
                {s.View.HW2Season.DisplayInfo.View.HW2SeasonDisplayInfo.Name}
            </a>
          </li>
                )
            })}
          
        </ul>
      </nav>
    )
}