package com.fpvracetracker.model.frontend;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "heats")
public class Heat extends BaseEntity {

	private static final long serialVersionUID = -7925873523309259511L;

	public int heatNumber;

	@JsonManagedReference
	@OneToMany(fetch = FetchType.EAGER, cascade = { CascadeType.ALL }, orphanRemoval = true)
	public List<HeatPilot> pilots;
	@OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
	public RaceResult heatResult;
	public Date timestamp;
	public Date startTime;

	@JsonIgnore
	@ManyToOne
	@JoinColumn
	public Round round;

	public Heat() {
		super();
	}

	public Heat(String uuid, Date saved, Date synced, int heatNumber, List<HeatPilot> pilots, RaceResult heatResult, Date timestamp, Date startTime, boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.heatNumber = heatNumber;
		this.pilots = pilots;
		this.heatResult = heatResult;
		this.timestamp = timestamp;
		this.startTime = startTime;
	}

	public void prepairPilots() {
		if (pilots == null) {
			return;
		}
		int size = pilots.size();
		for (int i = 0; i < size; i++) {

			if (pilots.get(i).classs != null) {
				pilots.get(i).heat = this;
			} else {
				pilots.remove(i);
				i--;
				size = pilots.size();
			}
		}
	}

	public int getHeatNumber() {
		return heatNumber;
	}

	public void setHeatNumber(int heatNumber) {
		this.heatNumber = heatNumber;
	}

	public List<HeatPilot> getPilots() {
		return pilots;
	}

	public void setPilots(List<HeatPilot> pilots) {
		this.pilots = pilots;
	}

	public RaceResult getHeatResult() {
		return heatResult;
	}

	public void setHeatResult(RaceResult heatResult) {
		this.heatResult = heatResult;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public Date getStartTime() {
		return startTime;
	}

	public void setStartTime(Date startTime) {
		this.startTime = startTime;
	}

}