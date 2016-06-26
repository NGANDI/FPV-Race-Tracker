package com.fpvracetracker.model.frontend;

import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "raceResults")
public class RaceResult extends BaseEntity {

	private static final long serialVersionUID = 4319733135892231172L;
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	public List<RaceResultEntry> results;
	@OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
	public List<Lap> laps;
	public Date timestamp;

	public RaceResult() {
		super();
	}

	public RaceResult(String uuid, Date saved, Date synced, List<RaceResultEntry> results, List<Lap> laps,
			Date timestamp, boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.results = results;
		this.laps = laps;
		this.timestamp = timestamp;
	}

	public List<RaceResultEntry> getResults() {
		return results;
	}

	public void setResults(List<RaceResultEntry> results) {
		this.results = results;
	}

	public List<Lap> getLaps() {
		return laps;
	}

	public void setLaps(List<Lap> laps) {
		this.laps = laps;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

}