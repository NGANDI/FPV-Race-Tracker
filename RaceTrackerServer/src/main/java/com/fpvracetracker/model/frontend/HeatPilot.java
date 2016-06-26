package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.IdClass;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fpvracetracker.model.compositeKeys.HeatPilotPK;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "heatPilots")
@IdClass(HeatPilotPK.class)
public class HeatPilot extends BaseEntity {

	private static final long serialVersionUID = 6334397600437174743L;
	public String firstName;
	public String lastName;
	public String alias;
	public String phone;
	public String country;
	public String email;
	public String club;
	public String deviceId;
	public int pilotNumber;
	@OneToOne(cascade = { CascadeType.ALL })
	public HeatPilotRaceBand assignedRaceBand;
	@ManyToOne
	@Id
	public Classs classs;
	@Id
	public String uuid;
	@JsonBackReference
	@ManyToOne
	@Id
	public Heat heat;

	public HeatPilot() {
		super();
	}

	public HeatPilot(String uuid, Date saved, Date synced, String firstName, String lastName, String alias, String phone, String country, String email, String club, int pilotNumber, String deviceId,
			HeatPilotRaceBand assignedRaceBand, Classs classs, boolean deleted, Heat heat) {
		super(uuid, saved, synced, deleted);
		this.firstName = firstName;
		this.lastName = lastName;
		this.alias = alias;
		this.phone = phone;
		this.country = country;
		this.email = email;
		this.club = club;
		this.pilotNumber = +pilotNumber;
		this.deviceId = deviceId;
		this.assignedRaceBand = assignedRaceBand;
		this.classs = classs;
		this.uuid = uuid;
		this.heat = heat;
	}

	public Heat getHeat() {
		return heat;
	}

	public void setHeat(Heat heat) {
		this.heat = heat;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getAlias() {
		return alias;
	}

	public void setAlias(String alias) {
		this.alias = alias;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getClub() {
		return club;
	}

	public void setClub(String club) {
		this.club = club;
	}

	public String getDeviceId() {
		return deviceId;
	}

	public void setDeviceId(String deviceId) {
		this.deviceId = deviceId;
	}

	public int getPilotNumber() {
		return pilotNumber;
	}

	public void setPilotNumber(int pilotNumber) {
		this.pilotNumber = pilotNumber;
	}

	public HeatPilotRaceBand getAssignedRaceBand() {
		return assignedRaceBand;
	}

	public void setAssignedRaceBand(HeatPilotRaceBand assignedRaceBand) {
		this.assignedRaceBand = assignedRaceBand;
	}

	public Classs getClasss() {
		return classs;
	}

	public void setClasss(Classs classs) {
		this.classs = classs;
	}

	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

}