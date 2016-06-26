package com.fpvracetracker.model.frontend;

import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "roundResultEntries")
public class RoundResultEntry extends BaseEntity {

	private static final long serialVersionUID = -6437552894066134177L;
	public String pilotUUID;
	public String pilotNumber;
	public String pilotName;
	public int rank;
	@ElementCollection(fetch = FetchType.EAGER)
	@Column(name = "lapTimes")
//	@Type(type = "com.model.ByteArrayType")
	public List<Double> lapTimes;
	public double lapTimesSum;
	public String deviceId;
	public boolean disqualified;

	@JsonIgnore
	@ManyToOne
	public Race race;

	public RoundResultEntry() {
		super();
	}

	public RoundResultEntry(String uuid, Date saved, Date synced, String pilotUUID, String pilotNumber,
			String pilotName, int rank, List<Double> lapTimes, double lapTimesSum, String deviceId,
			boolean disqualified, boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.pilotUUID = pilotUUID;
		this.pilotNumber = pilotNumber;
		this.pilotName = pilotName;
		this.rank = rank;
		this.lapTimes = lapTimes;
		this.lapTimesSum = lapTimesSum;
		this.deviceId = deviceId;
		this.disqualified = disqualified;
	}

	public String getPilotUUID() {
		return pilotUUID;
	}

	public void setPilotUUID(String pilotUUID) {
		this.pilotUUID = pilotUUID;
	}

	public String getPilotNumber() {
		return pilotNumber;
	}

	public void setPilotNumber(String pilotNumber) {
		this.pilotNumber = pilotNumber;
	}

	public String getPilotName() {
		return pilotName;
	}

	public void setPilotName(String pilotName) {
		this.pilotName = pilotName;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	public List<Double> getLapTimes() {
		return lapTimes;
	}

	public void setLapTimes(List<Double> lapTimes) {
		this.lapTimes = lapTimes;
	}

	public double getLapTimesSum() {
		return lapTimesSum;
	}

	public void setLapTimesSum(double lapTimesSum) {
		this.lapTimesSum = lapTimesSum;
	}

	public String getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}

	public boolean isDisqualified() {
		return disqualified;
	}

	public void setDisqualified(boolean disqualified) {
		this.disqualified = disqualified;
	}

}