package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "laps")
public class Lap extends BaseEntity {

	private static final long serialVersionUID = -6091556246396311642L;
	public String raceUUID;
	public String pilotUUID;
	public String pilotName;
	public int lapNumber;
	public double startTime;
	public double endTime;
	public double time;
	public double penalty;
	public double totalTime;
	public boolean disqualified;

	public Lap() {
		super();
	}

	public Lap(String uuid, Date saved, Date synced, String raceUUID, String pilotUUID, String pilotName, int lapNumber,
			double startTime, double endTime, double time, double penalty, double totalTime, boolean disqualified,
			boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.raceUUID = raceUUID;
		this.pilotUUID = pilotUUID;
		this.pilotName = pilotName;
		this.lapNumber = lapNumber;
		this.startTime = startTime;
		this.endTime = endTime;
		this.time = time;
		this.penalty = penalty;
		this.totalTime = totalTime;
		this.disqualified = disqualified;
	}

	public String getRaceUUID() {
		return raceUUID;
	}

	public void setRaceUUID(String raceUUID) {
		this.raceUUID = raceUUID;
	}

	public String getPilotUUID() {
		return pilotUUID;
	}

	public void setPilotUUID(String pilotUUID) {
		this.pilotUUID = pilotUUID;
	}

	public String getPilotName() {
		return pilotName;
	}

	public void setPilotName(String pilotName) {
		this.pilotName = pilotName;
	}

	public int getLapNumber() {
		return lapNumber;
	}

	public void setLapNumber(int lapNumber) {
		this.lapNumber = lapNumber;
	}

	public double getStartTime() {
		return startTime;
	}

	public void setStartTime(double startTime) {
		this.startTime = startTime;
	}

	public double getEndTime() {
		return endTime;
	}

	public void setEndTime(double endTime) {
		this.endTime = endTime;
	}

	public double getTime() {
		return time;
	}

	public void setTime(double time) {
		this.time = time;
	}

	public double getPenalty() {
		return penalty;
	}

	public void setPenalty(double penalty) {
		this.penalty = penalty;
	}

	public double getTotalTime() {
		return totalTime;
	}

	public void setTotalTime(double totalTime) {
		this.totalTime = totalTime;
	}

	public boolean isDisqualified() {
		return disqualified;
	}

	public void setDisqualified(boolean disqualified) {
		this.disqualified = disqualified;
	}

}