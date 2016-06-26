package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.compositeKeys.HeatPilotRaceBandPK;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "heatPilotRaceBands")
@IdClass(HeatPilotRaceBandPK.class)
public class HeatPilotRaceBand extends BaseEntity {

	private static final long serialVersionUID = -5883516769116144167L;

	public String value;

	@Id
	public String uuid;

	@JsonIgnore
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE)
	public Long id;

	public HeatPilotRaceBand() {
		super();
	}

	public HeatPilotRaceBand(String uuid, Date saved, Date synced, String value, boolean deleted) {
		super(uuid, saved, synced, deleted);
		this.value = value;
	}

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

}