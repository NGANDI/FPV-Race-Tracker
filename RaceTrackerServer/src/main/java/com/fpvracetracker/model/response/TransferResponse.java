package com.fpvracetracker.model.response;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.frontend.Classs;
import com.fpvracetracker.model.frontend.Competition;
import com.fpvracetracker.model.frontend.Pilot;
import com.fpvracetracker.model.frontend.Race;
import com.fpvracetracker.model.frontend.RaceBand;
import com.fpvracetracker.model.frontend.User;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TransferResponse {

	public List<Competition> competitions;
	public List<Race> races;
	public List<Pilot> pilots;
	public List<Classs> classes;
	public List<RaceBand> raceBands;
	public List<User> users;

	public TransferResponse() {
	}

	public TransferResponse(List<Competition> competitions, List<Race> races, List<Pilot> pilots,
			List<Classs> classes, List<RaceBand> raceBands, List<User> users) {
		super();
		this.competitions = competitions;
		this.races = races;
		this.pilots = pilots;
		this.classes = classes;
		this.raceBands = raceBands;
		this.users = users;
	}

	public List<Competition> getCompetitions() {
		return competitions;
	}

	public void setCompetitions(List<Competition> competitions) {
		this.competitions = competitions;
	}

	public List<Race> getRaces() {
		return races;
	}

	public void setRaces(List<Race> races) {
		this.races = races;
	}

	public List<Pilot> getPilots() {
		return pilots;
	}

	public void setPilots(List<Pilot> pilots) {
		this.pilots = pilots;
	}

	public List<Classs> getClasses() {
		return classes;
	}

	public void setClasses(List<Classs> classes) {
		this.classes = classes;
	}

	public List<RaceBand> getRaceBands() {
		return raceBands;
	}

	public void setRaceBands(List<RaceBand> raceBands) {
		this.raceBands = raceBands;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

}