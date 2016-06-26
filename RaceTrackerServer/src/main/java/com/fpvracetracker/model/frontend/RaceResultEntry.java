package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "raceResultEntries")
public class RaceResultEntry extends BaseEntity {

	private static final long serialVersionUID = 3294150690210790559L;
	public String raceUUID;
	public int round;
	public int heat;
	public String pilotUUID;
	public String pilotNumber;
	public String pilotName;
	public int rank;
	public int amountOfLaps;
	public double totalTime;
	public double lastRoundTime;
	public double bestRoundTime;
	public double averageRoundTime;
	public String deviceId;
	public boolean disqualified;
	@JsonIgnore
	@ManyToOne
	public RaceResult raceResult;
	@JsonIgnore
	@ManyToOne
	public Round roundEntity;

	public RaceResultEntry() {
		super();
	}

	public RaceResultEntry(String uuid, Date saved, Date synced, String raceUUID, int round, int heat, String pilotUUID,
			String pilotNumber, String pilotName, int rank, int amountOfLaps, double totalTime, double lastRoundTime,
			double bestRoundTime, double averageRoundTime, String deviceId, boolean disqualified, boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.raceUUID = raceUUID;
		this.round = round;
		this.heat = heat;
		this.pilotUUID = pilotUUID;
		this.pilotNumber = pilotNumber;
		this.pilotName = pilotName;
		this.rank = rank;
		this.amountOfLaps = amountOfLaps;
		this.totalTime = totalTime;
		this.lastRoundTime = lastRoundTime;
		this.bestRoundTime = bestRoundTime;
		this.averageRoundTime = averageRoundTime;
		this.deviceId = deviceId;
		this.disqualified = disqualified;
	}

}