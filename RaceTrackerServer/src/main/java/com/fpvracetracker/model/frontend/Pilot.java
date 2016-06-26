package com.fpvracetracker.model.frontend;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "pilots")
@NamedQueries({ @NamedQuery(name = Pilot.FIND_ALL_BY_OWNER, query = "SELECT p FROM Pilot p WHERE p.owner.uuid = :ownerUUID") })
public class Pilot extends BaseEntity {

	private static final long serialVersionUID = 5451274762342717963L;
	public static final String FIND_ALL_BY_OWNER = "Pilot.findAllByOwner";
	public static final String OWNER_UUID = "ownerUUID";

	public String firstName;
	public String lastName;
	public String alias;
	public String phone;
	public String country;
	public String email;
	public String club;
	public String deviceId;
	public int pilotNumber;
	@ManyToOne(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
	public Classs classs;
	@ManyToOne
	public User owner;

	public Pilot() {
		super();
	}

	public Pilot(String uuid, Date saved, Date synced, String firstName, String lastName, String alias, String phone, String country, String email, String club, int pilotNumber, String deviceId,
			Classs classs, User owner, boolean deleted) {
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
		this.classs = classs;
		this.owner = owner;
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

	public Classs getClasss() {
		return classs;
	}

	public void setClasss(Classs classs) {
		this.classs = classs;
	}

	public User getOwner() {
		return owner;
	}

	public void setOwner(User owner) {
		this.owner = owner;
		if (this.classs != null) {
			this.classs.setOwner(owner);
		}
	}

}