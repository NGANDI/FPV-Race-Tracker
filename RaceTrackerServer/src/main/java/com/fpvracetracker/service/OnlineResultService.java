package com.fpvracetracker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fpvracetracker.dao.CompetitionDao;
import com.fpvracetracker.dao.RaceDao;
import com.fpvracetracker.model.frontend.Classs;
import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.frontend.CompetitionPilot;
import com.fpvracetracker.model.frontend.Heat;
import com.fpvracetracker.model.frontend.HeatPilot;
import com.fpvracetracker.model.frontend.Lap;
import com.fpvracetracker.model.frontend.Race;
import com.fpvracetracker.model.frontend.RaceResultEntry;
import com.fpvracetracker.model.frontend.Round;
import com.fpvracetracker.model.frontend.RoundResultEntry;
import com.fpvracetracker.model.onlineResult.OnlineResultResponse;

@Service
@Scope(BeanDefinition.SCOPE_PROTOTYPE)
public class OnlineResultService {

	@Autowired
	private CompetitionDao competitionDao;
	@Autowired
	private RaceDao raceDao;

	@Transactional
	public OnlineResultResponse getOnlineResultByOnlineResult(String onlineResultKey) {
		Competition competition = competitionDao.findByOnlineResultKey(onlineResultKey);
		if (competition == null) {
			return null;
		}
		List<Race> races = raceDao.findByCompetitionUUID(competition.uuid);
		OnlineResultResponse response = new OnlineResultResponse();
		if (races != null) {
			response.competition = competition;
			response.races = races;
		}
		try {
			removeAllPrivateDataFromPilots(response);
		} catch (Exception ex) {
			ex.printStackTrace();
		}
		return response;
	}

	private void removeAllPrivateDataFromPilots(OnlineResultResponse response) {
		// TODO: change to DTO
		for (Race r : response.races) {
			raceDao.detatch(r);
		}
		competitionDao.detatch(response.competition);
		response.competition.uuid = "";
		response.competition.owner = null;

		response.competition.competitionConfigs = null;

		for (Classs classs : response.competition.classes) {
			raceDao.detatch(classs);
			classs.owner = null;
			classs.uuid = "";
		}

		for (CompetitionPilot pilot : response.competition.pilots) {
			raceDao.detatch(pilot);
			pilot.email = "";
			pilot.phone = "";
			pilot.uuid = "";
			pilot.deviceId = "";
			pilot.uuid = "";
		}
		for (Race race : response.races) {
			race.owner = null;
			race.uuid = "";
			race.classs.uuid = "";
			race.classs.owner = null;
			for (RoundResultEntry result : race.qualificationResults) {
				result.pilotUUID = "";
				result.uuid = "";
			}
			for (Round round : race.rounds) {
				for (Heat heat : round.heats) {
					if (heat.heatResult != null) {
						heat.heatResult.uuid = "";
						for (RaceResultEntry result : heat.heatResult.results) {
							result.pilotUUID = "";
							result.uuid = "";
						}
						for (Lap lap : heat.heatResult.laps) {
							lap.uuid = "";
							lap.pilotUUID = "";
						}
					}
					for (HeatPilot pilot : heat.pilots) {
						raceDao.detatch(pilot);
						pilot.email = "";
						pilot.phone = "";
						pilot.uuid = "";
						pilot.deviceId = "";
						pilot.uuid = "";
					}
				}
			}
		}
	}

}
