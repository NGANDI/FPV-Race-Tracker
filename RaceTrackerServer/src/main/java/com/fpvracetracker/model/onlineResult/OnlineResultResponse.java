package com.fpvracetracker.model.onlineResult;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.frontend.Race;

public class OnlineResultResponse {

	public Competition competition;
	public List<Race> races;

	public OnlineResultResponse() {
		super();
	}

	public OnlineResultResponse(Competition competition, List<Race> races) {
		super();
		this.competition = competition;
		this.races = races;
	}

	public Competition getCompetition() {
		return competition;
	}

	public void setCompetition(Competition competition) {
		this.competition = competition;
	}

	public List<Race> getRaces() {
		return races;
	}

	public void setRaces(List<Race> races) {
		this.races = races;
	}

}
