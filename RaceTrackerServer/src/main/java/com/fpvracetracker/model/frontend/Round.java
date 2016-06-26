package com.fpvracetracker.model.frontend;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "rounds")
public class Round extends BaseEntity {

	private static final long serialVersionUID = -1786383479432951714L;
	public int roundNumber;
	public int amountOfHeats;
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	public List<Heat> heats;
	public Date timestamp;
	public String description;
	public double blockingTime;
	public double countdown;
	public double duration;
	public int amountOfLaps;
	public double lapDistance;
	public int amountOfQualifiedPilots;
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	public List<RaceResultEntry> competitionResults;
	@JsonIgnore
	@ManyToOne
	public Race race;

	public Round() {
		super();
	}

	public Round(String uuid, Date saved, Date synced, int roundNumber, int amountOfHeats, List<Heat> heats,
			Date timestamp, String description, double blockingTime, double countdown, double duration,
			int amountOfLaps, double lapDistance, int amountOfQualifiedPilots, List<RaceResultEntry> competitionResults,
			boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.roundNumber = roundNumber;
		this.amountOfHeats = amountOfHeats;
		this.heats = heats;
		this.timestamp = timestamp;
		this.description = description;
		this.blockingTime = blockingTime;
		this.countdown = countdown;
		this.duration = duration;
		this.amountOfLaps = amountOfLaps;
		this.lapDistance = lapDistance;
		this.amountOfQualifiedPilots = amountOfQualifiedPilots;
		this.competitionResults = competitionResults;
	}

	public int getRoundNumber() {
		return roundNumber;
	}

	public void setRoundNumber(int roundNumber) {
		this.roundNumber = roundNumber;
	}

	public int getAmountOfHeats() {
		return amountOfHeats;
	}

	public void setAmountOfHeats(int amountOfHeats) {
		this.amountOfHeats = amountOfHeats;
	}

	public List<Heat> getHeats() {
		return heats;
	}

	public void setHeats(List<Heat> heats) {
		this.heats = heats;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public double getBlockingTime() {
		return blockingTime;
	}

	public void setBlockingTime(double blockingTime) {
		this.blockingTime = blockingTime;
	}

	public double getCountdown() {
		return countdown;
	}

	public void setCountdown(double countdown) {
		this.countdown = countdown;
	}

	public double getDuration() {
		return duration;
	}

	public void setDuration(double duration) {
		this.duration = duration;
	}

	public int getAmountOfLaps() {
		return amountOfLaps;
	}

	public void setAmountOfLaps(int amountOfLaps) {
		this.amountOfLaps = amountOfLaps;
	}

	public double getLapDistance() {
		return lapDistance;
	}

	public void setLapDistance(double lapDistance) {
		this.lapDistance = lapDistance;
	}

	public int getAmountOfQualifiedPilots() {
		return amountOfQualifiedPilots;
	}

	public void setAmountOfQualifiedPilots(int amountOfQualifiedPilots) {
		this.amountOfQualifiedPilots = amountOfQualifiedPilots;
	}

	public List<RaceResultEntry> getCompetitionResults() {
		return competitionResults;
	}

	public void setCompetitionResults(List<RaceResultEntry> competitionResults) {
		this.competitionResults = competitionResults;
	}

}