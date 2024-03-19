import React, { useState } from "react";
import { useQuery } from "react-query";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
// Context
import useData from '../../../context/DataContext';
// API
import { adminAPI } from "../../../api";
// Icons
import IconPlus from "../../../../../../assets/images/reskin-images/icon--plus.svg";
import IconMinus from "../../../../../../assets/images/reskin-images/icon--minus.svg";
import IconSearch from "../../../../../../assets/images/reskin-images/icon--search.svg";

function BehaviorRow({ behavior }) {
  console.log('behavior', behavior);
  return (
    <div className="py-4 border-b border-gray flex items-center relative">
      <p>{behavior.title}</p>
      <div className="flex items-center ml-auto" style={{gap: '21px'}}>
        {behavior.has_h2h ? (
          <>
            {behavior.h2h_status === 'active' ? (
              <div className="uppercase" style={{background: '#E8FBED', borderRadius: '8px', color: 'rgba(53, 125, 34, 1)', padding: '4px 8px'}}>
                Active
              </div>
            ) : (
              <div className="uppercase" style={{background: '#FFEFEF', borderRadius: '8px', color: 'rgba(237, 19, 19, 1)', padding: '4px 8px'}}>
                Inactive
              </div>
            )}
          </>
        ) : (
          <div className="uppercase" style={{background: 'transparent', borderRadius: '8px', color: 'rgba(161, 161, 161, 1)', padding: '4px 8px'}}>
            Empty
          </div>
        )}
        <span style={{color: '#DAD9D9'}}>|</span>
        <NavLink
          className="flex items-center text-link-purple"
          to={`/v2/admin/behaviors/edit/${behavior.id}`}
          style={{fontWeight: '600'}}
        >
          Edit
        </NavLink>
      </div>
    </div>
  );
}

export default function AdminBehaviors() {
  const { data, isLoading, error } = useQuery("allBehaviors", adminAPI.getBehaviors);
  const { contentData } = useData();
  const modules = contentData?.modules;

  const [filterText, setFilterText] = useState("");
  const [activeModule, setActiveModule] = useState([]);
  const [singleActiveModule, setSingleActiveModule] = useState(null);

  const handleFilterChange = (event) => {
    const searchText = event.target.value.toLowerCase();
    setFilterText(searchText);

    if (searchText === "") {
      setActiveModule([]);
    } else {
      const matchingModules = modules.map((module, index) => {
        const moduleMatches = module.title.toLowerCase().includes(searchText);
        const behaviorMatches = module.behaviors.some((behavior) =>
          behavior.title.toLowerCase().includes(searchText)
        );
        return moduleMatches || behaviorMatches ? index : null;
      }).filter((item) => item !== null);

      setActiveModule(matchingModules);
    }
  };

  const handleModuleClick = (index) => {
    if (filterText === "") {
      setSingleActiveModule((prevSingleActiveModule) =>
        prevSingleActiveModule === index ? null : index
      );
    } else {
      setActiveModule((prevActiveModules) => {
        const isModuleActive = prevActiveModules.includes(index);

        if (isModuleActive) {
          return prevActiveModules.filter((item) => item !== index);
        } else {
          return [...prevActiveModules, index];
        }
      });
    }
  };

  return (
    <div>
      <h2 className="pb-8 pt-12" style={{ fontSize: "30px", fontWeight: "800" }}>
        Help to Habit Campaigns
      </h2>
      <div className="flex justify-between items-center pb-4">
        <h2 style={{ fontSize: "16px", fontWeight: "700" }}>Modules</h2>
        <div className="flex" style={{ gap: "12px" }}>
          <SVG src={IconSearch} />
          <input
            type="text"
            className="placeholder-text"
            value={filterText}
            onChange={handleFilterChange}
            placeholder="Find a Module by Name"
          />
        </div>
      </div>
      {modules && (
        <div id="moduleList" className="border-t border-gray">
          {modules.map((module, index) => (
            (module.title.toLowerCase().includes(filterText.toLowerCase()) ||
              module.behaviors.some((behavior) =>
                behavior.title.toLowerCase().includes(filterText.toLowerCase())
              )) && (
              <div key={index}>
                <div
                  className="border-b border-gray py-4"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleModuleClick(index)}
                >
                  <div className="flex justify-between items-center">
                    <p
                      className="uppercase"
                      style={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#6357b5",
                      }}
                    >
                      {module.title}
                    </p>
                    {filterText === "" ? (
                      index === singleActiveModule ? (
                        <SVG src={IconMinus} />
                      ) : (
                        <SVG src={IconPlus} />
                      )
                    ) : (
                      activeModule.includes(index) ? (
                        <SVG src={IconMinus} />
                      ) : (
                        <SVG src={IconPlus} />
                      )
                    )}
                  </div>
                </div>
                {module.behaviors.map((behavior) => (
                  behavior.title.toLowerCase().includes(filterText.toLowerCase()) && (
                    <div
                      key={behavior.id}
                      className={`${(filterText === "" && singleActiveModule === index) || activeModule.includes(index)
                        ? "block"
                        : "hidden"}`}
                      style={{
                        height: (filterText === "" && singleActiveModule === index) || activeModule.includes(index)
                          ? "auto"
                          : "0px",
                        transition: "height 0.3s ease",
                      }}
                    >
                      <BehaviorRow behavior={behavior} />
                    </div>
                  )
                ))}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

